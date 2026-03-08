'use client'
import { useState, useEffect } from 'react'
import { MacroRegime } from '@/types'

interface RegimeBannerProps {
  regime: MacroRegime
}

const regimeColors: Record<string, { bg: string; text: string; border: string }> = {
  tightening:         { bg: '#1A1200', text: '#F5A623', border: '#F5A623' },
  'stagflation-risk': { bg: '#1A0A0A', text: '#EF4444', border: '#EF4444' },
  easing:             { bg: '#0A1A12', text: '#22C55E', border: '#22C55E' },
  recession:          { bg: '#1A0A0A', text: '#EF4444', border: '#EF4444' },
  crisis:             { bg: '#1A0505', text: '#9B1C1C', border: '#9B1C1C' },
  'late-cycle':       { bg: '#1A1200', text: '#F5A623', border: '#F5A623' },
  'early-expansion':  { bg: '#0A1A12', text: '#22C55E', border: '#22C55E' },
}

export function RegimeBanner({ regime }: RegimeBannerProps) {
  const colors = regimeColors[regime.current] ?? { bg: '#0F1623', text: '#7A8FA6', border: '#1E2A3B' }
  const [updatedStr, setUpdatedStr] = useState('')

  useEffect(() => {
    setUpdatedStr(new Date(regime.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
  }, [regime.lastUpdated])

  return (
    <div
      className="w-full px-4 py-1.5 border-b flex items-center gap-0 text-xs overflow-hidden"
      style={{ backgroundColor: colors.bg, borderColor: `${colors.border}40` }}
    >
      {/* Left: regime info */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[#4A5A6E] font-medium uppercase tracking-wider text-[10px]">Macro Regime</span>
        <span className="w-px h-3 bg-[#1E2A3B]" />
        <span className="font-semibold" style={{ color: colors.text }}>{regime.label}</span>
        <span className="text-[#4A5A6E] text-[10px]">→</span>
        <span className="text-[#7A8FA6] text-[10px]">Shifting toward</span>
        <span className="font-semibold text-[#EAB308]">{regime.shiftingLabel}</span>
        <span className="w-px h-3 bg-[#1E2A3B]" />
        <span className="text-[#4A5A6E] font-mono text-[10px]">{regime.confidence}% conf.</span>
      </div>

      {/* Divider */}
      <span className="w-px h-3 bg-[#1E2A3B] mx-3 shrink-0" />

      {/* Right: scrolling drivers */}
      <div className="flex items-center gap-6 min-w-0 overflow-hidden flex-1">
        {regime.drivers.map((d, i) => (
          <span key={i} className="text-[#4A5A6E] shrink-0 whitespace-nowrap">
            <span style={{ color: colors.border }}>•</span> {d}
          </span>
        ))}
      </div>

      {/* Updated timestamp — right-most, always visible */}
      <span className="text-[#4A5A6E] font-mono text-[10px] shrink-0 ml-4">
        {updatedStr ? `Updated ${updatedStr}` : ''}
      </span>
    </div>
  )
}
