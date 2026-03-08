export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { classifyRegime } from '@/lib/scoring'
import { mockRegime } from '@/lib/mock/regime'

// Current indicator values matching the mock data narrative
const CURRENT_INDICATORS = {
  cpiYoY: 3.2,
  fedFundsRate: 5.5,
  yieldTenYear: 4.82,
  unemploymentRate: 4.1,
  gdpGrowthQoQ: 0.8,
}

// GET /api/regime
// Returns the current macro regime, computed from indicators (FRED data in Phase 3)
export async function GET() {
  try {
    const computed = classifyRegime(CURRENT_INDICATORS)

    const response = {
      current: computed.regime,
      label: computed.label,
      confidence: computed.confidence,
      shiftingToward: computed.shiftingToward,
      shiftingLabel: computed.shiftingLabel,
      drivers: mockRegime.drivers,
      lastUpdated: new Date().toISOString(),
      indicators: {
        cpiYoY: CURRENT_INDICATORS.cpiYoY,
        fedFundsRate: CURRENT_INDICATORS.fedFundsRate,
        yieldTenYear: CURRENT_INDICATORS.yieldTenYear,
        unemploymentRate: CURRENT_INDICATORS.unemploymentRate,
        gdpGrowthQoQ: CURRENT_INDICATORS.gdpGrowthQoQ,
      },
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[api/regime] Error computing regime:', error)
    // Fallback to mock data
    return NextResponse.json({
      ...mockRegime,
      indicators: CURRENT_INDICATORS,
      generatedAt: new Date().toISOString(),
    })
  }
}
