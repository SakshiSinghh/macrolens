export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockHeatmap } from '@/lib/mock/heatmap'
import { computeMacroRiskScore, scoreToRiskLevel } from '@/lib/scoring'
import { MacroThemeKey } from '@/types'

// GET /api/heatmap?theme=inflation
// Returns country risk scores for the given theme (defaults to 'inflation')
// Uses computeMacroRiskScore for each country to recompute risk scores
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = (searchParams.get('theme') ?? 'inflation') as MacroThemeKey

    // Re-score each country using computeMacroRiskScore with their scoreBreakdown
    const recomputedCountries = mockHeatmap.map((country) => {
      const { newsVolume, aiSeverity, indicatorMovement, marketReaction } =
        country.scoreBreakdown

      // If this theme is active for the country, use the stored breakdown
      // Otherwise, apply a 20% discount to reflect lower theme relevance
      const isActiveTheme = country.activeThemes.includes(theme)
      const themeScoreForCountry = country.themeScores[theme]

      let computedScore: number
      if (isActiveTheme && themeScoreForCountry !== undefined) {
        // Use the theme-specific score from themeScores as the base, blended with breakdown
        const blendedBreakdown = {
          newsVolume: Math.min(100, newsVolume * (themeScoreForCountry / 100) * 1.2),
          aiSeverity: Math.min(100, aiSeverity * (themeScoreForCountry / 100) * 1.2),
          indicatorMovement: Math.min(100, indicatorMovement * (themeScoreForCountry / 100) * 1.1),
          marketReaction: Math.min(100, marketReaction * (themeScoreForCountry / 100) * 1.1),
        }
        computedScore = computeMacroRiskScore(blendedBreakdown)
      } else if (themeScoreForCountry !== undefined) {
        // Has theme score but not an active theme — scale down
        const scaledBreakdown = {
          newsVolume: newsVolume * 0.6,
          aiSeverity: aiSeverity * 0.6,
          indicatorMovement: indicatorMovement * 0.6,
          marketReaction: marketReaction * 0.6,
        }
        computedScore = computeMacroRiskScore(scaledBreakdown)
      } else {
        // Theme not relevant to this country — use base score with discount
        computedScore = computeMacroRiskScore({
          newsVolume: newsVolume * 0.3,
          aiSeverity: aiSeverity * 0.3,
          indicatorMovement: indicatorMovement * 0.3,
          marketReaction: marketReaction * 0.3,
        })
      }

      return {
        ...country,
        riskScore: computedScore,
        riskLevel: scoreToRiskLevel(computedScore),
      }
    })

    // Sort by computed risk score descending
    const sorted = recomputedCountries.sort((a, b) => b.riskScore - a.riskScore)

    return NextResponse.json({
      countries: sorted,
      theme,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[api/heatmap] Error computing heatmap:', error)
    // Fallback to mock data
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get('theme') ?? 'inflation'
    return NextResponse.json({
      countries: mockHeatmap,
      theme,
      generatedAt: new Date().toISOString(),
    })
  }
}
