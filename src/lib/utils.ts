import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RiskLevel, TrendDirection } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: '#22C55E',
    moderate: '#EAB308',
    elevated: '#F97316',
    high: '#EF4444',
    critical: '#9B1C1C',
  }
  return map[level]
}

export function getRiskBgClass(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: 'bg-green-500/10 text-green-400 border-green-500/20',
    moderate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    elevated: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    critical: 'bg-red-900/20 text-red-300 border-red-900/30',
  }
  return map[level]
}

export function getTrendIcon(direction: TrendDirection): string {
  return direction === 'rising' ? '↑' : direction === 'falling' ? '↓' : '→'
}

export function getTrendColor(direction: TrendDirection): string {
  return direction === 'rising' ? '#22C55E' : direction === 'falling' ? '#EF4444' : '#7A8FA6'
}

export function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function formatPercent(n: number, decimals = 2): string {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(decimals)}%`
}

export function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function riskLevelLabel(level: RiskLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function getSignalColor(score: number): string {
  if (score >= 75) return '#EF4444'
  if (score >= 50) return '#F97316'
  if (score >= 25) return '#EAB308'
  return '#7A8FA6'
}

export function getSignalLabel(score: number): string {
  if (score >= 75) return 'High Impact'
  if (score >= 50) return 'Moderate'
  return 'Noise'
}
