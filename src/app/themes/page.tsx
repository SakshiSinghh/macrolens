'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { mockThemes } from '@/lib/mock/themes'
import { TrendBadge, Badge } from '@/components/ui/Badge'
import { RiskMeter } from '@/components/ui/RiskMeter'
import { Sparkline } from '@/components/ui/Sparkline'
import { SignalScore } from '@/components/ui/SignalScore'
import { getTrendColor, getTrendIcon, timeAgo } from '@/lib/utils'
import { MacroTheme } from '@/types'

export default function ThemesPage() {
  const [selected, setSelected] = useState<MacroTheme>(mockThemes[0])
  const [detailOpen, setDetailOpen] = useState(false)

  const handleSelect = (theme: MacroTheme) => {
    setSelected(theme)
    setDetailOpen(true)
  }

  return (
    <AppShell title="Theme Radar" subtitle="Detected macro themes and momentum tracking">
      {/* Mobile: back button when detail is open */}
      {detailOpen && (
        <button
          onClick={() => setDetailOpen(false)}
          className="md:hidden mb-3 text-xs text-[#2D7DD2] flex items-center gap-1"
        >
          ← Back to theme list
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Theme list — hidden on mobile when detail is open */}
        <div className={`lg:col-span-4 space-y-2 ${detailOpen ? 'hidden lg:block' : 'block'}`}>
          {mockThemes.map(theme => {
            const trendColor = getTrendColor(theme.trendDirection)
            const isSelected = theme.id === selected.id
            return (
              <div
                key={theme.id}
                onClick={() => handleSelect(theme)}
                className={`bg-[#0F1623] border rounded-md p-4 cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[#00C2FF]/50 bg-[#0F1E2E]'
                    : 'border-[#1E2A3B] hover:border-[#00C2FF]/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-[#E8EDF5]">{theme.name}</span>
                      {theme.badge && <TrendBadge badge={theme.badge} />}
                    </div>
                    <div className="text-xs text-[#4A5A6E]">First detected {timeAgo(theme.firstDetectedAt)}</div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-xl font-bold font-mono" style={{ color: trendColor }}>{theme.momentumScore}</div>
                    <div className="text-xs font-mono" style={{ color: trendColor }}>{getTrendIcon(theme.trendDirection)}</div>
                  </div>
                </div>
                <RiskMeter
                  score={theme.momentumScore}
                  level={theme.momentumScore > 75 ? 'high' : theme.momentumScore > 55 ? 'elevated' : 'moderate'}
                  size="sm"
                />
                <div className="mt-2 flex gap-1 flex-wrap">
                  {theme.affectedCountries.slice(0, 4).map(c => (
                    <span key={c} className="text-[10px] bg-[#161D2E] text-[#7A8FA6] px-1.5 py-0.5 rounded font-mono">{c}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Theme detail — full width on mobile when selected, right pane on desktop */}
        <div className={`lg:col-span-8 space-y-4 ${!detailOpen ? 'hidden lg:block' : 'block'}`}>
          {/* Header */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4 md:p-5">
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-base md:text-lg font-bold text-[#E8EDF5]">{selected.name}</h2>
                  {selected.badge && <TrendBadge badge={selected.badge} />}
                </div>
                <p className="text-xs md:text-sm text-[#7A8FA6]">{selected.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl md:text-3xl font-bold font-mono" style={{ color: getTrendColor(selected.trendDirection) }}>
                  {selected.momentumScore}
                </div>
                <div className="text-xs text-[#7A8FA6]">momentum</div>
              </div>
            </div>

            <div className="h-16 md:h-20 mt-3 md:mt-4">
              <div className="text-xs text-[#4A5A6E] mb-1">30-day momentum</div>
              <Sparkline data={selected.lifecycleData} color={getTrendColor(selected.trendDirection)} height={52} />
            </div>

            {/* Stats row: 2 cols mobile, 4 cols desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#1E2A3B]">
              <Stat label="Articles"    value={selected.articleCount.toString()} />
              <Stat label="High Impact" value={selected.highImpactArticleCount.toString()} />
              <Stat label="Velocity"    value={`+${selected.velocity}/day`} />
              <Stat label="Countries"   value={selected.affectedCountries.length.toString()} />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
            <div className="px-4 py-3 border-b border-[#1E2A3B]">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Event Timeline</h3>
            </div>
            <div className="p-4 space-y-3">
              {selected.timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${event.impact === 'high' ? 'bg-red-400' : event.impact === 'medium' ? 'bg-orange-400' : 'bg-[#7A8FA6]'}`} />
                    {i < selected.timeline.length - 1 && <div className="w-px flex-1 bg-[#1E2A3B] mt-1" />}
                  </div>
                  <div className="pb-3">
                    <div className="text-xs text-[#4A5A6E] font-mono mb-0.5">{event.date}</div>
                    <p className="text-sm text-[#E8EDF5]">{event.headline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source articles */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
            <div className="px-4 py-3 border-b border-[#1E2A3B]">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Source Articles</h3>
            </div>
            <div className="divide-y divide-[#1E2A3B]">
              {selected.sourceArticles.map(article => (
                <div key={article.id} className="px-4 py-3 flex items-start gap-3">
                  <SignalScore score={article.marketMovingScore} />
                  <div className="min-w-0">
                    <p className="text-sm text-[#E8EDF5] leading-snug">{article.headline}</p>
                    <div className="text-xs text-[#4A5A6E] mt-0.5">
                      <span className="text-[#7A8FA6]">{article.source}</span>
                      <span className="mx-1.5">·</span>
                      <span>{timeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related drivers */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
            <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">Related Drivers</h3>
            <div className="flex flex-wrap gap-2">
              {selected.relatedDrivers.map(d => (
                <Badge key={d} label={d} variant="theme" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#4A5A6E] uppercase tracking-wider">{label}</div>
      <div className="text-base font-bold font-mono text-[#E8EDF5] mt-0.5">{value}</div>
    </div>
  )
}
