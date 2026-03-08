export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockDominoChains } from '@/lib/mock/domino'

// Map themeId query param to chain IDs
const THEME_TO_CHAIN_ID: Record<string, string> = {
  'inflation-cascade': 'chain-us-inflation',
  'inflation': 'chain-us-inflation',
  'us-inflation': 'chain-us-inflation',
  'china-property': 'chain-china-property',
  'china-property-cascade': 'chain-china-property',
  'property': 'chain-china-property',
}

// GET /api/domino?themeId=inflation-cascade
// Returns domino chain for the given theme
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const themeId = searchParams.get('themeId') ?? 'inflation-cascade'

    // Map themeId to a chain ID
    const chainId = THEME_TO_CHAIN_ID[themeId]

    // Find the chain by mapped ID or by direct ID match
    let chain = chainId
      ? mockDominoChains.find((c) => c.id === chainId)
      : mockDominoChains.find((c) => c.id === themeId)

    // If no match found, return the first chain as default
    if (!chain) {
      chain = mockDominoChains[0]
    }

    // Related chains: all other chains besides the current one
    const relatedChains = mockDominoChains
      .filter((c) => c.id !== chain!.id)
      .map((c) => c.id)

    return NextResponse.json({
      chain,
      relatedChains,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[api/domino] Error fetching domino chain:', error)
    return NextResponse.json({
      chain: mockDominoChains[0],
      relatedChains: mockDominoChains.slice(1).map((c) => c.id),
      generatedAt: new Date().toISOString(),
    })
  }
}
