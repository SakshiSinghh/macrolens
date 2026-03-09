'use client'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { geoEqualEarth } from 'd3-geo'
import { CountryRiskScore } from '@/types'
import { getRiskColor } from '@/lib/utils'

// Map country codes to what react-simple-maps uses
const codeMap: Record<string, string> = {
  US: 'USA', CN: 'CHN', DE: 'DEU', TR: 'TUR', GB: 'GBR',
  JP: 'JPN', BR: 'BRA', RU: 'RUS', AU: 'AUS', FR: 'FRA',
  IT: 'ITA', ZA: 'ZAF', MX: 'MEX', KR: 'KOR', IN: 'IND', CA: 'CAN',
}

// Geographic centres (lon, lat) for each tracked country
const COUNTRY_COORDS: Record<string, [number, number]> = {
  US: [-100, 40], CN: [105, 35], DE: [10, 51],
  TR: [35, 39],  GB: [-2, 54],  JP: [138, 37],
  BR: [-47, -15], RU: [65, 62], AU: [134, -27],
  FR: [2, 46],   IT: [12, 42], ZA: [25, -29],
  MX: [-102, 24], KR: [128, 37], IN: [78, 20], CA: [-95, 60],
}

// Risk-contagion links derived from mock heatmap spilloverTo data
const SPILLOVER_CONNECTIONS: Array<{ from: string; to: string }> = [
  { from: 'US', to: 'BR' },
  { from: 'US', to: 'TR' },
  { from: 'US', to: 'JP' },
  { from: 'CN', to: 'AU' },
  { from: 'CN', to: 'KR' },
  { from: 'CN', to: 'JP' },
  { from: 'RU', to: 'DE' },
]

// Recreate the same geoEqualEarth projection react-simple-maps uses internally
// (scale=140, default width=800, height=360 → translate=[400, 180])
const PROJ = geoEqualEarth().scale(140).center([0, 0]).translate([400, 180])

interface SpilloverLayerProps {
  connections: Array<{ from: string; to: string }>
  scores: Record<string, number>
}

function SpilloverLayer({ connections, scores }: SpilloverLayerProps) {
  return (
    <g>
      <defs>
        <marker
          id="spill-arrow"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <polygon points="0 0, 5 2.5, 0 5" fill="#F5A623" fillOpacity={0.75} />
        </marker>
      </defs>

      {connections.map((conn, i) => {
        const srcCoords = COUNTRY_COORDS[conn.from]
        const dstCoords = COUNTRY_COORDS[conn.to]
        if (!srcCoords || !dstCoords) return null

        const src = PROJ(srcCoords)
        const dst = PROJ(dstCoords)
        if (!src || !dst) return null

        // Pull the arc's midpoint toward the top of the map for a curved path
        const mx = (src[0] + dst[0]) / 2
        const my = (src[1] + dst[1]) / 2 - 28

        // Shorten the endpoint so the arrowhead doesn't overlap country fill
        const dx = dst[0] - src[0]
        const dy = dst[1] - src[1]
        const len = Math.sqrt(dx * dx + dy * dy)
        const endX = dst[0] - (dx / len) * 8
        const endY = dst[1] - (dy / len) * 8

        const d = `M ${src[0].toFixed(1)} ${src[1].toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`

        const srcScore = scores[conn.from] ?? 0
        const isHighRisk = srcScore >= 75

        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#F5A623"
            strokeWidth={isHighRisk ? 1.5 : 0.8}
            strokeOpacity={isHighRisk ? 0.65 : 0.35}
            strokeDasharray="3 2"
            markerEnd="url(#spill-arrow)"
          />
        )
      })}
    </g>
  )
}

interface WorldMapProps {
  data: (CountryRiskScore & { riskScore: number })[]
  onSelectCountry: (code: string) => void
  selectedCode?: string
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export function WorldMap({ data, onSelectCountry, selectedCode }: WorldMapProps) {
  const scoreByAlpha3 = Object.fromEntries(
    data.map(c => [codeMap[c.countryCode] ?? c.countryCode, { score: c.riskScore, level: c.riskLevel, name: c.countryName, code: c.countryCode }])
  )

  // Score lookup by ISO-2 code for the spillover layer
  const scoreMap = Object.fromEntries(data.map(c => [c.countryCode, c.riskScore]))

  // Only draw arrows for countries present in the dataset
  const activeConnections = SPILLOVER_CONNECTIONS.filter(
    c => scoreMap[c.from] !== undefined && scoreMap[c.to] !== undefined
  )

  return (
    <ComposableMap
      projectionConfig={{ scale: 140 }}
      style={{ width: '100%', height: '100%' }}
      height={360}
    >
      {/* Spillover arrows rendered below country fills */}
      <SpilloverLayer connections={activeConnections} scores={scoreMap} />

      <ZoomableGroup>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const id = geo.properties.name
              const entry = Object.values(scoreByAlpha3).find(e =>
                e.code === geo.properties.ISO_A2 ||
                e.name.toLowerCase() === id?.toLowerCase()
              )
              const fill = entry ? getRiskColor(entry.level) : '#1E2A3B'
              const isSelected = entry?.code === selectedCode

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => entry && onSelectCountry(entry.code)}
                  style={{
                    default: {
                      fill: isSelected ? '#00C2FF' : fill,
                      stroke: '#080C14',
                      strokeWidth: 0.5,
                      outline: 'none',
                      opacity: entry ? 0.85 : 0.3,
                    },
                    hover: {
                      fill: entry ? '#00C2FF' : '#2D7DD2',
                      stroke: '#080C14',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: entry ? 'pointer' : 'default',
                      opacity: 0.95,
                    },
                    pressed: { fill: '#00C2FF', outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  )
}
