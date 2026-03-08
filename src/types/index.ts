// ─── Primitives ───────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high' | 'critical'
export type TrendDirection = 'rising' | 'falling' | 'stable'
export type AssetClass = 'equity' | 'bond' | 'fx' | 'commodity' | 'crypto'
export type MacroThemeKey =
  | 'inflation'
  | 'rate-hikes'
  | 'recession'
  | 'currency'
  | 'geopolitical'
  | 'supply-chain'
  | 'energy'
  | 'property'

export type RegimeLabel =
  | 'early-expansion'
  | 'late-cycle'
  | 'tightening'
  | 'stagflation-risk'
  | 'recession'
  | 'easing'
  | 'crisis'

// ─── Macro Regime ─────────────────────────────────────────────────────────────

export interface MacroRegime {
  current: RegimeLabel
  label: string
  shiftingToward: RegimeLabel
  shiftingLabel: string
  confidence: number
  drivers: string[]
  lastUpdated: string
}

// ─── News / Sources ───────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string
  headline: string
  source: string
  url: string
  publishedAt: string
  themes: MacroThemeKey[]
  countries: string[]
  marketMovingScore: number // 0–100
  signalLabel?: 'high-impact' | 'moderate' | 'noise'
  summary: string
}

// ─── Theme Radar ──────────────────────────────────────────────────────────────

export interface ThemeTimelineEvent {
  date: string
  headline: string
  impact: 'low' | 'medium' | 'high'
  articleId?: string
}

export interface MacroTheme {
  id: string
  name: string
  key: MacroThemeKey
  description: string
  momentumScore: number
  trendDirection: TrendDirection
  velocity: number // pts/day
  firstDetectedAt: string
  affectedCountries: string[]
  relatedDrivers: string[]
  articleCount: number
  highImpactArticleCount: number
  lastUpdated: string
  timeline: ThemeTimelineEvent[]
  lifecycleData: number[] // 30-day daily scores
  badge?: 'rising-fast' | 'cooling' | 'elevated-risk' | 'emerging'
  sourceArticles: NewsArticle[]
}

// ─── Risk Alerts ──────────────────────────────────────────────────────────────

export interface Evidence {
  type: 'news' | 'indicator' | 'market'
  headline: string
  source: string
  timestamp: string
  url?: string
  marketMovingScore?: number
}

export interface RiskAlert {
  id: string
  title: string
  severity: RiskLevel
  confidenceScore: number
  triggeredAt: string
  relatedTheme: MacroThemeKey
  triggerReasons: string[]
  implications: string[]
  impactedCountries: string[]
  impactedSectors: string[]
  impactedAssetClasses: string[]
  supportingEvidence: Evidence[]
  watchpoints: {
    shortTerm: string[]
    mediumTerm: string[]
  }
  sourceArticles: NewsArticle[]
}

// ─── Heat Map ─────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  newsVolume: number
  aiSeverity: number
  indicatorMovement: number
  marketReaction: number
}

export interface CountryRiskScore {
  countryCode: string // ISO alpha-2
  countryName: string
  riskScore: number // 0–100
  riskLevel: RiskLevel
  scoreBreakdown: ScoreBreakdown
  themeScores: Partial<Record<MacroThemeKey, number>>
  topNews: NewsArticle[]
  activeThemes: MacroThemeKey[]
  impactedSectors: string[]
  impactedAssets: string[]
  spilloverFrom?: string[]
  spilloverTo?: string[]
}

// ─── Spillover Matrix ─────────────────────────────────────────────────────────

export type ImpactDirection = 'up' | 'down' | 'volatile' | 'neutral'

export interface SpilloverCell {
  direction: ImpactDirection
  magnitude: 'strong' | 'moderate' | 'weak'
  reasoning: string
}

export interface SpilloverMatrix {
  theme: MacroThemeKey
  assets: string[]
  rows: {
    label: string
    cells: SpilloverCell[]
  }[]
}

// ─── Domino Graph ─────────────────────────────────────────────────────────────

export interface DominoNode {
  id: string
  label: string
  description: string
  type: 'event' | 'theme' | 'country' | 'sector' | 'asset'
  riskLevel: RiskLevel
  position: { x: number; y: number }
}

export interface DominoEdge {
  id: string
  source: string
  target: string
  label: string
  reasoning: string
  strength: 'strong' | 'moderate' | 'weak'
  probability?: number
}

export interface DominoChain {
  id: string
  title: string
  triggerEvent: string
  nodes: DominoNode[]
  edges: DominoEdge[]
}

// ─── Institutional Memory ─────────────────────────────────────────────────────

export interface AssetImpact {
  asset: string
  direction: 'up' | 'down' | 'volatile'
  magnitude: 'small' | 'moderate' | 'large'
  description: string
}

export interface HistoricalEpisode {
  id: string
  title: string
  date: string
  themes: MacroThemeKey[]
  countries: string[]
  summary: string
  whatHappenedNext: string[]
  similarityScore: number // 0–100 vs current
  assetImpacts: AssetImpact[]
  keyIndicatorsAtTime: Record<string, string>
}

// ─── Morning Briefing ─────────────────────────────────────────────────────────

export interface DailyBriefing {
  date: string
  regime: MacroRegime
  headline: string
  narrative: string
  topThemes: MacroThemeKey[]
  topAlerts: string[]
  keyWatchpoints: string[]
  generatedAt: string
  isAiGenerated: boolean
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: string
  type: 'theme' | 'country' | 'alert'
  refId: string
  label: string
  addedAt: string
  alertThreshold?: number
  notes?: string
}

// ─── Market Signals ───────────────────────────────────────────────────────────

export interface MarketSignal {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  sparklineData: number[]
  assetClass: AssetClass
  trend: TrendDirection
  themeRelevance?: MacroThemeKey[]
}
