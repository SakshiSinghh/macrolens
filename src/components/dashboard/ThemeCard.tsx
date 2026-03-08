'use client'
import { MacroTheme } from '@/types'
import { TrendBadge } from '@/components/ui/Badge'
import { RiskMeter } from '@/components/ui/RiskMeter'
import { Sparkline } from '@/components/ui/Sparkline'
import { getTrendColor, getTrendIcon, timeAgo } from '@/lib/utils'
import Link from 'next/link'

interface ThemeCardProps {
  theme: MacroTheme
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const trendColor = getTrendColor(theme.trendDirection)

  return (
    <Link href="/themes">
      <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4 hover:border-[#2D7DD2]/40 hover:bg-[#111927] transition-colors cursor-pointer">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-[#E8EDF5]">{theme.name}</h3>
              {theme.badge && <TrendBadge badge={theme.badge} />}
            </div>
            <div className="text-xs text-[#4A5A6E]">Updated {timeAgo(theme.lastUpdated)}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-bold font-mono" style={{ color: trendColor }}>
              {theme.momentumScore}
            </div>
            <div className="text-xs font-mono" style={{ color: trendColor }}>
              {getTrendIcon(theme.trendDirection)} {theme.trendDirection}
            </div>
          </div>
        </div>

        {/* Momentum bar */}
        <RiskMeter
          score={theme.momentumScore}
          level={theme.momentumScore > 75 ? 'high' : theme.momentumScore > 55 ? 'elevated' : 'moderate'}
          size="sm"
        />

        {/* Sparkline */}
        <div className="mt-2 h-8">
          <Sparkline data={theme.lifecycleData.slice(-14)} color={trendColor} height={32} />
        </div>

        {/* Countries */}
        <div className="mt-2 flex items-center gap-1 flex-wrap">
          {theme.affectedCountries.slice(0, 4).map(c => (
            <span key={c} className="text-xs text-[#4A5A6E] bg-[#161D2E] px-1.5 py-0.5 rounded font-mono">{c}</span>
          ))}
          <span className="text-xs text-[#4A5A6E]">{theme.articleCount} articles</span>
        </div>
      </div>
    </Link>
  )
}
