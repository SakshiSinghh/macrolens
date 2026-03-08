export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { fetchMacroNews } from '@/lib/newsapi'
import type { MacroThemeKey } from '@/types'

// GET /api/news?theme=inflation&limit=20
// Returns macro news articles, optionally filtered by theme.
// Phase 3: uses NewsAPI when NEWS_API_KEY is set, otherwise mock sources.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get('theme') as MacroThemeKey | null
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '30', 10), 100)

    const { articles, source, fetchedAt } = await fetchMacroNews(Math.max(limit, 60))

    // Filter by theme if requested
    const filtered = theme
      ? articles.filter((a) => a.themes.includes(theme))
      : articles

    return NextResponse.json({
      articles: filtered.slice(0, limit),
      totalCount: filtered.length,
      source,
      fetchedAt,
    })
  } catch (error) {
    console.error('[api/news] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news', articles: [], source: 'mock' },
      { status: 500 }
    )
  }
}
