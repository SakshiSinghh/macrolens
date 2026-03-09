'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { mockEpisodes } from '@/lib/mock/memory'
import { HistoricalEpisode } from '@/types'
import { GitCompare, Clock, Sparkles } from 'lucide-react'

// Current macro snapshot used for side-by-side comparison
const CURRENT_SNAPSHOT: Record<string, string> = {
  'US CPI YoY':     '3.2%',
  'Fed Funds Rate': '5.50%',
  '10Y UST Yield':  '4.82%',
  'Unemployment':   '4.1%',
  'GDP Growth QoQ': '+0.8%',
}

export default function MemoryPage() {
  const sorted   = [...mockEpisodes].sort((a, b) => b.similarityScore - a.similarityScore)
  const topMatch = sorted[0]

  const [selected, setSelected]       = useState<HistoricalEpisode>(sorted[0])
  const [compareMode, setCompareMode] = useState(false)

  function openEpisodeCompare(ep: HistoricalEpisode) {
    setSelected(ep)
    setCompareMode(true)
    if (typeof window !== 'undefined') {
      setTimeout(() =>
        document.getElementById('episode-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        50,
      )
    }
  }

  return (
    <AppShell title="Institutional Memory" subtitle="Similar historical macro episodes and what happened next">

      {/* ── Top match callout card ──────────────────────────────────────── */}
      <div
        className="rounded-xl p-4 mb-5 border flex items-center justify-between gap-4 flex-wrap"
        style={{ backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#FED7AA' }}
          >
            <Sparkles className="w-5 h-5" style={{ color: '#EA580C' }} />
          </div>
          <div>
            <div
              className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
              style={{ color: '#EA580C' }}
            >
              Closest Historical Match
            </div>
            <div className="text-sm font-bold" style={{ color: '#7C2D12' }}>
              {topMatch.title}
            </div>
            <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: '#EA580C' }}>
              <span className="font-bold">{topMatch.similarityScore}% similarity</span>
              <span>·</span>
              <span>{topMatch.date.slice(0, 4)}</span>
              <span>·</span>
              <span>{topMatch.themes.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => openEpisodeCompare(topMatch)}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all shrink-0 text-white hover:opacity-90"
          style={{ backgroundColor: '#EA580C' }}
        >
          <GitCompare className="w-3.5 h-3.5" />
          Compare Now vs {topMatch.date.slice(0, 4)}
        </button>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Episode list */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-3">
            Historical Episodes — sorted by similarity to today
          </div>
          <div className="stagger-children space-y-2">
            {sorted.map(ep => (
              <button
                key={ep.id}
                onClick={() => { setSelected(ep); setCompareMode(false) }}
                className={`w-full text-left bg-[#0F1623] border rounded-md p-4 transition-all ${
                  selected.id === ep.id
                    ? 'border-[#00C2FF]/50 shadow-[0_0_12px_rgba(0,194,255,0.08)]'
                    : 'border-[#1E2A3B] hover:border-[#2D7DD2]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#E8EDF5] leading-snug">{ep.title}</h3>
                    <div className="text-xs text-[#4A5A6E] font-mono mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" /> {ep.date}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className="text-lg font-bold font-mono"
                      style={{ color: ep.similarityScore > 70 ? '#EF4444' : ep.similarityScore > 50 ? '#F97316' : '#EAB308' }}
                    >
                      {ep.similarityScore}%
                    </div>
                    <div className="text-[10px] text-[#4A5A6E]">similar</div>
                  </div>
                </div>
                <div className="w-full h-1 bg-[#1E2A3B] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${ep.similarityScore}%`,
                      backgroundColor: ep.similarityScore > 70 ? '#EF4444' : ep.similarityScore > 50 ? '#F97316' : '#EAB308',
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {ep.themes.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Episode detail */}
        <div id="episode-detail" className="lg:col-span-8 space-y-4 animate-fade-in" key={selected.id}>

          {/* Header + compare toggle */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-5">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#E8EDF5] mb-1">{selected.title}</h2>
                <div className="flex items-center gap-3 text-xs text-[#4A5A6E]">
                  <span className="font-mono">{selected.date}</span>
                  <span>•</span>
                  <span>{selected.countries.join(', ')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-bold font-mono text-[#EF4444]">{selected.similarityScore}%</div>
                  <div className="text-xs text-[#7A8FA6]">similarity to today</div>
                </div>
                <button
                  onClick={() => setCompareMode(m => !m)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors ${
                    compareMode
                      ? 'bg-[#00C2FF]/15 text-[#00C2FF] border-[#00C2FF]/40'
                      : 'text-[#7A8FA6] border-[#1E2A3B] hover:text-[#E8EDF5] hover:border-[#2D7DD2]/40'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  Compare
                </button>
              </div>
            </div>
            <p className="text-sm text-[#7A8FA6] leading-relaxed">{selected.summary}</p>
          </div>

          {/* Now vs History table */}
          {compareMode && (
            <div className="bg-[#0F1623] border border-[#00C2FF]/25 rounded-md p-4 animate-scale-in">
              <h3 className="text-xs font-semibold text-[#00C2FF] uppercase tracking-wider mb-3 flex items-center gap-2">
                <GitCompare className="w-3.5 h-3.5" />
                Now (2026) vs {selected.date.slice(0, 4)} — Side-by-Side
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#1E2A3B]">
                      <th className="text-left text-[#4A5A6E] font-medium pb-2 pr-6 w-48">Indicator</th>
                      <th className="text-right text-[#00C2FF] font-semibold pb-2 pr-6">Today 2026</th>
                      <th className="text-right text-[#F5A623] font-semibold pb-2">{selected.date.slice(0, 7)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2A3B]/40">
                    {Object.entries(CURRENT_SNAPSHOT).map(([indicator, current], idx) => {
                      const histKeys   = Object.keys(selected.keyIndicatorsAtTime)
                      const historical = selected.keyIndicatorsAtTime[indicator]
                        ?? selected.keyIndicatorsAtTime[histKeys[idx % histKeys.length]]
                        ?? '—'
                      return (
                        <tr key={indicator}>
                          <td className="py-2 pr-6 text-[#7A8FA6]">{indicator}</td>
                          <td className="py-2 pr-6 text-right font-mono text-[#E8EDF5] font-semibold">{current}</td>
                          <td className="py-2 text-right font-mono text-[#F5A623]">{historical}</td>
                        </tr>
                      )
                    })}
                    {Object.entries(selected.keyIndicatorsAtTime)
                      .filter(([k]) => !Object.keys(CURRENT_SNAPSHOT).includes(k))
                      .map(([k, v]) => (
                        <tr key={k}>
                          <td className="py-2 pr-6 text-[#7A8FA6]">{k}</td>
                          <td className="py-2 pr-6 text-right font-mono text-[#4A5A6E]">n/a</td>
                          <td className="py-2 text-right font-mono text-[#F5A623]">{v}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Key indicators */}
          {!compareMode && (
            <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
              <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">Key Indicators at Time</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selected.keyIndicatorsAtTime).map(([k, v]) => (
                  <div key={k} className="bg-[#161D2E] rounded p-2.5">
                    <div className="text-xs text-[#4A5A6E]">{k}</div>
                    <div className="text-sm font-mono font-semibold text-[#E8EDF5] mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What happened next */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
            <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">What Happened Next</h3>
            <div className="space-y-2">
              {selected.whatHappenedNext.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#F5A623] shrink-0 mt-0.5 text-xs">→</span>
                  <p className="text-sm text-[#E8EDF5]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Asset impacts */}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
            <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">Asset Impacts</h3>
            <div className="space-y-2">
              {selected.assetImpacts.map((impact, i) => (
                <div key={i} className="flex items-center justify-between bg-[#161D2E] rounded px-3 py-2">
                  <span className="text-sm text-[#E8EDF5]">{impact.asset}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#7A8FA6] hidden sm:block">{impact.description.slice(0, 40)}…</span>
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: impact.direction === 'up' ? '#22C55E' : impact.direction === 'down' ? '#EF4444' : '#EAB308' }}
                    >
                      {impact.direction === 'up' ? '↑' : impact.direction === 'down' ? '↓' : '↕'} {impact.magnitude}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  )
}
