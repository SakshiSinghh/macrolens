'use client'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { CountryRiskScore } from '@/types'
import { getRiskColor } from '@/lib/utils'

// Map country codes to what react-simple-maps uses
const codeMap: Record<string, string> = {
  US: 'USA', CN: 'CHN', DE: 'DEU', TR: 'TUR', GB: 'GBR',
  JP: 'JPN', BR: 'BRA', RU: 'RUS', AU: 'AUS', FR: 'FRA',
  IT: 'ITA', ZA: 'ZAF', MX: 'MEX', KR: 'KOR', IN: 'IND', CA: 'CAN',
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

  return (
    <ComposableMap
      projectionConfig={{ scale: 140 }}
      style={{ width: '100%', height: '100%' }}
      height={360}
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const id = geo.properties.name
              // Try to match by ISO numeric or name
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
