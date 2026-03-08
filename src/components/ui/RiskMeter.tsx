'use client'
import { getRiskColor } from '@/lib/utils'
import { RiskLevel } from '@/types'

interface RiskMeterProps {
  score: number
  level: RiskLevel
  size?: 'sm' | 'md' | 'lg'
}

export function RiskMeter({ score, level, size = 'md' }: RiskMeterProps) {
  const color = getRiskColor(level)
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' }

  return (
    <div className="w-full">
      <div className={`w-full bg-[#1E2A3B] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

interface ScoreDisplayProps {
  score: number
  level: RiskLevel
}

export function ScoreDisplay({ score, level }: ScoreDisplayProps) {
  const color = getRiskColor(level)
  return (
    <span className="font-mono text-sm font-semibold" style={{ color }}>
      {score}
    </span>
  )
}
