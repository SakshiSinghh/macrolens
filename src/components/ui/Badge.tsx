'use client'
import { cn, getRiskBgClass } from '@/lib/utils'
import { RiskLevel } from '@/types'

interface BadgeProps {
  variant?: 'risk' | 'theme' | 'signal' | 'default'
  riskLevel?: RiskLevel
  label: string
  className?: string
}

export function Badge({ variant = 'default', riskLevel, label, className }: BadgeProps) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border'

  if (variant === 'risk' && riskLevel) {
    return <span className={cn(base, getRiskBgClass(riskLevel), className)}>{label}</span>
  }

  const variantMap: Record<string, string> = {
    theme: 'bg-[#00C2FF]/10 text-[#00C2FF] border-[#00C2FF]/20',
    signal: 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20',
    default: 'bg-[#1E2A3B] text-[#7A8FA6] border-[#1E2A3B]',
  }

  return <span className={cn(base, variantMap[variant], className)}>{label}</span>
}

// Trend badge
interface TrendBadgeProps {
  badge: 'rising-fast' | 'cooling' | 'elevated-risk' | 'emerging'
}

export function TrendBadge({ badge }: TrendBadgeProps) {
  const map = {
    'rising-fast': { label: '↑ Rising Fast', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    'cooling': { label: '↓ Cooling', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'elevated-risk': { label: '⚠ Elevated Risk', cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    'emerging': { label: '◎ Emerging', cls: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  }
  const { label, cls } = map[badge]
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', cls)}>{label}</span>
}
