'use client'
import { RiskAlert } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { getRiskBgClass, timeAgo, riskLevelLabel } from '@/lib/utils'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface AlertCardProps {
  alert: RiskAlert
}

const severityLeftBorder: Record<string, string> = {
  critical: 'border-l-[#9B1C1C]',
  high:     'border-l-[#EF4444]',
  elevated: 'border-l-[#F97316]',
  moderate: 'border-l-[#EAB308]',
  low:      'border-l-[#22C55E]',
}

export function AlertCard({ alert }: AlertCardProps) {
  const leftBorder = severityLeftBorder[alert.severity] ?? 'border-l-[#1E2A3B]'
  return (
    <Link href="/insights">
      <div className={`bg-[#0F1623] border border-[#1E2A3B] border-l-2 ${leftBorder} rounded-md p-4 hover:border-[#2D7DD2]/40 hover:bg-[#111927] transition-colors cursor-pointer group`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#EF4444]" />
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRiskBgClass(alert.severity)}`}>
              {riskLevelLabel(alert.severity)}
            </span>
            <span className="text-xs font-mono text-[#4A5A6E]">{alert.confidenceScore}% conf.</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#4A5A6E]">
            <span>{timeAgo(alert.triggeredAt)}</span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-[#E8EDF5] leading-snug mb-2">{alert.title}</h3>

        {/* Top reason */}
        <p className="text-xs text-[#7A8FA6] leading-relaxed mb-3 line-clamp-2">
          {alert.triggerReasons[0]}
        </p>

        {/* Countries + assets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {alert.impactedCountries.slice(0, 3).map(c => (
            <Badge key={c} label={c} variant="default" />
          ))}
          <span className="text-[#4A5A6E] text-xs">→</span>
          {alert.impactedAssetClasses.slice(0, 2).map(a => (
            <Badge key={a} label={a} variant="theme" />
          ))}
        </div>

        {/* Evidence count */}
        <div className="mt-2 pt-2 border-t border-[#1E2A3B] flex items-center gap-3">
          <span className="text-xs text-[#4A5A6E]">
            {alert.supportingEvidence.length} evidence sources
          </span>
          <span className="text-xs text-[#4A5A6E]">
            {alert.watchpoints.shortTerm.length + alert.watchpoints.mediumTerm.length} watchpoints
          </span>
        </div>
      </div>
    </Link>
  )
}
