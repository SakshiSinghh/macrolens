'use client'
import { AppShell } from '@/components/layout/AppShell'
import { mockThemes } from '@/lib/mock/themes'
import { mockAlerts } from '@/lib/mock/alerts'
import { mockHeatmap } from '@/lib/mock/heatmap'
import { getTrendColor, getTrendIcon, getRiskColor, riskLevelLabel } from '@/lib/utils'
import { Bookmark, Plus, Trash2, Bell, X, Check } from 'lucide-react'
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
  { id: 'w1', type: 'theme',   label: 'US Inflation Resurgence', score: 87, status: '↑ Rising Fast', color: '#EF4444', notes: 'Watch CPI prints and Fed speeches',            threshold: 80 },
  { id: 'w2', type: 'theme',   label: 'China Property Stress',   score: 78, status: '↑ Elevated',    color: '#F97316', notes: 'Monitor developer defaults and PBoC response', threshold: 70 },
  { id: 'w3', type: 'country', label: 'Germany',                 score: 74, status: 'Elevated Risk', color: '#F97316', notes: 'Q1 GDP flash estimate due late April',          threshold: 75 },
  { id: 'w4', type: 'alert',   label: 'US Inflation Risk Alert', score: 91, status: 'High · Active', color: '#EF4444', notes: 'Confidence above threshold',                   threshold: 85 },
  { id: 'w5', type: 'country', label: 'Japan',                   score: 62, status: 'Elevated',      color: '#F97316', notes: 'BoJ intervention risk at 151 JPY/USD',         threshold: 65 },
]

export default function WatchlistPage() {
  const [items, setItems]             = useState<WatchItem[]>(DEFAULT_ITEMS)
  const [noteEditing, setNoteEditing] = useState<string | null>(null)
  const [noteValue, setNoteValue]     = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // New item form state
  const [newLabel, setNewLabel]         = useState('')
  const [newType, setNewType]           = useState<WatchItem['type']>('theme')
  const [newScore, setNewScore]         = useState(70)
  const [newThreshold, setNewThreshold] = useState(65)
  const [newNotes, setNewNotes]         = useState('')

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const startNoteEdit = (item: WatchItem) => {
    setNoteEditing(item.id)
    setNoteValue(item.notes)
  }

  const saveNote = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, notes: noteValue } : i))
    setNoteEditing(null)
  }

  const addTheme = (t: (typeof mockThemes)[number]) => {
    if (items.some(i => i.label === t.name)) return
    setItems(prev => [...prev, {
      id: `w-${Date.now()}`,
      type: 'theme',
      label: t.name,
      score: t.momentumScore,
      status: `${getTrendIcon(t.trendDirection)} ${t.trendDirection}`,
      color: getTrendColor(t.trendDirection),
      notes: '',
      threshold: Math.max(t.momentumScore - 10, 50),
    }])
  }

  const addCountry = (c: (typeof mockHeatmap)[number]) => {
    if (items.some(i => i.label === c.countryName)) return
    setItems(prev => [...prev, {
      id: `w-${Date.now()}`,
      type: 'country',
      label: c.countryName,
      score: c.riskScore,
      status: riskLevelLabel(c.riskLevel),
      color: getRiskColor(c.riskLevel),
      notes: '',
      threshold: Math.max(c.riskScore - 10, 50),
    }])
  }

  const addAlert = (a: (typeof mockAlerts)[number]) => {
    if (items.some(i => i.label === a.title)) return
    setItems(prev => [...prev, {
      id: `w-${Date.now()}`,
      type: 'alert',
      label: a.title,
      score: a.confidenceScore,
      status: `${a.severity} · Active`,
      color: a.severity === 'high' ? '#EF4444' : '#F97316',
      notes: '',
      threshold: Math.max(a.confidenceScore - 5, 70),
    }])
  }

  const submitNewItem = () => {
    if (!newLabel.trim()) return
    const scoreColor = newScore >= 80 ? '#EF4444' : newScore >= 60 ? '#F97316' : '#EAB308'
    setItems(prev => [...prev, {
      id: `w-${Date.now()}`,
      type: newType,
      label: newLabel.trim(),
      score: newScore,
      status: newScore >= 80 ? '↑ High' : newScore >= 60 ? 'Elevated' : 'Moderate',
      color: scoreColor,
      notes: newNotes.trim(),
      threshold: newThreshold,
    }])
    setShowAddForm(false)
    setNewLabel(''); setNewNotes(''); setNewScore(70); setNewThreshold(65)
  }

  return (
    <AppShell title="Watchlist" subtitle="Pinned themes, countries, and alerts with custom thresholds">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ── Left: watch items ── */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-[#4A5A6E] uppercase tracking-wider">{items.length} items tracked</div>
            <button
              onClick={() => setShowAddForm(v => !v)}
              className="flex items-center gap-1.5 text-xs bg-[#00C2FF] text-[#080C14] font-medium px-3 py-1.5 rounded hover:bg-[#00A8E0] transition-colors"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showAddForm ? 'Cancel' : 'Add Item'}
            </button>
          </div>

          {/* Inline add form */}
          {showAddForm && (
            <div className="bg-[#0F1623] border border-[#00C2FF]/30 rounded-md p-4 space-y-3 animate-scale-in">
              <div className="text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">New Watchlist Item</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] text-[#4A5A6E] uppercase tracking-wider mb-1 block">Label / Name *</label>
                  <input
                    className="w-full bg-[#161D2E] border border-[#1E2A3B] rounded text-xs text-[#E8EDF5] px-3 py-2 focus:outline-none focus:border-[#2D7DD2]/60 placeholder:text-[#4A5A6E]"
                    placeholder="e.g. EUR/USD Currency Stress"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submitNewItem()}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#4A5A6E] uppercase tracking-wider mb-1 block">Type</label>
                  <select
                    className="w-full bg-[#161D2E] border border-[#1E2A3B] rounded text-xs text-[#E8EDF5] px-3 py-2 focus:outline-none"
                    value={newType}
                    onChange={e => setNewType(e.target.value as WatchItem['type'])}
                  >
                    <option value="theme">Theme</option>
                    <option value="country">Country</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#4A5A6E] uppercase tracking-wider mb-1 block">Current Score (0–100)</label>
                  <input
                    type="number" min={0} max={100}
                    className="w-full bg-[#161D2E] border border-[#1E2A3B] rounded text-xs text-[#E8EDF5] px-3 py-2 focus:outline-none"
                    value={newScore}
                    onChange={e => setNewScore(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#4A5A6E] uppercase tracking-wider mb-1 block">Alert Threshold</label>
                  <input
                    type="number" min={0} max={100}
                    className="w-full bg-[#161D2E] border border-[#1E2A3B] rounded text-xs text-[#E8EDF5] px-3 py-2 focus:outline-none"
                    value={newThreshold}
                    onChange={e => setNewThreshold(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-[#4A5A6E] uppercase tracking-wider mb-1 block">Notes (optional)</label>
                  <input
                    className="w-full bg-[#161D2E] border border-[#1E2A3B] rounded text-xs text-[#E8EDF5] px-3 py-2 focus:outline-none placeholder:text-[#4A5A6E]"
                    placeholder="Why are you watching this?"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={submitNewItem}
                disabled={!newLabel.trim()}
                className="flex items-center gap-1.5 text-xs bg-[#00C2FF] text-[#080C14] font-medium px-4 py-2 rounded hover:bg-[#00A8E0] disabled:opacity-40 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Add to Watchlist
              </button>
            </div>
          )}

          {/* Watch items */}
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
                  <button
                    onClick={() => remove(item.id)}
                    title="Remove from watchlist"
                    className="text-[#4A5A6E] hover:text-[#EF4444] transition-colors ml-1"
                  >
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

              {/* Notes — inline edit */}
              <div className="mt-2 pt-2 border-t border-[#1E2A3B]">
                {noteEditing === item.id ? (
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-[#161D2E] border border-[#2D7DD2]/40 rounded text-xs text-[#E8EDF5] px-2 py-1 focus:outline-none"
                      value={noteValue}
                      onChange={e => setNoteValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveNote(item.id)
                        if (e.key === 'Escape') setNoteEditing(null)
                      }}
                      autoFocus
                    />
                    <button onClick={() => saveNote(item.id)} className="text-[#00C2FF] text-xs px-2 hover:text-[#00A8E0]">Save</button>
                    <button onClick={() => setNoteEditing(null)} className="text-[#4A5A6E] text-xs px-1 hover:text-[#7A8FA6]">✕</button>
                  </div>
                ) : (
                  <p
                    className="text-xs text-[#4A5A6E] cursor-text hover:text-[#7A8FA6] transition-colors"
                    onClick={() => startNoteEdit(item)}
                    title="Click to edit note"
                  >
                    {item.notes || 'Click to add a note…'}
                  </p>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-8 text-center">
              <Bookmark className="w-8 h-8 text-[#4A5A6E] mx-auto mb-2" />
              <p className="text-sm text-[#4A5A6E]">Your watchlist is empty.</p>
              <p className="text-xs text-[#4A5A6E] mt-1">Use the panel on the right to quickly add themes or countries.</p>
            </div>
          )}
        </div>

        {/* ── Right: quick add panels ── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Themes */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
            <div className="px-4 py-3 border-b border-[#1E2A3B]">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Quick Add — Themes</h3>
            </div>
            <div className="divide-y divide-[#1E2A3B]">
              {mockThemes.slice(0, 5).map(t => {
                const already = items.some(i => i.label === t.name)
                return (
                  <div key={t.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-[#161D2E] transition-colors">
                    <div>
                      <div className="text-xs text-[#E8EDF5]">{t.name}</div>
                      <div className="text-[10px] font-mono" style={{ color: getTrendColor(t.trendDirection) }}>
                        {getTrendIcon(t.trendDirection)} {t.momentumScore}
                      </div>
                    </div>
                    <button
                      onClick={() => addTheme(t)}
                      disabled={already}
                      title={already ? 'Already in watchlist' : 'Add to watchlist'}
                      className={`transition-colors ${already ? 'text-[#22C55E] cursor-default' : 'text-[#4A5A6E] hover:text-[#00C2FF]'}`}
                    >
                      {already ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Countries */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
            <div className="px-4 py-3 border-b border-[#1E2A3B]">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Quick Add — Countries</h3>
            </div>
            <div className="divide-y divide-[#1E2A3B]">
              {mockHeatmap.slice(0, 5).map(c => {
                const already = items.some(i => i.label === c.countryName)
                return (
                  <div key={c.countryCode} className="px-4 py-2.5 flex items-center justify-between hover:bg-[#161D2E] transition-colors">
                    <div>
                      <div className="text-xs text-[#E8EDF5]">{c.countryName}</div>
                      <div className="text-[10px] font-mono" style={{ color: getRiskColor(c.riskLevel) }}>
                        {riskLevelLabel(c.riskLevel)} · {c.riskScore}
                      </div>
                    </div>
                    <button
                      onClick={() => addCountry(c)}
                      disabled={already}
                      title={already ? 'Already in watchlist' : 'Add to watchlist'}
                      className={`transition-colors ${already ? 'text-[#22C55E] cursor-default' : 'text-[#4A5A6E] hover:text-[#00C2FF]'}`}
                    >
                      {already ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
            <div className="px-4 py-3 border-b border-[#1E2A3B]">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Quick Add — Active Alerts</h3>
            </div>
            <div className="divide-y divide-[#1E2A3B]">
              {mockAlerts.slice(0, 3).map(a => {
                const already = items.some(i => i.label === a.title)
                return (
                  <div key={a.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-[#161D2E] transition-colors">
                    <div className="min-w-0 pr-2">
                      <div className="text-xs text-[#E8EDF5] leading-snug truncate">{a.title}</div>
                      <div className="text-[10px] font-mono text-[#EF4444]">{a.confidenceScore}% confidence</div>
                    </div>
                    <button
                      onClick={() => addAlert(a)}
                      disabled={already}
                      title={already ? 'Already in watchlist' : 'Add to watchlist'}
                      className={`transition-colors shrink-0 ${already ? 'text-[#22C55E] cursor-default' : 'text-[#4A5A6E] hover:text-[#00C2FF]'}`}
                    >
                      {already ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
