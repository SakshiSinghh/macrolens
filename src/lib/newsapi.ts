// ─── MacroLens NewsAPI Client ─────────────────────────────────────────────────
// Fetches real macro news headlines from NewsAPI.org.
// Falls back to mock sources gracefully if NEWS_API_KEY is not set or the API fails.

import type { NewsArticle, MacroThemeKey } from '@/types'
import { mockSources } from './mock/sources'

const NEWSAPI_BASE = 'https://newsapi.org/v2'

// ─── NewsAPI response shapes ──────────────────────────────────────────────────

interface NewsApiSource {
  id: string | null
  name: string
}

interface NewsApiArticle {
  title: string
  description: string | null
  url: string
  source: NewsApiSource
  publishedAt: string
  urlToImage?: string | null
}

interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsApiArticle[]
  message?: string // error field
}

// ─── Theme classification ──────────────────────────────────────────────────────

/**
 * Keyword buckets used to assign macro themes to incoming articles.
 * Each article can match multiple themes.
 */
const THEME_CLASSIFIERS: Record<MacroThemeKey, string[]> = {
  inflation: ['inflation', 'cpi', 'consumer price', 'pce', 'price index', 'ppi', 'price pressure', 'wage growth'],
  'rate-hikes': ['federal reserve', 'fed', 'fomc', 'interest rate', 'hawkish', 'rate hike', 'rate cut', 'basis points', 'fed chair', 'monetary policy'],
  recession: ['recession', 'gdp', 'contraction', 'economic slowdown', 'pmi', 'negative growth', 'technical recession', 'economic downturn'],
  energy: ['oil price', 'crude oil', 'brent', 'wti', 'natural gas', 'opec', 'energy crisis', 'ttf', 'lng', 'energy shock'],
  geopolitical: ['war', 'sanctions', 'conflict', 'military', 'geopolit', 'houthi', 'red sea', 'ukraine', 'taiwan', 'nato', 'middle east'],
  'supply-chain': ['supply chain', 'shipping', 'freight rate', 'logistics', 'port congestion', 'container ship', 'reroute'],
  currency: ['dollar', 'dxy', 'currency', 'exchange rate', 'forex', 'devaluation', 'yen', 'lira', 'peso', 'emerging market currency'],
  property: ['property market', 'housing market', 'real estate', 'china developer', 'evergrande', 'country garden', 'mortgage rate', 'housing crisis'],
}

/** Reputable financial news sources that get a score boost */
const REPUTABLE_SOURCES = [
  'reuters', 'bloomberg', 'financial times', 'wall street journal',
  'wsj', 'ft', 'cnbc', 'economist', 'ft.com', 'marketwatch',
]

/** Rough country extraction from article text */
const COUNTRY_KEYWORDS: Record<string, string> = {
  'united states': 'US', 'u.s.': 'US', 'fed ': 'US', 'america': 'US',
  'china': 'CN', 'beijing': 'CN', 'chinese': 'CN',
  'germany': 'DE', 'german': 'DE', 'berlin': 'DE',
  'europe': 'EU', 'eurozone': 'EU', 'ecb': 'EU',
  'japan': 'JP', 'tokyo': 'JP', 'boj': 'JP',
  'uk': 'GB', 'united kingdom': 'GB', 'britain': 'GB',
  'russia': 'RU', 'moscow': 'RU',
  'india': 'IN', 'rbi': 'IN',
  'turkey': 'TR', 'lira': 'TR',
  'australia': 'AU', 'rba': 'AU',
  'brazil': 'BR',
  'south africa': 'ZA',
}

// ─── Normalisation helpers ────────────────────────────────────────────────────

function classifyThemes(text: string): MacroThemeKey[] {
  const lower = text.toLowerCase()
  return (Object.entries(THEME_CLASSIFIERS) as [MacroThemeKey, string[]][])
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([theme]) => theme)
}

function extractCountries(text: string): string[] {
  const lower = text.toLowerCase()
  const found = new Set<string>()
  for (const [keyword, code] of Object.entries(COUNTRY_KEYWORDS)) {
    if (lower.includes(keyword)) found.add(code)
  }
  return Array.from(found)
}

function computeMarketMovingScore(article: NewsApiArticle, themes: MacroThemeKey[]): number {
  const sourceLC = article.source.name.toLowerCase()
  const sourceBonus = REPUTABLE_SOURCES.some((s) => sourceLC.includes(s)) ? 20 : 0
  // Each matched theme adds relevance
  const themeScore = Math.min(70, themes.length * 25)
  return Math.min(100, themeScore + sourceBonus)
}

function normalizeArticle(raw: NewsApiArticle, index: number): NewsArticle {
  const text = `${raw.title} ${raw.description ?? ''}`
  const themes = classifyThemes(text)
  const countries = extractCountries(text)
  const marketMovingScore = computeMarketMovingScore(raw, themes)

  return {
    id: `newsapi-${index}-${Date.now()}`,
    headline: raw.title,
    source: raw.source.name,
    url: raw.url,
    publishedAt: raw.publishedAt,
    themes: themes.length > 0 ? themes : ['geopolitical'],
    countries,
    marketMovingScore,
    signalLabel:
      marketMovingScore >= 70
        ? 'high-impact'
        : marketMovingScore >= 40
        ? 'moderate'
        : 'noise',
    summary: raw.description ?? raw.title,
  }
}

// ─── Main export ───────────────────────────────────────────────────────────────

export interface NewsFetchResult {
  articles: NewsArticle[]
  source: 'live' | 'mock'
  fetchedAt: string
}

/**
 * Fetch macro news from NewsAPI.org.
 * Falls back to mock sources if NEWS_API_KEY is missing or the request fails.
 *
 * @param maxArticles Max number of articles to return (max 100 on NewsAPI free tier)
 */
export async function fetchMacroNews(maxArticles = 40): Promise<NewsFetchResult> {
  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    return {
      articles: mockSources.slice(0, maxArticles),
      source: 'mock',
      fetchedAt: new Date().toISOString(),
    }
  }

  try {
    // Broad macro query covering the main themes we track
    const query = encodeURIComponent(
      'inflation OR "Federal Reserve" OR "interest rates" OR recession OR "oil price" OR "currency crisis" OR "trade war" OR "supply chain"'
    )
    const pageSize = Math.min(maxArticles, 100)

    const url =
      `${NEWSAPI_BASE}/everything` +
      `?q=${query}` +
      `&language=en` +
      `&sortBy=publishedAt` +
      `&pageSize=${pageSize}` +
      `&apiKey=${apiKey}`

    const res = await fetch(url, {
      // Cache for 30 minutes — balances freshness with free-tier rate limits
      next: { revalidate: 1800 },
    })

    if (!res.ok) {
      console.error('[NewsAPI] HTTP error:', res.status)
      return { articles: mockSources.slice(0, maxArticles), source: 'mock', fetchedAt: new Date().toISOString() }
    }

    const data: NewsApiResponse = await res.json()

    if (data.status !== 'ok') {
      console.error('[NewsAPI] API error:', data.message)
      return { articles: mockSources.slice(0, maxArticles), source: 'mock', fetchedAt: new Date().toISOString() }
    }

    const normalized = (data.articles ?? [])
      // Filter out removed articles and articles without a real title
      .filter((a) => a.title && a.title !== '[Removed]' && a.url)
      .slice(0, maxArticles)
      .map((a, i) => normalizeArticle(a, i))

    if (!normalized.length) {
      return { articles: mockSources.slice(0, maxArticles), source: 'mock', fetchedAt: new Date().toISOString() }
    }

    return { articles: normalized, source: 'live', fetchedAt: new Date().toISOString() }
  } catch (error) {
    console.error('[NewsAPI] Fetch error:', error)
    return {
      articles: mockSources.slice(0, maxArticles),
      source: 'mock',
      fetchedAt: new Date().toISOString(),
    }
  }
}

/**
 * Filter articles by a specific macro theme key.
 * Useful when building theme-specific news feeds.
 */
export function filterByTheme(articles: NewsArticle[], theme: MacroThemeKey): NewsArticle[] {
  return articles.filter((a) => a.themes.includes(theme))
}
