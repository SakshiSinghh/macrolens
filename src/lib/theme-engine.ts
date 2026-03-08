// ─── MacroLens Theme Engine ───────────────────────────────────────────────────

import { MacroTheme } from '@/types'
import { computeThemeMomentum } from './scoring'

// Keyword map for theme extraction
const THEME_KEYWORDS: Record<string, string[]> = {
  inflation: ['CPI', 'inflation', 'price', 'PCE', 'consumer price', 'PPI', 'wage', 'cost of living'],
  'rate-hikes': ['Fed', 'rate hike', 'FOMC', 'hawkish', 'rate cut', 'interest rate', 'Fed Chair', 'basis points', 'federal funds'],
  'china-property': ['China', 'property', 'Evergrande', 'developer', 'real estate', 'housing', 'Country Garden'],
  energy: ['oil', 'gas', 'energy', 'OPEC', 'crude', 'pipeline', 'TTF', 'LNG', 'Brent', 'WTI'],
  geopolitical: ['war', 'sanctions', 'conflict', 'military', 'geopolit', 'Houthi', 'Red Sea', 'Ukraine', 'invasion'],
  recession: ['recession', 'GDP', 'growth', 'contraction', 'slowdown', 'PMI', 'industrial output', 'technical recession'],
  currency: ['USD', 'FX', 'currency', 'exchange rate', 'devaluation', 'dollar', 'DXY', 'lira', 'yen', 'peso', 'rand'],
  'supply-chain': ['supply chain', 'shipping', 'port', 'logistics', 'inventory', 'freight', 'container', 'reroute'],
}

// Theme display names for each key
const THEME_NAMES: Record<string, string> = {
  inflation: 'Inflation',
  'rate-hikes': 'Rate Hikes / Fed Policy',
  'china-property': 'China Property Stress',
  energy: 'Energy Markets',
  geopolitical: 'Geopolitical Risk',
  recession: 'Recession Risk',
  currency: 'Currency / FX Pressure',
  'supply-chain': 'Supply Chain Disruption',
}

/**
 * Count keyword matches in text (case-insensitive)
 */
function countKeywordMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  return keywords.filter((kw) => lower.includes(kw.toLowerCase())).length
}

/**
 * Given a list of articles, group them into macro themes using keyword matching.
 */
export function extractThemesFromArticles(
  articles: Array<{
    headline: string
    source: string
    publishedAt: string
    countries?: string[]
  }>
): Array<{
  themeKey: string
  themeName: string
  articleCount: number
  countries: string[]
  avgSeverity: number
}> {
  // Accumulate article counts and countries per theme
  const themeAccumulator: Record<
    string,
    { count: number; countries: Set<string>; severitySum: number }
  > = {}

  for (const [themeKey] of Object.entries(THEME_KEYWORDS)) {
    themeAccumulator[themeKey] = { count: 0, countries: new Set(), severitySum: 0 }
  }

  for (const article of articles) {
    const text = article.headline

    for (const [themeKey, keywords] of Object.entries(THEME_KEYWORDS)) {
      const matchCount = countKeywordMatches(text, keywords)
      if (matchCount > 0) {
        themeAccumulator[themeKey].count++
        // Severity proxy: number of matched keywords * 15, capped at 100
        themeAccumulator[themeKey].severitySum += Math.min(100, matchCount * 15)
        if (article.countries) {
          for (const country of article.countries) {
            themeAccumulator[themeKey].countries.add(country)
          }
        }
      }
    }
  }

  // Build result array for themes that have at least 1 article
  return Object.entries(themeAccumulator)
    .filter(([, acc]) => acc.count > 0)
    .map(([themeKey, acc]) => ({
      themeKey,
      themeName: THEME_NAMES[themeKey] ?? themeKey,
      articleCount: acc.count,
      countries: Array.from(acc.countries),
      avgSeverity: acc.count > 0 ? Math.round(acc.severitySum / acc.count) : 0,
    }))
    .sort((a, b) => b.articleCount - a.articleCount)
}

/**
 * Re-score all themes based on current article data, returns updated momentum scores.
 * Preserves all other fields from mock themes.
 */
export function rankThemesByMomentum(themes: MacroTheme[]): MacroTheme[] {
  const now = new Date()

  return themes
    .map((theme) => {
      const firstDetected = new Date(theme.firstDetectedAt)
      const daysSinceFirstDetected = Math.max(
        0,
        (now.getTime() - firstDetected.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Estimate avgSeverity from existing data
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
    .sort((a, b) => b.momentumScore - a.momentumScore)
}

/**
 * Detect if a theme is heating up, cooling, or stable based on recent velocity vs historical avg.
 */
export function detectTrendDirection(
  recentVelocity: number,
  historicalAvg: number
): 'rising-fast' | 'rising' | 'stable' | 'cooling' {
  if (historicalAvg === 0) {
    if (recentVelocity > 2) return 'rising-fast'
    if (recentVelocity > 0) return 'rising'
    return 'stable'
  }

  const ratio = recentVelocity / historicalAvg

  if (ratio >= 1.5) return 'rising-fast'
  if (ratio >= 1.1) return 'rising'
  if (ratio >= 0.8) return 'stable'
  return 'cooling'
}
