'use client'
import { MarketSignal } from '@/types'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatPercent } from '@/lib/utils'

interface MarketSnapshotProps {
  signals: MarketSignal[]
}

export function MarketSnapshot({ signals }: MarketSnapshotProps) {
  return (
    <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
      <div className="px-4 py-3 border-b border-[#1E2A3B]">
        <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Market Snapshot</h3>
      </div>
      <div className="divide-y divide-[#1E2A3B]">
        {signals.map(s => {
          const isUp = s.changePercent >= 0
          const color = isUp ? '#22C55E' : '#EF4444'
          return (
            <div key={s.symbol} className="px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-[#161D2E] transition-colors">
              <div className="min-w-0">
                <div className="text-xs font-mono font-semibold text-[#E8EDF5]">{s.symbol}</div>
                <div className="text-[10px] text-[#4A5A6E] truncate">{s.name}</div>
              </div>
              <div className="w-14 shrink-0">
                <Sparkline data={s.sparklineData} color={color} height={24} />
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-mono text-[#E8EDF5]">{s.price.toLocaleString()}</div>
                <div className="text-xs font-mono" style={{ color }}>{formatPercent(s.changePercent)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
