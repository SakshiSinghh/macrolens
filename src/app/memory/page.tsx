import { AppShell } from '@/components/layout/AppShell'
import { mockEpisodes } from '@/lib/mock/memory'
import { getRiskColor } from '@/lib/utils'

export default function MemoryPage() {
  return (
    <AppShell title="Institutional Memory" subtitle="Similar historical macro episodes and what happened next">
      <div className="grid grid-cols-12 gap-4">
        {/* Episode list */}
        <div className="col-span-4 space-y-2">
          <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-3">
            Historical Episodes — sorted by similarity to current situation
          </div>
          {mockEpisodes.sort((a, b) => b.similarityScore - a.similarityScore).map(ep => (
            <div key={ep.id} className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4 hover:border-[#2D7DD2]/40 transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#E8EDF5] leading-snug">{ep.title}</h3>
                  <div className="text-xs text-[#4A5A6E] font-mono mt-0.5">{ep.date}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold font-mono" style={{ color: ep.similarityScore > 70 ? '#EF4444' : ep.similarityScore > 50 ? '#F97316' : '#EAB308' }}>
                    {ep.similarityScore}%
                  </div>
                  <div className="text-[10px] text-[#4A5A6E]">similar</div>
                </div>
              </div>
              {/* Similarity bar */}
              <div className="w-full h-1 bg-[#1E2A3B] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${ep.similarityScore}%`,
                    backgroundColor: ep.similarityScore > 70 ? '#EF4444' : ep.similarityScore > 50 ? '#F97316' : '#EAB308'
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {ep.themes.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Episode detail */}
        <div className="col-span-8 space-y-4">
          {mockEpisodes.slice(0, 1).map(ep => (
            <div key={ep.id} className="space-y-4">
              {/* Header */}
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#E8EDF5] mb-1">{ep.title}</h2>
                    <div className="flex items-center gap-3 text-xs text-[#4A5A6E]">
                      <span className="font-mono">{ep.date}</span>
                      <span>•</span>
                      <span>{ep.countries.join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono text-[#EF4444]">{ep.similarityScore}%</div>
                    <div className="text-xs text-[#7A8FA6]">similarity to today</div>
                  </div>
                </div>
                <p className="text-sm text-[#7A8FA6] leading-relaxed">{ep.summary}</p>
              </div>

              {/* Key indicators comparison */}
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
                <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">Key Indicators at Time</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ep.keyIndicatorsAtTime).map(([k, v]) => (
                    <div key={k} className="bg-[#161D2E] rounded p-2.5">
                      <div className="text-xs text-[#4A5A6E]">{k}</div>
                      <div className="text-sm font-mono font-semibold text-[#E8EDF5] mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What happened next */}
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-4">
                <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider mb-3">What Happened Next</h3>
                <div className="space-y-2">
                  {ep.whatHappenedNext.map((item, i) => (
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
                  {ep.assetImpacts.map((impact, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#161D2E] rounded px-3 py-2">
                      <span className="text-sm text-[#E8EDF5]">{impact.asset}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#7A8FA6]">{impact.description.slice(0, 40)}...</span>
                        <span className="text-sm font-mono font-bold" style={{
                          color: impact.direction === 'up' ? '#22C55E' : impact.direction === 'down' ? '#EF4444' : '#EAB308'
                        }}>
                          {impact.direction === 'up' ? '↑' : impact.direction === 'down' ? '↓' : '↕'} {impact.magnitude}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
