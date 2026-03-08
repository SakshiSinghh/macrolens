'use client'
import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { DominoChain, DominoNode } from '@/types'
import { getRiskColor } from '@/lib/utils'

interface DominoGraphProps {
  chain: DominoChain
  onSelectNode: (node: DominoNode) => void
  selectedId?: string
}

const typeShapes: Record<string, string> = {
  event: '#EF4444',
  theme: '#F5A623',
  country: '#2D7DD2',
  sector: '#7A8FA6',
  asset: '#22C55E',
}

export function DominoGraph({ chain, onSelectNode, selectedId }: DominoGraphProps) {
  const flowNodes: Node[] = chain.nodes.map(n => ({
    id: n.id,
    position: n.position,
    data: { label: n.label, node: n },
    style: {
      background: selectedId === n.id ? '#00C2FF15' : '#161D2E',
      border: `1.5px solid ${selectedId === n.id ? '#00C2FF' : getRiskColor(n.riskLevel)}`,
      borderRadius: 6,
      color: '#E8EDF5',
      fontSize: 11,
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      padding: '8px 12px',
      minWidth: 120,
      textAlign: 'center' as const,
      cursor: 'pointer',
      boxShadow: selectedId === n.id ? '0 0 12px #00C2FF40' : 'none',
    },
  }))

  const flowEdges: Edge[] = chain.edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.probability ? `${Math.round(e.probability * 100)}%` : e.label,
    style: {
      stroke: e.strength === 'strong' ? '#F5A623' : e.strength === 'moderate' ? '#7A8FA6' : '#4A5A6E',
      strokeWidth: e.strength === 'strong' ? 2 : 1.5,
    },
    labelStyle: { fill: '#7A8FA6', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
    labelBgStyle: { fill: '#0F1623', fillOpacity: 0.9 },
    animated: e.strength === 'strong',
  }))

  const [nodes, , onNodesChange] = useNodesState(flowNodes)
  const [edges, , onEdgesChange] = useEdgesState(flowEdges)

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const original = chain.nodes.find(n => n.id === node.id)
    if (original) onSelectNode(original)
  }, [chain.nodes, onSelectNode])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      nodesDraggable={false}
      style={{ background: '#080C14' }}
    >
      <Background variant={BackgroundVariant.Dots} color="#1E2A3B" gap={20} size={1} />
      <Controls style={{ button: { background: '#161D2E', border: '1px solid #1E2A3B', color: '#7A8FA6' } } as React.CSSProperties} />
      <MiniMap
        style={{ background: '#0F1623', border: '1px solid #1E2A3B' }}
        nodeColor={n => {
          const orig = chain.nodes.find(x => x.id === n.id)
          return orig ? getRiskColor(orig.riskLevel) : '#1E2A3B'
        }}
      />
    </ReactFlow>
  )
}
