'use client'
import { AppShell } from '@/components/layout/AppShell'
import { DominoGraph } from '@/components/domino/DominoGraph'
import { mockDominoChains } from '@/lib/mock/domino'
import { useState } from 'react'
import { DominoChain, DominoNode } from '@/types'
import { getRiskColor } from '@/lib/utils'

export default function DominoPage() {
  const [activeChain, setActiveChain]   = useState<DominoChain>(mockDominoChains[0])
  const [selectedNode, setSelectedNode] = useState<DominoNode | null>(null)
  const [panelOpen, setPanelOpen]       = useState(false)

  const handleNodeSelect = (node: DominoNode | null) => {
    setSelectedNode(node)
    if (node) setPanelOpen(true)
  }

  return (
    <AppShell title="Domino Effect Graph" subtitle="Event cascade — how one shock propagates">
      <div className="space-y-4">
        {/* Chain selector */}
        <div className="flex gap-2 flex-wrap">
          {mockDominoChains.map(chain => (
            <button
              key={chain.id}
              onClick={() => { setActiveChain(chain); setSelectedNode(null); setPanelOpen(false) }}
              className={`px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium border transition-colors ${
                activeChain.id === chain.id
                  ? 'bg-[#00C2FF]/15 text-[#00C2FF] border-[#00C2FF]/40'
                  : 'text-[#7A8FA6] border-[#1E2A3B] hover:text-[#E8EDF5] hover:border-[#2D7DD2]/40'
              }`}
            >
              {chain.title}
            </button>
          ))}
        </div>

        {/* Trigger event banner */}
        <div className="bg-[#1A0A0A] border border-red-900/40 rounded-md px-4 py-3">
          <div className="text-xs text-[#7A8FA6] uppercase tracking-wider mb-0.5">Trigger Event</div>
          <p className="text-sm font-semibold text-[#E8EDF5]">{activeChain.triggerEvent}</p>
        </div>

        {/* Mobile: node detail drawer (shown above graph when a node is selected) */}
        {panelOpen && selectedNode && (
          <div className="lg:hidden bg-[#0F1623] border border-[#1E2A3B] rounded-md animate-scale-in">
            <div className="px-4 py-3 border-b border-[#1E2A3B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(selectedNode.riskLevel) }} />
                <span className="text-xs text-[#7A8FA6] uppercase tracking-wider capitalize">{selectedNode.type}</span>
              </div>
              <button onClick={() => setPanelOpen(false)} className="text-[#4A5A6E] hover:text-[#E8EDF5] text-xs">✕ Close</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-base font-bold text-[#E8EDF5] mb-1">{selectedNode.label}</h3>
                <p className="text-sm text-[#7A8FA6] leading-relaxed">{selectedNode.description}</p>
              </div>
              <div>
                <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Causal Links</div>
                <div className="space-y-2">
                  {activeChain.edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(edge => {
                      const isOut  = edge.source === selectedNode.id
                      const other  = activeChain.nodes.find(n => n.id === (isOut ? edge.target : edge.source))
                      return (
                        <div key={edge.id} className="bg-[#161D2E] rounded p-2.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-[#4A5A6E]">{isOut ? '→ leads to' : '← from'}</span>
                            <span className="text-xs font-medium text-[#E8EDF5]">{other?.label}</span>
                          </div>
                          <p className="text-xs text-[#7A8FA6]">{edge.reasoning}</p>
                          {edge.probability && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <div className="flex-1 h-1 bg-[#1E2A3B] rounded-full overflow-hidden">
                                <div className="h-full bg-[#00C2FF] rounded-full" style={{ width: `${edge.probability * 100}%` }} />
                              </div>
                              <span className="text-[10px] font-mono text-[#00C2FF]">{Math.round(edge.probability * 100)}%</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Graph + detail: stacked on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Graph — responsive height */}
          <div className="lg:col-span-8">
            <div
              className="bg-[#0F1623] border border-[#1E2A3B] rounded-md"
              style={{ height: undefined }}
            >
              <div className="h-64 sm:h-80 md:h-96 lg:h-[480px]">
                <DominoGraph chain={activeChain} onSelectNode={handleNodeSelect} selectedId={selectedNode?.id} />
              </div>
            </div>
            <p className="text-[10px] text-[#4A5A6E] text-center mt-2">Tap a node to see reasoning and causal links</p>
          </div>

          {/* Node detail panel — desktop only (mobile uses drawer above) */}
          <div className="hidden lg:block lg:col-span-4">
            {selectedNode ? (
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
                <div className="px-4 py-3 border-b border-[#1E2A3B] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(selectedNode.riskLevel) }} />
                  <span className="text-xs text-[#7A8FA6] uppercase tracking-wider capitalize">{selectedNode.type}</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#E8EDF5] mb-1">{selectedNode.label}</h3>
                    <p className="text-sm text-[#7A8FA6] leading-relaxed">{selectedNode.description}</p>
                  </div>
                  <div>
                    <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Causal Links</div>
                    <div className="space-y-2">
                      {activeChain.edges
                        .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                        .map(edge => {
                          const isOut = edge.source === selectedNode.id
                          const other = activeChain.nodes.find(n => n.id === (isOut ? edge.target : edge.source))
                          return (
                            <div key={edge.id} className="bg-[#161D2E] rounded p-2.5">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] text-[#4A5A6E]">{isOut ? '→ leads to' : '← from'}</span>
                                <span className="text-xs font-medium text-[#E8EDF5]">{other?.label}</span>
                              </div>
                              <p className="text-xs text-[#7A8FA6]">{edge.reasoning}</p>
                              {edge.probability && (
                                <div className="mt-1.5 flex items-center gap-1.5">
                                  <div className="flex-1 h-1 bg-[#1E2A3B] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00C2FF] rounded-full" style={{ width: `${edge.probability * 100}%` }} />
                                  </div>
                                  <span className="text-[10px] font-mono text-[#00C2FF]">{Math.round(edge.probability * 100)}%</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md h-full flex flex-col">
                <div className="px-4 py-3 border-b border-[#1E2A3B]">
                  <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Chain Summary</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-xs text-[#4A5A6E]">{activeChain.nodes.length} nodes · {activeChain.edges.length} causal links</div>
                  <div className="space-y-2">
                    {activeChain.nodes.map(n => (
                      <div key={n.id} className="flex items-center gap-2 p-2 bg-[#161D2E] rounded">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getRiskColor(n.riskLevel) }} />
                        <span className="text-xs text-[#E8EDF5]">{n.label}</span>
                        <span className="ml-auto text-[10px] text-[#4A5A6E] capitalize">{n.type}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#4A5A6E]">Click any node to see reasoning and causal links</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
