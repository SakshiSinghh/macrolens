'use client'
import { AppShell } from '@/components/layout/AppShell'
import { WorldMap } from '@/components/heatmap/WorldMap'
import { SpilloverMatrix } from '@/components/heatmap/SpilloverMatrix'
import { mockHeatmap } from '@/lib/mock/heatmap'
import { getRiskColor, riskLevelLabel } from '@/lib/utils'
import { useState } from 'react'
import { MacroThemeKey, CountryRiskScore } from '@/types'

const THEMES: { key: MacroThemeKey; label: string }[] = [
  { key: 'inflation', label: 'Inflation' },
  { key: 'rate-hikes', label: 'Rate Hikes' },
  { key: 'recession', label: 'Recession Risk' },
  { key: 'currency', label: 'Currency Stress' },
  { key: 'geopolitical', label: 'Geopolitical' },
  { key: 'energy', label: 'Energy Crisis' },
  { key: 'property', label: 'Property Stress' },
  { key: 'supply-chain', label: 'Supply Chain' },
]

export default function HeatMapPage() {
  const [activeTheme, setActiveTheme] = useState<MacroThemeKey>('inflation')
  const [selected, setSelected] = useState<CountryRiskScore | null>(null)

  const themeData = mockHeatmap.map(c => ({
    ...c,
    riskScore: c.themeScores[activeTheme] ?? Math.round(c.riskScore * 0.6),
  }))

  return (
    <AppShell title="Global Risk Heat Map" subtitle="Country-level macro risk by theme">
      <div className="space-y-4">
        {/* Theme selector */}
        <div className="flex gap-2 flex-wrap">
          {THEMES.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTheme(t.key)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                activeTheme === t.key
                  ? 'bg-[#00C2FF]/15 text-[#00C2FF] border-[#00C2FF]/40'
                  : 'text-[#7A8FA6] border-[#1E2A3B] hover:border-[#2D7DD2]/40 hover:text-[#E8EDF5]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Map */}
          <div className="col-span-8">
            <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
              <WorldMap
                data={themeData}
                onSelectCountry={code => {
                  const found = mockHeatmap.find(c => c.countryCode === code)
                  setSelected(found ?? null)
                }}
                selectedCode={selected?.countryCode}
              />
              {/* Legend */}
              <div className="flex items-center justify-end gap-4 mt-3 text-xs text-[#4A5A6E]">
                <span>Risk:</span>
                {(['low', 'moderate', 'elevated', 'high', 'critical'] as const).map(l => (
                  <div key={l} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getRiskColor(l) }} />
                    <span className="capitalize">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Country panel */}
          <div className="col-span-4">
            {selected ? (
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
                <div className="px-4 py-3 border-b border-[#1E2A3B] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#E8EDF5]">{selected.countryName}</h3>
                    <span className="text-xs text-[#4A5A6E] font-mono">{selected.countryCode}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono" style={{ color: getRiskColor(selected.riskLevel) }}>
                      {selected.riskScore}
                    </div>
                    <div className="text-xs" style={{ color: getRiskColor(selected.riskLevel) }}>
                      {riskLevelLabel(selected.riskLevel)}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {/* Score breakdown */}
                  <div>
                    <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Score Breakdown</div>
                    {Object.entries(selected.scoreBreakdown).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#7A8FA6] capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1 bg-[#1E2A3B] rounded-full overflow-hidden">
                            <div className="h-full bg-[#00C2FF] rounded-full" style={{ width: `${v}%` }} />
                          </div>
                          <span className="text-xs font-mono text-[#E8EDF5] w-6 text-right">{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active themes */}
                  <div>
                    <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Active Themes</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.activeThemes.map(t => (
                        <span key={t} className="text-xs bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Top news */}
                  {selected.topNews.length > 0 && (
                    <div>
                      <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Top News</div>
                      <div className="space-y-2">
                        {selected.topNews.slice(0, 2).map(n => (
                          <p key={n.id} className="text-xs text-[#7A8FA6] leading-relaxed">{n.headline}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Impacted assets */}
                  <div>
                    <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Impacted Assets</div>
                    <div className="flex flex-wrap gap-1">
                      {selected.impactedAssets.map(a => (
                        <span key={a} className="text-xs bg-[#161D2E] text-[#7A8FA6] border border-[#1E2A3B] px-1.5 py-0.5 rounded">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md h-full flex items-center justify-center p-8">
                <div className="text-center text-[#4A5A6E]">
                  <div className="text-3xl mb-2">🗺</div>
                  <p className="text-sm">Click a country on the map to see details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spillover matrix */}
        <SpilloverMatrix activeTheme={activeTheme} />
      </div>
    </AppShell>
  )
}
