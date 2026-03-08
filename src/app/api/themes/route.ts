export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockThemes } from '@/lib/mock/themes'
import { rankThemesByMomentum } from '@/lib/theme-engine'
import { computeThemeMomentum } from '@/lib/scoring'

// GET /api/themes
// Returns scored + ranked themes with fresh momentum scores
export async function GET() {
  try {
    const now = new Date()

    // Re-score all themes with fresh computeThemeMomentum values
    const scoredThemes = mockThemes.map((theme) => {
      const firstDetected = new Date(theme.firstDetectedAt)
      const daysSinceFirstDetected = Math.max(
        0,
        (now.getTime() - firstDetected.getTime()) / (1000 * 60 * 60 * 24)
      )

      const avgSeverity =
        theme.articleCount > 0
          ? Math.min(100, (theme.highImpactArticleCount / theme.articleCount) * 100)
          : 50

      const freshMomentum = computeThemeMomentum({
        articleCount: theme.articleCount,
        highImpactCount: theme.highImpactArticleCount,
        velocityPerDay: theme.velocity,
        daysSinceFirstDetected,
        avgSeverity,
      })

      return {
        ...theme,
        momentumScore: freshMomentum,
      }
    })

    // Rank by momentum score
    const rankedThemes = rankThemesByMomentum(scoredThemes)

    return NextResponse.json({
      themes: rankedThemes,
      generatedAt: new Date().toISOString(),
      source: 'computed' as const,
    })
  } catch (error) {
    console.error('[api/themes] Error ranking themes:', error)
    // Fallback to mock data sorted by existing momentum scores
    const sorted = [...mockThemes].sort((a, b) => b.momentumScore - a.momentumScore)
    return NextResponse.json({
      themes: sorted,
      generatedAt: new Date().toISOString(),
      source: 'mock' as const,
    })
  }
}
