'use client'
import { AppShell } from '@/components/layout/AppShell'
import { WorldMap } from '@/components/heatmap/WorldMap'
import { SpilloverMatrix } from '@/components/heatmap/SpilloverMatrix'
import { mockHeatmap } from '@/lib/mock/heatmap'
import { getRiskColor, riskLevelLabel } from '@/lib/utils'
import { useState } from 'react'
import { MacroThemeKey, CountryRiskScore } from '@/types'
import { Info, ChevronLeft } from 'lucide-react'

const THEMES: { key: MacroThemeKey; label: string; emoji: string; what: string; whyItMatters: string }[] = [
  { key: 'inflation',    label: 'Inflation',       emoji: '📈', what: 'Consumer price growth, CPI/PPI divergence, energy pass-through',           whyItMatters: 'High inflation forces central banks to raise rates, tightening credit conditions globally.' },
  { key: 'rate-hikes',   label: 'Rate Hikes',      emoji: '🏦', what: 'Central bank policy rate trajectory, real interest rate levels',            whyItMatters: 'Rising rates compress equity valuations, strengthen currencies, and pressure EM debt.' },
  { key: 'recession',    label: 'Recession Risk',  emoji: '📉', what: 'PMI contraction, yield curve inversion, GDP deceleration',                  whyItMatters: 'A recession triggers credit defaults, unemployment spikes, and reduced global trade.' },
  { key: 'currency',     label: 'Currency Stress', emoji: '💱', what: 'FX volatility, reserve depletion, current account imbalances',              whyItMatters: 'Currency crises can trigger capital flight, import inflation, and sovereign debt stress.' },
  { key: 'geopolitical', label: 'Geopolitical',    emoji: '🌐', what: 'Conflict proximity, sanctions exposure, supply chain disruption risk',      whyItMatters: 'Geopolitical shocks disrupt trade routes, energy supplies, and investor confidence.' },
  { key: 'energy',       label: 'Energy Crisis',   emoji: '⚡', what: 'Energy import dependency, price spikes, grid stability',                    whyItMatters: 'Energy shocks cascade into broad inflation, industry shutdowns, and political instability.' },
  { key: 'property',     label: 'Property Stress', emoji: '🏠', what: 'Real estate leverage, developer defaults, mortgage delinquency',            whyItMatters: 'Property busts destroy household wealth, hurt bank balance sheets, and reduce consumption.' },
  { key: 'supply-chain', label: 'Supply Chain',    emoji: '🚢', what: 'Trade route disruptions, port congestion, inventory cycle stress',          whyItMatters: 'Supply chain shocks drive goods inflation, lower corporate margins, and slow production.' },
]

export default function HeatMapPage() {
  const [activeTheme, setActiveTheme] = useState<MacroThemeKey>('inflation')
  const [selected, setSelected]       = useState<CountryRiskScore | null>(null)
  const [showInfo, setShowInfo]       = useState(false)
  const [detailOpen, setDetailOpen]   = useState(false)

  const themeMeta    = THEMES.find(t => t.key === activeTheme)!
  const themeData    = mockHeatmap.map(c => ({ ...c, riskScore: c.themeScores[activeTheme] ?? Math.round(c.riskScore * 0.6) }))
  const topCountries = [...themeData].sort((a, b) => b.riskScore - a.riskScore).slice(0, 3)

  const handleCountryClick = (code: string) => {
    const found = mockHeatmap.find(c => c.countryCode === code)
    setSelected(found ?? null)
    if (found) setDetailOpen(true)
  }

  return (
    <AppShell title="Global Risk Heat Map" subtitle="Country-level macro risk by theme — tap a country for details">
      <div className="space-y-4">

        {/* Theme selector */}
        <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-xl p-3">
          <div className="text-[10px] text-[#4A5A6E] uppercase tracking-wider mb-2">Select a theme:</div>
          <div className="flex gap-1.5 flex-wrap">
            {THEMES.map(t => (
              <button
                key={t.key}
                onClick={() => { setActiveTheme(t.key); setSelected(null); setDetailOpen(false) }}
                className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeTheme === t.key
                    ? 'bg-[#00C2FF]/15 text-[#00C2FF] border-[#00C2FF]/50 shadow-sm'
                    : 'text-[#7A8FA6] border-[#1E2A3B] hover:border-[#2D7DD2]/40 hover:text-[#E8EDF5]'
                }`}
              >
                <span className="hidden sm:inline">{t.emoji} </span>{t.label}
              </button>
            ))}
          </div>

          {/* Active theme description */}
          <div className="mt-3 pt-3 border-t border-[#1E2A3B] flex items-start gap-3">
            <button onClick={() => setShowInfo(v => !v)} className="shrink-0 mt-0.5 text-[#4A5A6E] hover:text-[#00C2FF] transition-colors" title="Toggle explanation">
              <Info className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-semibold text-[#E8EDF5]">{themeMeta.emoji} {themeMeta.label} Risk</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {topCountries.map((c, i) => (
                    <span key={c.countryCode} className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                      style={{ color: getRiskColor(c.riskLevel), borderColor: getRiskColor(c.riskLevel) + '40', backgroundColor: getRiskColor(c.riskLevel) + '15' }}>
                      #{i + 1} {c.countryCode} {c.riskScore}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#7A8FA6]"><span className="text-[#4A5A6E]">Measures:</span> {themeMeta.what}</p>
              {showInfo && (
                <p className="text-xs text-[#F5A623] mt-1.5 leading-relaxed">
                  <span className="font-semibold">Why it matters:</span> {themeMeta.whyItMatters}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: country detail drawer */}
        {detailOpen && selected && (
          <div className="lg:hidden bg-[#0F1623] border border-[#1E2A3B] rounded-md animate-scale-in">
            <div className="px-4 py-3 border-b border-[#1E2A3B] flex items-center justify-between">
              <button onClick={() => setDetailOpen(false)} className="flex items-center gap-1 text-xs text-[#2D7DD2]">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to map
              </button>
              <div className="text-right">
                <span className="text-sm font-semibold text-[#E8EDF5]">{selected.countryName}</span>
                <span className="ml-2 text-lg font-bold font-mono" style={{ color: getRiskColor(selected.riskLevel) }}>
                  {themeData.find(c => c.countryCode === selected.countryCode)?.riskScore ?? selected.riskScore}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {selected.activeThemes.map(t => (
                  <span key={t} className="text-xs bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <div>
                <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Score Breakdown</div>
                {Object.entries(selected.scoreBreakdown).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#7A8FA6] capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-[#1E2A3B] rounded-full overflow-hidden">
                        <div className="h-full bg-[#00C2FF] rounded-full" style={{ width: `${v}%` }} />
                      </div>
                      <span className="text-xs font-mono text-[#E8EDF5] w-6 text-right">{v}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-1">Impacted Assets</div>
                <div className="flex flex-wrap gap-1">
                  {selected.impactedAssets.map(a => (
                    <span key={a} className="text-xs bg-[#161D2E] text-[#7A8FA6] border border-[#1E2A3B] px-1.5 py-0.5 rounded">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map + detail: stacked on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-3 md:p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">
                  {themeMeta.emoji} {themeMeta.label} Exposure
                </div>
                <div className="text-[10px] text-[#4A5A6E] hidden sm:block">Click a country for breakdown</div>
              </div>
              <WorldMap data={themeData} onSelectCountry={handleCountryClick} selectedCode={selected?.countryCode} />
              {/* Legend */}
              <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                <div className="text-[10px] text-[#4A5A6E]">{themeMeta.label} risk (0–100)</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['low', 'moderate', 'elevated', 'high', 'critical'] as const).map(l => (
                    <div key={l} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: getRiskColor(l) }} />
                      <span className="text-[10px] capitalize text-[#4A5A6E]">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop country detail panel */}
          <div className="hidden lg:block lg:col-span-4">
            {selected ? (
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
                <div className="px-4 py-3 border-b border-[#1E2A3B] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#E8EDF5]">{selected.countryName}</h3>
                    <span className="text-xs text-[#4A5A6E] font-mono">{selected.countryCode}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono" style={{ color: getRiskColor(selected.riskLevel) }}>
                      {themeData.find(c => c.countryCode === selected.countryCode)?.riskScore ?? selected.riskScore}
                    </div>
                    <div className="text-[10px] text-[#4A5A6E]">{themeMeta.label} score</div>
                    <div className="text-xs font-medium mt-0.5" style={{ color: getRiskColor(selected.riskLevel) }}>{riskLevelLabel(selected.riskLevel)}</div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
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
                  <div>
                    <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">All Theme Scores</div>
                    {THEMES.slice(0, 5).map(t => {
                      const score = selected.themeScores[t.key] ?? 0
                      return (
                        <div key={t.key} className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs ${t.key === activeTheme ? 'text-[#00C2FF] font-semibold' : 'text-[#7A8FA6]'}`}>{t.emoji} {t.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-[#1E2A3B] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: t.key === activeTheme ? '#00C2FF' : '#2D7DD2' }} />
                            </div>
                            <span className={`text-xs font-mono w-6 text-right ${t.key === activeTheme ? 'text-[#00C2FF]' : 'text-[#E8EDF5]'}`}>{score}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div>
                    <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Active Themes</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.activeThemes.map(t => (
                        <span key={t} className="text-xs bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                  {selected.topNews.length > 0 && (
                    <div>
                      <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Top News</div>
                      {selected.topNews.slice(0, 2).map(n => (
                        <p key={n.id} className="text-xs text-[#7A8FA6] leading-relaxed mb-1">{n.headline}</p>
                      ))}
                    </div>
                  )}
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
                  <div className="text-3xl mb-2">{themeMeta.emoji}</div>
                  <p className="text-sm font-medium text-[#7A8FA6] mb-1">{themeMeta.label} Risk Map</p>
                  <p className="text-xs leading-relaxed">Click any country to see its detailed {themeMeta.label.toLowerCase()} risk breakdown</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <SpilloverMatrix activeTheme={activeTheme} />
      </div>
    </AppShell>
  )
}
