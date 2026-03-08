'use client'
import { mockHeatmap } from '@/lib/mock/heatmap'
import { getRiskColor, riskLevelLabel } from '@/lib/utils'

export function GlobalRiskSummary() {
  const counts = { low: 0, moderate: 0, elevated: 0, high: 0, critical: 0 }
  mockHeatmap.forEach(c => counts[c.riskLevel]++)

  const levels = [
    { level: 'critical', label: 'Critical', count: counts.critical },
    { level: 'high', label: 'High', count: counts.high },
    { level: 'elevated', label: 'Elevated', count: counts.elevated },
    { level: 'moderate', label: 'Moderate', count: counts.moderate },
    { level: 'low', label: 'Low', count: counts.low },
  ] as const

  const topCountries = mockHeatmap
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4)

  return (
    <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
      <div className="px-4 py-3 border-b border-[#1E2A3B]">
        <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Global Risk Summary</h3>
      </div>
      <div className="p-4 space-y-3">
        {/* Distribution */}
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {levels.map(({ level, count }) => count > 0 && (
            <div
              key={level}
              className="h-full rounded-sm transition-all"
              style={{
                width: `${(count / mockHeatmap.length) * 100}%`,
                backgroundColor: getRiskColor(level),
              }}
              title={`${riskLevelLabel(level)}: ${count}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-[#4A5A6E] font-mono">
          {levels.map(({ level, label, count }) => (
            <span key={level} style={{ color: count > 0 ? getRiskColor(level) : '#4A5A6E' }}>
              {label[0]}: {count}
            </span>
          ))}
        </div>

        {/* Top countries */}
        <div className="space-y-1.5 pt-1">
          {topCountries.map(c => (
            <div key={c.countryCode} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 text-xs font-mono text-[#7A8FA6]">{c.countryCode}</span>
                <span className="text-xs text-[#E8EDF5]">{c.countryName}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-[#1E2A3B] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.riskScore}%`, backgroundColor: getRiskColor(c.riskLevel) }}
                  />
                </div>
                <span className="text-xs font-mono" style={{ color: getRiskColor(c.riskLevel) }}>
                  {c.riskScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
