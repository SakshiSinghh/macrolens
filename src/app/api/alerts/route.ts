export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockAlerts } from '@/lib/mock/alerts'
import { mockThemes } from '@/lib/mock/themes'
import { mockHeatmap } from '@/lib/mock/heatmap'
import { generateAlerts, rankAlerts } from '@/lib/alert-engine'
import { fetchMacroIndicators } from '@/lib/fred'

// GET /api/alerts
// Phase 3: uses live FRED indicators for the scoring pipeline when available.
// Falls back to hardcoded indicators + mock alerts if FRED is unavailable.
export async function GET() {
  try {
    // Fetch indicators — returns mock if FRED_API_KEY not set
    const indicators = await fetchMacroIndicators()

    // Build country scores map from heatmap data
    const countryScores: Record<string, number> = {}
    for (const country of mockHeatmap) {
      countryScores[country.countryCode] = country.riskScore
    }

    // Build theme input for the alert engine
    const themeInputs = mockThemes.map((theme) => ({
      themeKey: theme.key,
      momentumScore: theme.momentumScore,
      affectedCountries: theme.affectedCountries,
    }))

    // Pass live (or fallback) indicators to the scoring engine
    const indicatorMap: Record<string, number> = {
      cpiYoY: indicators.cpiYoY,
      fedFundsRate: indicators.fedFundsRate,
      yieldTenYear: indicators.yieldTenYear,
      unemploymentRate: indicators.unemploymentRate,
      gdpGrowthQoQ: indicators.gdpGrowthQoQ,
    }

    // Generate and rank alerts
    const generatedAlerts = generateAlerts({
      themes: themeInputs,
      countryScores,
      indicators: indicatorMap,
    })

    const rankedGenerated = rankAlerts(generatedAlerts)

    // Prefer generated alerts; fall back to mock if generation is empty
    const alerts = rankedGenerated.length > 0 ? rankedGenerated : rankAlerts(mockAlerts)

    return NextResponse.json({
      alerts,
      generatedAt: new Date().toISOString(),
      totalCount: alerts.length,
      indicatorSource: indicators.source,
    })
  } catch (error) {
    console.error('[api/alerts] Error generating alerts:', error)
    const ranked = rankAlerts(mockAlerts)
    return NextResponse.json({
      alerts: ranked,
      generatedAt: new Date().toISOString(),
      totalCount: ranked.length,
      indicatorSource: 'mock',
    })
  }
}
