export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { classifyRegime } from '@/lib/scoring'
import { fetchMacroIndicators, buildRegimeDrivers } from '@/lib/fred'
import { mockRegime } from '@/lib/mock/regime'

// GET /api/regime
// Returns the current macro regime.
// Phase 3: uses live FRED indicators when FRED_API_KEY is configured.
// Falls back to mock data gracefully if the API is unavailable.
export async function GET() {
  try {
    // Fetch indicators — returns mock data if FRED_API_KEY not set
    const indicators = await fetchMacroIndicators()

    const computed = classifyRegime({
      cpiYoY: indicators.cpiYoY,
      fedFundsRate: indicators.fedFundsRate,
      yieldTenYear: indicators.yieldTenYear,
      unemploymentRate: indicators.unemploymentRate,
      gdpGrowthQoQ: indicators.gdpGrowthQoQ,
    })

    // Use live driver strings when data is live; keep mock drivers otherwise
    const drivers =
      indicators.source === 'live'
        ? buildRegimeDrivers(indicators)
        : mockRegime.drivers

    const response = {
      current: computed.regime,
      label: computed.label,
      confidence: computed.confidence,
      shiftingToward: computed.shiftingToward,
      shiftingLabel: computed.shiftingLabel,
      drivers,
      lastUpdated: new Date().toISOString(),
      indicators: {
        cpiYoY: indicators.cpiYoY,
        fedFundsRate: indicators.fedFundsRate,
        yieldTenYear: indicators.yieldTenYear,
        unemploymentRate: indicators.unemploymentRate,
        gdpGrowthQoQ: indicators.gdpGrowthQoQ,
      },
      dataSource: indicators.source,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[api/regime] Unexpected error:', error)
    // Last-resort fallback to fully static mock
    return NextResponse.json({
      ...mockRegime,
      dataSource: 'mock',
      generatedAt: new Date().toISOString(),
    })
  }
}
