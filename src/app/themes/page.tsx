import { AppShell } from '@/components/layout/AppShell'
import { mockThemes } from '@/lib/mock/themes'
import { TrendBadge, Badge } from '@/components/ui/Badge'
import { RiskMeter } from '@/components/ui/RiskMeter'
import { Sparkline } from '@/components/ui/Sparkline'
import { SignalScore } from '@/components/ui/SignalScore'
import { getTrendColor, getTrendIcon, timeAgo } from '@/lib/utils'

export default function ThemesPage() {
  return (
    <AppShell title="Theme Radar" subtitle="Detected macro themes and momentum tracking">
      <div className="grid grid-cols-12 gap-4">
        {/* Theme list */}
        <div className="col-span-4 space-y-2">
          {mockThemes.map(theme => {
            const trendColor = getTrendColor(theme.trendDirection)
            return (
              <div key={theme.id} className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4 hover:border-[#00C2FF]/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[#E8EDF5]">{theme.name}</span>
                      {theme.badge && <TrendBadge badge={theme.badge} />}
                    </div>
                    <div className="text-xs text-[#4A5A6E]">First detected {timeAgo(theme.firstDetectedAt)}</div>
                  </div>
                  <div className="text-right">
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

        {/* Theme detail — first theme */}
        <div className="col-span-8 space-y-4">
          {mockThemes.slice(0, 1).map(theme => (
            <div key={theme.id} className="space-y-4">
              {/* Header */}
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-[#E8EDF5]">{theme.name}</h2>
                      {theme.badge && <TrendBadge badge={theme.badge} />}
                    </div>
                    <p className="text-sm text-[#7A8FA6]">{theme.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-bold font-mono" style={{ color: getTrendColor(theme.trendDirection) }}>
                      {theme.momentumScore}
                    </div>
                    <div className="text-xs text-[#7A8FA6]">momentum score</div>
                  </div>
                </div>

                {/* 30-day lifecycle chart */}
                <div className="h-20 mt-4">
                  <div className="text-xs text-[#4A5A6E] mb-1">30-day momentum</div>
                  <Sparkline data={theme.lifecycleData} color={getTrendColor(theme.trendDirection)} height={64} />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#1E2A3B]">
                  <Stat label="Articles" value={theme.articleCount.toString()} />
                  <Stat label="High Impact" value={theme.highImpactArticleCount.toString()} />
                  <Stat label="Velocity" value={`+${theme.velocity}/day`} />
                  <Stat label="Countries" value={theme.affectedCountries.length.toString()} />
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
                <div className="px-4 py-3 border-b border-[#1E2A3B]">
                  <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Event Timeline</h3>
                </div>
                <div className="p-4 space-y-3">
                  {theme.timeline.map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${event.impact === 'high' ? 'bg-red-400' : event.impact === 'medium' ? 'bg-orange-400' : 'bg-[#7A8FA6]'}`} />
                        {i < theme.timeline.length - 1 && <div className="w-px flex-1 bg-[#1E2A3B] mt-1" />}
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
                  {theme.sourceArticles.map(article => (
                    <div key={article.id} className="px-4 py-3 flex items-start gap-3">
                      <SignalScore score={article.marketMovingScore} />
                      <div>
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
                  {theme.relatedDrivers.map(d => (
                    <Badge key={d} label={d} variant="theme" />
                  ))}
                </div>
              </div>
            </div>
          ))}
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
