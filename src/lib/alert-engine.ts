// ─── MacroLens Alert Engine ───────────────────────────────────────────────────

import { RiskLevel, MacroThemeKey } from '@/types'

// ─── Alert templates per theme ────────────────────────────────────────────────

interface AlertTemplate {
  title: string
  triggerReasons: string[]
  implications: string[]
  impactedAssetClasses: string[]
  watchpoints: { shortTerm: string[]; mediumTerm: string[] }
}

const ALERT_TEMPLATES: Record<string, AlertTemplate> = {
  inflation: {
    title: 'Inflation Risk Rising',
    triggerReasons: [
      'CPI print above consensus for multiple consecutive months',
      'Core inflation remaining sticky above central bank target',
      'Services inflation proving persistent despite tighter policy',
    ],
    implications: [
      'Central bank rate cut expectations being pushed back',
      'Bond yields likely to rise further, pressuring growth equities',
      'USD strengthening, tightening EM financial conditions',
    ],
    impactedAssetClasses: ['US Treasuries', 'Tech Equities', 'EMFX', 'Gold', 'REITs'],
    watchpoints: {
      shortTerm: ['Next Fed speaker appearances', 'Bond yield direction', 'Equity market reaction'],
      mediumTerm: ['Next PCE inflation print', 'FOMC meeting and dot plot', 'Q1 earnings guidance'],
    },
  },
  'rate-hikes': {
    title: 'Fed Policy Shift',
    triggerReasons: [
      'Market pricing for rate cuts being repriced sharply lower',
      'Fed communication turning more hawkish than expected',
      'Strong labor market reducing pressure to ease',
    ],
    implications: [
      'Higher-for-longer rates to weigh on rate-sensitive sectors',
      'Dollar strength likely to continue, pressuring EM',
      'Refinancing costs rising for leveraged borrowers',
    ],
    impactedAssetClasses: ['US Bonds', 'Rate-Sensitive Equities', 'EMFX', 'EM Bonds'],
    watchpoints: {
      shortTerm: ['FOMC minutes release', 'Fed speaker calendar', 'Rate futures positioning'],
      mediumTerm: ['FOMC dot plot update', 'CPI trajectory', 'Labor market data'],
    },
  },
  'china-property': {
    title: 'China Property Stress Escalating',
    triggerReasons: [
      'Major developer default on offshore bond obligations',
      'Housing sales declining sharply year-on-year',
      'Banking sector exposure to property sector rising',
    ],
    implications: [
      'Commodity demand from China likely to weaken further',
      'Commodity-linked currencies (AUD, BRL) at risk',
      'Regional EM growth concerns spreading through Asia',
    ],
    impactedAssetClasses: ['Iron Ore Futures', 'Copper', 'AUD', 'EM Equities', 'Asian Credit'],
    watchpoints: {
      shortTerm: ['PBoC stimulus announcement', 'Developer default news', 'Commodity price moves'],
      mediumTerm: ['China NPC policy announcements', 'Industrial production data', 'Iron ore price trend'],
    },
  },
  property: {
    title: 'China Property Stress Escalating',
    triggerReasons: [
      'Major developer default on offshore bond obligations',
      'Housing sales declining sharply year-on-year',
      'Banking sector exposure to property sector rising',
    ],
    implications: [
      'Commodity demand from China likely to weaken further',
      'Commodity-linked currencies (AUD, BRL) at risk',
      'Regional EM growth concerns spreading through Asia',
    ],
    impactedAssetClasses: ['Iron Ore Futures', 'Copper', 'AUD', 'EM Equities', 'Asian Credit'],
    watchpoints: {
      shortTerm: ['PBoC stimulus announcement', 'Developer default news', 'Commodity price moves'],
      mediumTerm: ['China NPC policy announcements', 'Industrial production data', 'Iron ore price trend'],
    },
  },
  energy: {
    title: 'Energy Supply Shock',
    triggerReasons: [
      'Supply curtailments pushing energy prices sharply higher',
      'Gas storage levels falling faster than seasonal norms',
      'Industrial energy costs threatening economic recovery',
    ],
    implications: [
      'Inflation may re-accelerate, limiting central bank easing',
      'Industrial competitiveness further undermined',
      'Recession risk in energy-dependent economies increasing',
    ],
    impactedAssetClasses: ['European Equities', 'EUR/USD', 'European Credit', 'TTF Gas Futures'],
    watchpoints: {
      shortTerm: ['EU energy ministers meeting', 'Gas futures price direction', 'Industrial sector commentary'],
      mediumTerm: ['Gas storage levels end of month', 'ECB meeting language', 'Q1 GDP estimates'],
    },
  },
  geopolitical: {
    title: 'Geopolitical Risk Elevated',
    triggerReasons: [
      'Military conflict disrupting key trade routes',
      'Shipping rerouting causing freight rate surge',
      'Insurance premiums rising significantly for affected regions',
    ],
    implications: [
      'Supply chain disruption costs flowing through to goods prices',
      'Energy security premium elevated in affected regions',
      'Trade route diversification driving logistics inefficiencies',
    ],
    impactedAssetClasses: ['Oil Futures', 'Shipping Stocks', 'EM Bonds', 'Defense Equities'],
    watchpoints: {
      shortTerm: ['Military escalation / de-escalation signals', 'Freight rate changes', 'Insurance market response'],
      mediumTerm: ['Diplomatic negotiations', 'Alternative shipping route development', 'Energy security policy'],
    },
  },
  recession: {
    title: 'Recession Risk Signal',
    triggerReasons: [
      'GDP contracting for consecutive quarters in major economy',
      'PMI composite below 50 for extended period',
      'Credit demand from businesses at multi-year lows',
    ],
    implications: [
      'Central bank under pressure to ease faster',
      'Equities likely to underperform as earnings expectations cut',
      'Credit spread widening on default risk concerns',
    ],
    impactedAssetClasses: ['European Equities', 'EUR/USD', 'European Credit', 'Bunds'],
    watchpoints: {
      shortTerm: ['Central bank meeting and language', 'Flash PMI readings', 'Business sentiment surveys'],
      mediumTerm: ['Q1 GDP estimates', 'Fiscal policy response', 'Credit market conditions'],
    },
  },
  currency: {
    title: 'EM Currency Contagion Risk',
    triggerReasons: [
      'Dollar strengthening on rate differential widening',
      'EM currencies falling broadly against USD',
      'Dollar-denominated debt servicing costs rising sharply',
    ],
    implications: [
      'EM central banks may be forced to hike rates to defend currencies',
      'Capital outflows from EM likely to accelerate',
      'Import inflation adding to domestic price pressure in EM',
    ],
    impactedAssetClasses: ['EMFX', 'EM Bonds', 'EM Equities', 'Gold'],
    watchpoints: {
      shortTerm: ['EM central bank intervention signals', 'Dollar index direction', 'Capital flow data'],
      mediumTerm: ['Fed policy path', 'EM current account data', 'EM sovereign debt rollover schedule'],
    },
  },
  'supply-chain': {
    title: 'Supply Chain Disruption Alert',
    triggerReasons: [
      'Shipping route disruption causing freight rate surge',
      'Port congestion creating delivery delays',
      'Inventory drawdown risk for just-in-time manufacturers',
    ],
    implications: [
      'Goods price inflation may re-emerge with 3-6 month lag',
      'Manufacturing sectors facing margin pressure from logistics costs',
      'Trade flows being rerouted, adding to global inefficiency',
    ],
    impactedAssetClasses: ['Shipping Stocks', 'Manufacturing Equities', 'Bonds'],
    watchpoints: {
      shortTerm: ['Freight rate index', 'Port congestion data', 'Manufacturer commentary'],
      mediumTerm: ['Trade volume data', 'Goods price inflation', 'Inventory rebuild timeline'],
    },
  },
}

// Severity thresholds
const SEVERITY_THRESHOLDS = {
  high: 85,
  elevated: 70,
  moderate: 55,
}

function momentumToSeverity(momentum: number): RiskLevel {
  if (momentum >= SEVERITY_THRESHOLDS.high) return 'high'
  if (momentum >= SEVERITY_THRESHOLDS.elevated) return 'elevated'
  if (momentum >= SEVERITY_THRESHOLDS.moderate) return 'moderate'
  return 'low'
}

// Asset class defaults per country
const COUNTRY_ASSET_MAP: Record<string, string[]> = {
  US: ['US Equities', 'US Treasuries', 'USD'],
  CN: ['CSI 300', 'CNY', 'Iron Ore', 'Copper'],
  DE: ['DAX', 'EUR/USD', 'German Bunds'],
  JP: ['Nikkei', 'JPY', 'JGBs'],
  GB: ['FTSE 100', 'GBP/USD', 'UK Gilts'],
  TR: ['TRY', 'Turkish Bonds', 'Turkish Equities'],
  BR: ['BRL', 'Bovespa', 'Brazilian Bonds'],
  AU: ['AUD', 'ASX 200', 'Iron Ore'],
  FR: ['CAC 40', 'EUR/USD'],
  IT: ['MIB', 'BTPs', 'EUR/USD'],
  ZA: ['ZAR', 'JSE', 'SA Bonds'],
  MX: ['MXN', 'IPC Index'],
  KR: ['KOSPI', 'KRW'],
  IN: ['Nifty 50', 'INR'],
  CA: ['CAD', 'TSX', 'Oil'],
  RU: ['RUB', 'Brent Crude'],
}

/**
 * Generate alerts from theme + country risk scores.
 */
export function generateAlerts(params: {
  themes: Array<{ themeKey: string; momentumScore: number; affectedCountries: string[] }>
  countryScores: Record<string, number>
  indicators: Record<string, number>
}): Array<{
  id: string
  title: string
  severity: RiskLevel
  confidenceScore: number
  triggerReasons: string[]
  implications: string[]
  watchpoints: { shortTerm: string[]; mediumTerm: string[] }
  impactedCountries: string[]
  impactedAssetClasses: string[]
}> {
  const alerts: Array<{
    id: string
    title: string
    severity: RiskLevel
    confidenceScore: number
    triggerReasons: string[]
    implications: string[]
    watchpoints: { shortTerm: string[]; mediumTerm: string[] }
    impactedCountries: string[]
    impactedAssetClasses: string[]
  }> = []

  for (const theme of params.themes) {
    // Only generate alerts for themes above momentum threshold
    if (theme.momentumScore < 65) continue

    const template = ALERT_TEMPLATES[theme.themeKey]
    if (!template) continue

    const severity = momentumToSeverity(theme.momentumScore)

    // Confidence: based on momentum score (70-95 range)
    const confidenceScore = Math.min(95, Math.round(60 + theme.momentumScore * 0.35))

    // Impacted countries: filter top countries by their risk score
    const topCountries = theme.affectedCountries
      .map((cc) => ({ cc, score: params.countryScores[cc] ?? 40 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((c) => c.cc)

    // Impacted asset classes: combine template defaults + country-specific assets
    const assetSet = new Set<string>([...template.impactedAssetClasses])
    for (const cc of topCountries.slice(0, 3)) {
      const countryAssets = COUNTRY_ASSET_MAP[cc] ?? []
      countryAssets.forEach((a) => assetSet.add(a))
    }

    alerts.push({
      id: `alert-gen-${theme.themeKey}-${Date.now()}`,
      title: template.title,
      severity,
      confidenceScore,
      triggerReasons: template.triggerReasons,
      implications: template.implications,
      watchpoints: template.watchpoints,
      impactedCountries: topCountries,
      impactedAssetClasses: Array.from(assetSet).slice(0, 6),
    })
  }

  return alerts
}

/**
 * Determine if an alert should be triggered based on score threshold.
 * Returns true if score>60 OR (score>45 AND score-previousScore>10)
 */
export function shouldTriggerAlert(score: number, previousScore: number): boolean {
  if (score > 60) return true
  if (score > 45 && score - previousScore > 10) return true
  return false
}

// Severity weight map for ranking
const SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 5,
  high: 4,
  elevated: 3,
  moderate: 2,
  low: 1,
}

/**
 * Rank alerts by severity weight (critical=5, high=4, elevated=3, moderate=2, low=1)
 * then by confidenceScore descending.
 */
export function rankAlerts<T extends { severity: string; confidenceScore: number }>(alerts: T[]): T[] {
  return [...alerts].sort((a, b) => {
    const severityDiff =
      (SEVERITY_WEIGHTS[b.severity] ?? 0) - (SEVERITY_WEIGHTS[a.severity] ?? 0)
    if (severityDiff !== 0) return severityDiff
    return b.confidenceScore - a.confidenceScore
  })
}
