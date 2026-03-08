export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockEpisodes } from '@/lib/mock/memory'
import { HistoricalEpisode } from '@/types'

/**
 * Compute a similarity score between a query and an episode based on keyword overlap.
 * Returns 0-100.
 */
function computeSimilarityScore(query: string, episode: HistoricalEpisode): number {
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2) // ignore short words

  if (queryWords.length === 0) return episode.similarityScore

  // Build a searchable text from the episode
  const episodeText = [
    episode.title,
    episode.summary,
    ...episode.themes,
    ...episode.countries,
    ...episode.whatHappenedNext,
    ...episode.assetImpacts.map((ai) => ai.asset + ' ' + ai.description),
  ]
    .join(' ')
    .toLowerCase()

  // Count keyword hits
  let hitCount = 0
  for (const word of queryWords) {
    if (episodeText.includes(word)) {
      hitCount++
    }
  }

  // Keyword overlap ratio (0-1)
  const overlapRatio = queryWords.length > 0 ? hitCount / queryWords.length : 0

  // Theme matching bonus: direct theme match in query
  const themeBonus = episode.themes.some((t) =>
    query.toLowerCase().includes(t.toLowerCase())
  )
    ? 20
    : 0

  // Blend: 60% overlap ratio * 80 + 40% existing similarityScore + themeBonus
  const computedScore = Math.min(
    100,
    Math.round(overlapRatio * 60 + episode.similarityScore * 0.4 + themeBonus)
  )

  return computedScore
}

// GET /api/memory?query=inflation
// Returns historical episodes sorted by relevance to query
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') ?? ''

    // Score each episode by similarity to query
    const scoredEpisodes = mockEpisodes.map((episode) => ({
      ...episode,
      similarityScore: query.trim()
        ? computeSimilarityScore(query, episode)
        : episode.similarityScore,
    }))

    // Sort by similarity score descending
    const sorted = scoredEpisodes.sort((a, b) => b.similarityScore - a.similarityScore)

    // Count episodes with meaningful match (score > 40 when query given)
    const matchCount = query.trim()
      ? sorted.filter((e) => e.similarityScore > 40).length
      : sorted.length

    return NextResponse.json({
      episodes: sorted,
      query,
      matchCount,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[api/memory] Error processing memory query:', error)
    return NextResponse.json({
      episodes: mockEpisodes,
      query: '',
      matchCount: mockEpisodes.length,
      generatedAt: new Date().toISOString(),
    })
  }
}
