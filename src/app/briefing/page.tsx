'use client'
import { AppShell } from '@/components/layout/AppShell'
import { mockBriefing } from '@/lib/mock/briefing'
import { mockAlerts } from '@/lib/mock/alerts'
import { getRiskBgClass, riskLevelLabel } from '@/lib/utils'
import { Copy, Download, RefreshCw, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function BriefingPage() {
  const [copied, setCopied] = useState(false)
  const briefing = mockBriefing

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${briefing.headline}\n\n${briefing.narrative}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppShell title="Morning Briefing" subtitle="Analyst-ready daily narrative — one-click export">
      <div className="grid grid-cols-12 gap-4">
        {/* Briefing main */}
        <div className="col-span-8 space-y-4">
          {/* Header card */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#4A5A6E] font-mono">{briefing.date}</span>
                  {briefing.isAiGenerated && (
                    <span className="flex items-center gap-1 text-xs bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3" /> AI Generated
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#4A5A6E] mb-2">
                  Regime: <span className="text-[#F5A623] font-medium">{briefing.regime.label}</span>
                  <span className="mx-1.5">→</span>
                  <span className="text-[#EAB308]">{briefing.regime.shiftingLabel}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs text-[#7A8FA6] border border-[#1E2A3B] px-3 py-1.5 rounded hover:text-[#E8EDF5] hover:border-[#2D7DD2]/40 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button className="flex items-center gap-1.5 text-xs bg-[#00C2FF] text-[#080C14] font-medium px-3 py-1.5 rounded hover:bg-[#00A8E0] transition-colors">
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
            </div>

            <h2 className="text-base font-bold text-[#E8EDF5] leading-snug mb-4">{briefing.headline}</h2>

            <div className="prose prose-sm max-w-none">
              {briefing.narrative.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-[#7A8FA6] leading-relaxed mb-3">{para}</p>
              ))}
            </div>
          </div>

          {/* Watchpoints */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
            <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">Key Watchpoints for Next 48h</h3>
            <div className="space-y-2">
              {briefing.keyWatchpoints.map((w, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#F5A623] shrink-0 text-xs mt-0.5 font-mono">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm text-[#E8EDF5]">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Active alerts referenced */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
            <div className="px-4 py-3 border-b border-[#1E2A3B]">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Referenced Alerts</h3>
            </div>
            <div className="divide-y divide-[#1E2A3B]">
              {mockAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${getRiskBgClass(alert.severity)}`}>
                      {riskLevelLabel(alert.severity)}
                    </span>
                    <span className="text-[10px] text-[#4A5A6E] font-mono">{alert.confidenceScore}%</span>
                  </div>
                  <p className="text-xs text-[#E8EDF5] leading-snug">{alert.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top themes */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
            <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">Featured Themes</h3>
            <div className="flex flex-wrap gap-1.5">
              {briefing.topThemes.map(t => (
                <span key={t} className="text-xs bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 px-2 py-1 rounded capitalize">{t.replace('-', ' ')}</span>
              ))}
            </div>
          </div>

          {/* Export options */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
            <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">Export</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-xs text-[#7A8FA6] hover:text-[#E8EDF5] flex items-center gap-2 py-1.5 transition-colors">
                <Download className="w-3 h-3" /> Download as PDF
              </button>
              <button className="w-full text-left text-xs text-[#7A8FA6] hover:text-[#E8EDF5] flex items-center gap-2 py-1.5 transition-colors">
                <Copy className="w-3 h-3" /> Copy as Markdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
