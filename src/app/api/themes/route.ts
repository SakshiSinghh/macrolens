export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockThemes } from '@/lib/mock/themes'
import { rankThemesByMomentum } from '@/lib/theme-engine'
import { computeThemeMomentum } from '@/lib/scoring'
import { fetchMacroNews } from '@/lib/newsapi'
import type { MacroThemeKey } from '@/types'

// Safety lock: when NEXT_PUBLIC_DEMO_MODE=true, all routes skip live calls
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// GET /api/themes
// Phase 3: fetches real news from NewsAPI and boosts/adjusts theme momentum
// based on live article counts. Falls back to scored mock themes if NewsAPI unavailable.
export async function GET() {
  try {
    if (DEMO_MODE) {
      const sorted = [...mockThemes].sort((a, b) => b.momentumScore - a.momentumScore)
      return NextResponse.json({
        themes: sorted,
        generatedAt: new Date().toISOString(),
        newsSource: 'demo',
        liveArticleCounts: {},
      })
    }

    // Fetch news — returns mock sources if NEWS_API_KEY not configured
    const { articles, source: newsSource } = await fetchMacroNews(60)

    const now = new Date()

    // Count live articles per theme from real (or mock) news
    const liveArticleCounts: Partial<Record<MacroThemeKey, number>> = {}
    for (const article of articles) {
      for (const theme of article.themes) {
        liveArticleCounts[theme] = (liveArticleCounts[theme] ?? 0) + 1
      }
    }

    // Re-score all themes, blending mock baseline with live article signal
    const scoredThemes = mockThemes.map((theme) => {
      const firstDetected = new Date(theme.firstDetectedAt)
      const daysSinceFirstDetected = Math.max(
        0,
        (now.getTime() - firstDetected.getTime()) / (1000 * 60 * 60 * 24)
      )

      // If we have live article counts, blend them in as a velocity boost
      const liveCount = liveArticleCounts[theme.key] ?? 0
      const blendedArticleCount =
        newsSource === 'live'
          ? Math.max(theme.articleCount, theme.articleCount + liveCount)
          : theme.articleCount

      const blendedHighImpact =
        newsSource === 'live'
          ? Math.max(theme.highImpactArticleCount, Math.round(liveCount * 0.3))
          : theme.highImpactArticleCount

      // Velocity adjustment: live count > 5 articles → small velocity boost
      const velocityBoost = newsSource === 'live' && liveCount > 5 ? liveCount * 0.1 : 0
      const blendedVelocity = Math.min(10, theme.velocity + velocityBoost)

      const avgSeverity =
        blendedArticleCount > 0
          ? Math.min(100, (blendedHighImpact / blendedArticleCount) * 100)
          : 50

      const freshMomentum = computeThemeMomentum({
        articleCount: blendedArticleCount,
        highImpactCount: blendedHighImpact,
        velocityPerDay: blendedVelocity,
        daysSinceFirstDetected,
        avgSeverity,
      })

      return {
        ...theme,
        momentumScore: freshMomentum,
        articleCount: blendedArticleCount,
      }
    })

    // Rank by momentum score
    const rankedThemes = rankThemesByMomentum(scoredThemes)

    return NextResponse.json({
      themes: rankedThemes,
      generatedAt: new Date().toISOString(),
      newsSource,
      liveArticleCounts,
    })
  } catch (error) {
    console.error('[api/themes] Error ranking themes:', error)
    // Fallback to mock data sorted by existing momentum scores
    const sorted = [...mockThemes].sort((a, b) => b.momentumScore - a.momentumScore)
    return NextResponse.json({
      themes: sorted,
      generatedAt: new Date().toISOString(),
      newsSource: 'mock',
    })
  }
}
