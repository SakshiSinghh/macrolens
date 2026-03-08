'use client'
import { getSignalColor, getSignalLabel } from '@/lib/utils'

interface SignalScoreProps {
  score: number
  showLabel?: boolean
}

export function SignalScore({ score, showLabel = false }: SignalScoreProps) {
  const color = getSignalColor(score)
  const label = getSignalLabel(score)

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono font-medium border"
      style={{ color, borderColor: `${color}30`, backgroundColor: `${color}15` }}
    >
      {score}
      {showLabel && <span className="opacity-70">{label}</span>}
    </span>
  )
}
