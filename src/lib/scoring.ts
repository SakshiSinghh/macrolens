// ─── MacroLens Scoring Engine ────────────────────────────────────────────────

/**
 * Macro Heat Score = 0.30*newsVolume + 0.30*aiSeverity + 0.20*indicatorMovement + 0.20*marketReaction
 * Each component is 0-100. Returns 0-100.
 */
export function computeMacroRiskScore(components: {
  newsVolume: number
  aiSeverity: number
  indicatorMovement: number
  marketReaction: number
}): number {
  const raw =
    0.3 * components.newsVolume +
    0.3 * components.aiSeverity +
    0.2 * components.indicatorMovement +
    0.2 * components.marketReaction

  return Math.min(100, Math.max(0, Math.round(raw)))
}

/**
 * Map a 0-100 score to RiskLevel
 * <20=low, 20-40=moderate, 40-60=elevated, 60-80=high, 80+=critical
 */
export function scoreToRiskLevel(
  score: number
): 'low' | 'moderate' | 'elevated' | 'high' | 'critical' {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'elevated'
  if (score >= 20) return 'moderate'
  return 'low'
}

/**
 * Compute theme momentum score (0-100) from article velocity, recency, and severity.
 * Blend: velocity contribution + highImpactRatio contribution + avgSeverity contribution + recency decay
 */
export function computeThemeMomentum(params: {
  articleCount: number
  highImpactCount: number
  velocityPerDay: number
  daysSinceFirstDetected: number
  avgSeverity: number
}): number {
  const { articleCount, highImpactCount, velocityPerDay, daysSinceFirstDetected, avgSeverity } =
    params

  // Velocity component: cap at 10 pts/day → maps to 100
  const velocityComponent = Math.min(100, velocityPerDay * 10) * 0.35

  // High-impact ratio component
  const highImpactRatio = articleCount > 0 ? highImpactCount / articleCount : 0
  const highImpactComponent = highImpactRatio * 30

  // Severity component (already 0-100)
  const severityComponent = avgSeverity * 0.3

  // Recency decay: full weight within 7 days, decays over 90 days
  const recencyDecay = Math.max(0, 1 - daysSinceFirstDetected / 90)
  const recencyComponent = recencyDecay * 5

  const raw = velocityComponent + highImpactComponent + severityComponent + recencyComponent
  return Math.min(100, Math.max(0, Math.round(raw)))
}

// Keywords used for article signal scoring
const HIGH_IMPACT_KEYWORDS = [
  'CPI',
  'Fed',
  'inflation',
  'crisis',
  'default',
  'recession',
  'rate hike',
  'sanctions',
  'war',
  'FOMC',
  'hawkish',
  'stagflation',
  'collapse',
  'contagion',
  'systemic',
]

const NOISE_KEYWORDS = ['recap', 'preview', 'analysis', 'roundup', 'explainer', 'week ahead', 'opinion']

/**
 * Score a single news article for market impact (0-100).
 * score>=70=high-impact, >=40=moderate, else noise
 */
export function scoreArticleSignal(article: {
  headline: string
  source: string
  keywords?: string[]
}): { score: number; label: 'high-impact' | 'moderate' | 'noise' } {
  const text = [article.headline, ...(article.keywords ?? [])].join(' ').toLowerCase()

  // Check for noise keywords first
  const isNoise = NOISE_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()))
  if (isNoise) {
    return { score: 20, label: 'noise' }
  }

  // Count high-impact keyword hits
  let hitCount = 0
  for (const kw of HIGH_IMPACT_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) {
      hitCount++
    }
  }

  // Base score from keyword hits (each hit adds ~15 pts, cap at 100)
  let score = Math.min(100, hitCount * 15)

  // Bonus for reputable sources
  const reputableSources = ['financial times', 'bloomberg', 'reuters', 'wall street journal', 'wsj', 'ft']
  const sourceLC = article.source.toLowerCase()
  if (reputableSources.some((s) => sourceLC.includes(s))) {
    score = Math.min(100, score + 10)
  }

  let label: 'high-impact' | 'moderate' | 'noise'
  if (score >= 70) {
    label = 'high-impact'
  } else if (score >= 40) {
    label = 'moderate'
  } else {
    label = 'noise'
  }

  return { score, label }
}

/**
 * Classify macro regime from indicator snapshot.
 * Rule-based classification returning regime, label, confidence, and shifting direction.
 */
export function classifyRegime(indicators: {
  cpiYoY: number
  fedFundsRate: number
  yieldTenYear: number
  unemploymentRate: number
  gdpGrowthQoQ: number
}): {
  regime: string
  label: string
  confidence: number
  shiftingToward: string
  shiftingLabel: string
} {
  const { cpiYoY, fedFundsRate, yieldTenYear, unemploymentRate, gdpGrowthQoQ } = indicators

  // Tightening: high inflation AND high rates
  if (cpiYoY > 4 && fedFundsRate > 4) {
    // Check if growth is stalling → shifting toward stagflation
    const shiftingToStagflation = gdpGrowthQoQ < 1
    return {
      regime: 'tightening',
      label: 'Late-Cycle Tightening',
      confidence: Math.round(70 + Math.min(20, (cpiYoY - 4) * 5 + (fedFundsRate - 4) * 2)),
      shiftingToward: shiftingToStagflation ? 'stagflation-risk' : 'easing',
      shiftingLabel: shiftingToStagflation ? 'Stagflation Risk' : 'Policy Easing',
    }
  }

  // Stagflation risk: moderately high inflation + weak growth
  if (cpiYoY > 3 && gdpGrowthQoQ < 1) {
    return {
      regime: 'stagflation-risk',
      label: 'Stagflation Risk',
      confidence: Math.round(65 + Math.min(20, (cpiYoY - 3) * 5)),
      shiftingToward: gdpGrowthQoQ < 0 ? 'recession' : 'tightening',
      shiftingLabel: gdpGrowthQoQ < 0 ? 'Recession' : 'Late-Cycle Tightening',
    }
  }

  // Recession: negative GDP + rising unemployment
  if (gdpGrowthQoQ < 0 && unemploymentRate > 5) {
    return {
      regime: 'recession',
      label: 'Recession',
      confidence: Math.round(75 + Math.min(15, unemploymentRate * 2)),
      shiftingToward: 'easing',
      shiftingLabel: 'Policy Easing',
    }
  }

  // Easing: low/falling rates, low inflation
  if (fedFundsRate < 3 && cpiYoY < 3) {
    // Check if growth is picking up
    const growthStrong = gdpGrowthQoQ > 1.5
    return {
      regime: 'easing',
      label: 'Policy Easing',
      confidence: 68,
      shiftingToward: growthStrong ? 'early-expansion' : 'easing',
      shiftingLabel: growthStrong ? 'Early Expansion' : 'Extended Easing',
    }
  }

  // Early expansion: low rates, moderate growth, contained inflation
  if (gdpGrowthQoQ > 1.5 && cpiYoY < 3 && fedFundsRate < 4) {
    return {
      regime: 'early-expansion',
      label: 'Early Expansion',
      confidence: 70,
      shiftingToward: 'late-cycle',
      shiftingLabel: 'Late-Cycle Growth',
    }
  }

  // Late cycle: strong growth but rising inflation pressures
  if (gdpGrowthQoQ > 0.5 && cpiYoY > 2 && cpiYoY <= 3 && fedFundsRate > 3) {
    return {
      regime: 'late-cycle',
      label: 'Late-Cycle Growth',
      confidence: 65,
      shiftingToward: 'tightening',
      shiftingLabel: 'Monetary Tightening',
    }
  }

  // Default: tightening with moderate confidence
  return {
    regime: 'tightening',
    label: 'Late-Cycle Tightening',
    confidence: 72,
    shiftingToward: 'stagflation-risk',
    shiftingLabel: 'Stagflation Risk',
  }
}
