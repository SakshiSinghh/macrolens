// ─── MacroLens FRED API Client ────────────────────────────────────────────────
// Fetches real macro indicators from FRED (Federal Reserve Economic Data).
// Falls back to mock data gracefully if FRED_API_KEY is not set or the API fails.

const FRED_BASE = 'https://api.stlouisfed.org/fred'

interface FredObservation {
  date: string
  value: string
}

interface FredSeriesResponse {
  observations: FredObservation[]
}

// ─── Core fetch helper ─────────────────────────────────────────────────────────

async function fredGet(
  seriesId: string,
  limit: number,
  apiKey: string
): Promise<FredObservation[]> {
  const url =
    `${FRED_BASE}/series/observations` +
    `?series_id=${seriesId}` +
    `&api_key=${apiKey}` +
    `&limit=${limit}` +
    `&sort_order=desc` +
    `&file_type=json`

  const res = await fetch(url, {
    // Next.js cache: revalidate once per hour (FRED data is not real-time)
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`FRED HTTP ${res.status} for series ${seriesId}`)

  const data: FredSeriesResponse = await res.json()

  // FRED uses '.' as a placeholder for missing values — filter those out
  return (data.observations ?? []).filter((o) => o.value !== '.')
}

// ─── Individual indicator helpers ─────────────────────────────────────────────

/** Fetch the latest value for a FRED series. Returns null if unavailable. */
async function fetchLatest(seriesId: string, apiKey: string): Promise<number | null> {
  const obs = await fredGet(seriesId, 3, apiKey) // fetch 3 in case the most recent is pending
  if (!obs.length) return null
  return parseFloat(obs[0].value)
}

/**
 * Compute year-over-year percent change for a monthly series.
 * Fetches the last 14 observations and compares obs[0] to obs[12].
 */
async function fetchYoY(seriesId: string, apiKey: string): Promise<number | null> {
  const obs = await fredGet(seriesId, 14, apiKey)
  if (obs.length < 13) return null

  const current = parseFloat(obs[0].value)
  const prevYear = parseFloat(obs[12].value)

  if (!prevYear) return null
  return ((current - prevYear) / prevYear) * 100
}

// ─── Exported types ────────────────────────────────────────────────────────────

export interface MacroIndicators {
  /** CPI year-over-year % change (e.g. 3.2) */
  cpiYoY: number
  /** Federal Funds Effective Rate, % (e.g. 5.5) */
  fedFundsRate: number
  /** 10-Year Treasury Constant Maturity Yield, % (e.g. 4.82) */
  yieldTenYear: number
  /** Civilian Unemployment Rate, % (e.g. 4.1) */
  unemploymentRate: number
  /** Real GDP growth, approximate QoQ % (e.g. 0.8) */
  gdpGrowthQoQ: number
  /** Whether the data came from the live FRED API or fallback mock */
  source: 'live' | 'mock'
  fetchedAt: string
}

// ─── Mock fallback ─────────────────────────────────────────────────────────────

/** Realistic fallback values if FRED is unavailable during the demo. */
export const MOCK_INDICATORS: MacroIndicators = {
  cpiYoY: 3.2,
  fedFundsRate: 5.5,
  yieldTenYear: 4.82,
  unemploymentRate: 4.1,
  gdpGrowthQoQ: 0.8,
  source: 'mock',
  fetchedAt: new Date().toISOString(),
}

// ─── Main export ───────────────────────────────────────────────────────────────

/**
 * Fetch all macro indicators from FRED in parallel.
 * Returns mock data if FRED_API_KEY is not configured or any fetch fails.
 *
 * FRED series used:
 *   CPIAUCSL         – Consumer Price Index, All Urban (YoY computed)
 *   FEDFUNDS         – Effective Federal Funds Rate (monthly)
 *   DGS10            – 10-Year Treasury Constant Maturity Rate (daily)
 *   UNRATE           – Civilian Unemployment Rate (monthly)
 *   A191RL1Q225SBEA  – Real GDP % Change from Preceding Period, annualized (quarterly)
 */
export async function fetchMacroIndicators(): Promise<MacroIndicators> {
  const apiKey = process.env.FRED_API_KEY

  if (!apiKey) {
    // No key configured — quietly use mock data
    return MOCK_INDICATORS
  }

  try {
    const [cpiYoY, fedFundsRate, yieldTenYear, unemploymentRate, gdpAnnualized] =
      await Promise.all([
        fetchYoY('CPIAUCSL', apiKey),
        fetchLatest('FEDFUNDS', apiKey),
        fetchLatest('DGS10', apiKey),
        fetchLatest('UNRATE', apiKey),
        fetchLatest('A191RL1Q225SBEA', apiKey), // annualized QoQ rate
      ])

    // If any core indicator is missing, fall back to mock
    if (
      cpiYoY === null ||
      fedFundsRate === null ||
      yieldTenYear === null ||
      unemploymentRate === null
    ) {
      console.warn('[FRED] One or more core indicators missing — using mock fallback')
      return MOCK_INDICATORS
    }

    return {
      cpiYoY: round(cpiYoY, 1),
      fedFundsRate: round(fedFundsRate, 2),
      yieldTenYear: round(yieldTenYear, 2),
      unemploymentRate: round(unemploymentRate, 1),
      // Annualized QoQ → approximate QoQ by dividing by 4
      gdpGrowthQoQ: gdpAnnualized !== null
        ? round(gdpAnnualized / 4, 1)
        : MOCK_INDICATORS.gdpGrowthQoQ,
      source: 'live',
      fetchedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[FRED] Error fetching macro indicators:', error)
    return MOCK_INDICATORS
  }
}

// ─── Utility ───────────────────────────────────────────────────────────────────

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Generate human-readable regime driver strings from live indicators.
 * Used to populate the regime banner ticker instead of static mock strings.
 */
export function buildRegimeDrivers(indicators: MacroIndicators): string[] {
  const drivers: string[] = []

  // CPI
  drivers.push(
    `CPI ${indicators.cpiYoY.toFixed(1)}% YoY — ${indicators.cpiYoY > 3 ? 'above' : 'near'} Fed target`
  )

  // Fed Funds
  drivers.push(`Fed Funds Rate ${indicators.fedFundsRate.toFixed(2)}%`)

  // 10Y yield
  drivers.push(`10Y Treasury yield ${indicators.yieldTenYear.toFixed(2)}%`)

  // Unemployment
  drivers.push(
    `Unemployment ${indicators.unemploymentRate.toFixed(1)}% — ${indicators.unemploymentRate < 4.5 ? 'tight labour market' : 'loosening labour market'}`
  )

  // GDP
  if (indicators.gdpGrowthQoQ > 0) {
    drivers.push(`GDP +${indicators.gdpGrowthQoQ.toFixed(1)}% QoQ — moderate expansion`)
  } else {
    drivers.push(`GDP ${indicators.gdpGrowthQoQ.toFixed(1)}% QoQ — contraction risk`)
  }

  return drivers
}
