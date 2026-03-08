'use client'
import { MacroRegime } from '@/types'

interface RegimeBannerProps {
  regime: MacroRegime
}

const regimeColors: Record<string, { bg: string; text: string; border: string }> = {
  tightening:       { bg: '#1A1200', text: '#F5A623', border: '#F5A623' },
  'stagflation-risk': { bg: '#1A0A0A', text: '#EF4444', border: '#EF4444' },
  easing:           { bg: '#0A1A12', text: '#22C55E', border: '#22C55E' },
  recession:        { bg: '#1A0A0A', text: '#EF4444', border: '#EF4444' },
  crisis:           { bg: '#1A0505', text: '#9B1C1C', border: '#9B1C1C' },
  'late-cycle':     { bg: '#1A1200', text: '#F5A623', border: '#F5A623' },
  'early-expansion':{ bg: '#0A1A12', text: '#22C55E', border: '#22C55E' },
}

export function RegimeBanner({ regime }: RegimeBannerProps) {
  const colors = regimeColors[regime.current] ?? { bg: '#0F1623', text: '#7A8FA6', border: '#1E2A3B' }

  return (
    <div
      className="w-full px-6 py-2 border-b flex items-center justify-between text-xs"
      style={{ backgroundColor: colors.bg, borderColor: `${colors.border}40` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[#7A8FA6] font-medium uppercase tracking-wider">Macro Regime</span>
        <span className="font-semibold" style={{ color: colors.text }}>
          {regime.label}
        </span>
        <span className="text-[#4A5A6E]">→</span>
        <span className="text-[#7A8FA6]">Shifting toward</span>
        <span className="font-medium text-[#EAB308]">{regime.shiftingLabel}</span>
        <span className="text-[#4A5A6E] font-mono">{regime.confidence}% confidence</span>
      </div>
      <div className="flex items-center gap-4 text-[#4A5A6E]">
        {regime.drivers.slice(0, 2).map((d, i) => (
          <span key={i} className="hidden lg:block">• {d}</span>
        ))}
        <span className="text-[#4A5A6E]">Updated {new Date(regime.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  )
}
