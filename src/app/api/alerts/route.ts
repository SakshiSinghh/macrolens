export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockAlerts } from '@/lib/mock/alerts'
import { mockThemes } from '@/lib/mock/themes'
import { mockHeatmap } from '@/lib/mock/heatmap'
import { generateAlerts, rankAlerts } from '@/lib/alert-engine'

// GET /api/alerts
// Generates and returns ranked alerts using the alert engine, falls back to mockAlerts
export async function GET() {
  try {
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

    // Current macro indicators
    const indicators: Record<string, number> = {
      cpiYoY: 3.2,
      fedFundsRate: 5.5,
      yieldTenYear: 4.82,
      unemploymentRate: 4.1,
      gdpGrowthQoQ: 0.8,
    }

    // Generate and rank alerts
    const generatedAlerts = generateAlerts({
      themes: themeInputs,
      countryScores,
      indicators,
    })

    const rankedGenerated = rankAlerts(generatedAlerts)

    // If generation produced results, use them; otherwise fall back to mock
    const alerts = rankedGenerated.length > 0 ? rankedGenerated : rankAlerts(mockAlerts)

    return NextResponse.json({
      alerts,
      generatedAt: new Date().toISOString(),
      totalCount: alerts.length,
    })
  } catch (error) {
    console.error('[api/alerts] Error generating alerts:', error)
    // Fallback to ranked mock alerts
    const ranked = rankAlerts(mockAlerts)
    return NextResponse.json({
      alerts: ranked,
      generatedAt: new Date().toISOString(),
      totalCount: ranked.length,
    })
  }
}
