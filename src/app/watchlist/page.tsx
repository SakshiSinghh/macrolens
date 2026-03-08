'use client'
import { AppShell } from '@/components/layout/AppShell'
import { mockThemes } from '@/lib/mock/themes'
import { mockAlerts } from '@/lib/mock/alerts'
import { mockHeatmap } from '@/lib/mock/heatmap'
import { getTrendColor, getTrendIcon, getRiskColor, riskLevelLabel } from '@/lib/utils'
import { Bookmark, Plus, Trash2, Bell } from 'lucide-react'
import { useState } from 'react'
import { RiskMeter } from '@/components/ui/RiskMeter'

interface WatchItem {
  id: string
  type: 'theme' | 'country' | 'alert'
  label: string
  score: number
  status: string
  color: string
  notes: string
  threshold: number
}

const DEFAULT_ITEMS: WatchItem[] = [
  { id: 'w1', type: 'theme', label: 'US Inflation Resurgence', score: 87, status: '↑ Rising Fast', color: '#EF4444', notes: 'Watch CPI prints and Fed speeches', threshold: 80 },
  { id: 'w2', type: 'theme', label: 'China Property Stress', score: 78, status: '↑ Elevated', color: '#F97316', notes: 'Monitor developer defaults and PBoC response', threshold: 70 },
  { id: 'w3', type: 'country', label: 'Germany', score: 74, status: 'Elevated Risk', color: '#F97316', notes: 'Q1 GDP flash estimate due late April', threshold: 75 },
  { id: 'w4', type: 'alert', label: 'US Inflation Risk Alert', score: 91, status: 'High · Active', color: '#EF4444', notes: 'Confidence above threshold', threshold: 85 },
  { id: 'w5', type: 'country', label: 'Japan', score: 62, status: 'Elevated', color: '#F97316', notes: 'BoJ intervention risk at 151 JPY/USD', threshold: 65 },
]

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchItem[]>(DEFAULT_ITEMS)
  const [noteEditing, setNoteEditing] = useState<string | null>(null)

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <AppShell title="Watchlist" subtitle="Pinned themes, countries, and alerts with custom thresholds">
      <div className="grid grid-cols-12 gap-4">
        {/* Watchlist */}
        <div className="col-span-8 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-[#4A5A6E] uppercase tracking-wider">{items.length} items tracked</div>
            <button className="flex items-center gap-1.5 text-xs bg-[#00C2FF] text-[#080C14] font-medium px-3 py-1.5 rounded hover:bg-[#00A8E0] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          {items.map(item => (
            <div key={item.id} className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#161D2E] text-[#7A8FA6] border border-[#1E2A3B] px-1.5 py-0.5 rounded uppercase font-mono">{item.type}</span>
                  <h3 className="text-sm font-semibold text-[#E8EDF5]">{item.label}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.score}</span>
                  <span className="text-xs" style={{ color: item.color }}>{item.status}</span>
                  <button onClick={() => remove(item.id)} className="text-[#4A5A6E] hover:text-[#EF4444] transition-colors ml-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <RiskMeter
                score={item.score}
                level={item.score > 75 ? 'high' : item.score > 55 ? 'elevated' : 'moderate'}
                size="sm"
              />

              {/* Threshold */}
              <div className="flex items-center gap-3 mt-2">
                <Bell className="w-3 h-3 text-[#4A5A6E]" />
                <span className="text-xs text-[#4A5A6E]">Alert threshold:</span>
                <span className="text-xs font-mono text-[#F5A623]">{item.threshold}</span>
                {item.score >= item.threshold && (
                  <span className="text-[10px] bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 px-1.5 py-0.5 rounded">THRESHOLD BREACHED</span>
                )}
              </div>

              {/* Notes */}
              <div className="mt-2 pt-2 border-t border-[#1E2A3B]">
                {noteEditing === item.id ? (
                  <input
                    className="w-full bg-[#161D2E] border border-[#2D7DD2]/40 rounded text-xs text-[#E8EDF5] px-2 py-1 focus:outline-none"
                    defaultValue={item.notes}
                    onBlur={() => setNoteEditing(null)}
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-xs text-[#4A5A6E] cursor-text hover:text-[#7A8FA6] transition-colors"
                    onClick={() => setNoteEditing(item.id)}
                  >
                    {item.notes || 'Click to add a note...'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add from platform */}
        <div className="col-span-4 space-y-4">
          {/* Quick add themes */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
            <div className="px-4 py-3 border-b border-[#1E2A3B]">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Quick Add — Themes</h3>
            </div>
            <div className="divide-y divide-[#1E2A3B]">
              {mockThemes.slice(0, 4).map(t => (
                <div key={t.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-[#161D2E] transition-colors">
                  <div>
                    <div className="text-xs text-[#E8EDF5]">{t.name}</div>
                    <div className="text-[10px] font-mono" style={{ color: getTrendColor(t.trendDirection) }}>
                      {getTrendIcon(t.trendDirection)} {t.momentumScore}
                    </div>
                  </div>
                  <button className="text-[#4A5A6E] hover:text-[#00C2FF] transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick add countries */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
            <div className="px-4 py-3 border-b border-[#1E2A3B]">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Quick Add — Countries</h3>
            </div>
            <div className="divide-y divide-[#1E2A3B]">
              {mockHeatmap.slice(0, 4).map(c => (
                <div key={c.countryCode} className="px-4 py-2.5 flex items-center justify-between hover:bg-[#161D2E] transition-colors">
                  <div>
                    <div className="text-xs text-[#E8EDF5]">{c.countryName}</div>
                    <div className="text-[10px] font-mono" style={{ color: getRiskColor(c.riskLevel) }}>
                      {riskLevelLabel(c.riskLevel)} · {c.riskScore}
                    </div>
                  </div>
                  <button className="text-[#4A5A6E] hover:text-[#00C2FF] transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
