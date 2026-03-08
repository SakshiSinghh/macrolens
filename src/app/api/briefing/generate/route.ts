export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockBriefing } from '@/lib/mock/briefing'
import { mockThemes } from '@/lib/mock/themes'
import { mockAlerts } from '@/lib/mock/alerts'
import { classifyRegime } from '@/lib/scoring'
import { rankThemesByMomentum } from '@/lib/theme-engine'
import { rankAlerts } from '@/lib/alert-engine'
import { DailyBriefing, MacroRegime } from '@/types'

const CURRENT_INDICATORS = {
  cpiYoY: 3.2,
  fedFundsRate: 5.5,
  yieldTenYear: 4.82,
  unemploymentRate: 4.1,
  gdpGrowthQoQ: 0.8,
}

// POST /api/briefing/generate
// Body: { date?: string }
// Generates a morning briefing narrative
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const date: string = body.date ?? new Date().toISOString().split('T')[0]

    // Compute regime and top themes/alerts
    const regimeComputed = classifyRegime(CURRENT_INDICATORS)
    const regime: MacroRegime = {
      current: regimeComputed.regime as MacroRegime['current'],
      label: regimeComputed.label,
      shiftingToward: regimeComputed.shiftingToward as MacroRegime['shiftingToward'],
      shiftingLabel: regimeComputed.shiftingLabel,
      confidence: regimeComputed.confidence,
      drivers: mockBriefing.regime.drivers,
      lastUpdated: new Date().toISOString(),
    }

    const rankedThemes = rankThemesByMomentum(mockThemes)
    const topThemes = rankedThemes.slice(0, 4)
    const topAlerts = rankAlerts(mockAlerts).slice(0, 3)

    const openAiKey = process.env.OPENAI_API_KEY

    if (openAiKey) {
      // Build platform context for GPT-4o-mini
      const context = `
Current macro regime: ${regime.label} → shifting toward ${regime.shiftingLabel} (${regime.confidence}% confidence)
Top themes: ${topThemes.map((t) => `${t.name} (momentum: ${t.momentumScore})`).join(', ')}
Active alerts: ${topAlerts.map((a) => `${a.title} (${a.severity}, ${a.confidenceScore}% confidence)`).join('; ')}
Key indicators: CPI 3.2% YoY, Fed Funds 5.5%, 10Y yield 4.82%, unemployment 4.1%
`

      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a senior macro analyst at a top asset manager. Generate a concise morning briefing (2 paragraphs, ~200 words) for institutional investors based on the following MacroLens platform data. Be specific with numbers. Use professional financial language.',
            },
            {
              role: 'user',
              content: context,
            },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      })

      if (!aiResponse.ok) {
        throw new Error(`OpenAI API error: ${aiResponse.status}`)
      }

      const aiData = await aiResponse.json()
      const narrative: string = aiData.choices?.[0]?.message?.content ?? ''

      if (!narrative) {
        throw new Error('Empty response from OpenAI')
      }

      // Extract first sentence as headline (up to first period + space)
      const headlineMatch = narrative.match(/^(.{30,120}?[.!?])\s/)
      const headline = headlineMatch
        ? headlineMatch[1]
        : narrative.slice(0, 100).trim()

      const briefing: DailyBriefing = {
        date,
        regime,
        headline,
        narrative,
        topThemes: topThemes.map((t) => t.key),
        topAlerts: topAlerts.map((a) => a.id),
        keyWatchpoints: mockBriefing.keyWatchpoints,
        generatedAt: new Date().toISOString(),
        isAiGenerated: true,
      }

      return NextResponse.json({ briefing, source: 'ai' as const })
    }

    // Fallback: return mock briefing with fresh timestamp
    const fallbackBriefing: DailyBriefing = {
      ...mockBriefing,
      date,
      regime,
      topThemes: topThemes.map((t) => t.key),
      topAlerts: topAlerts.map((a) => a.id),
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ briefing: fallbackBriefing, source: 'mock' as const })
  } catch (error) {
    console.error('[api/briefing/generate] Error generating briefing:', error)
    // Last-resort fallback
    return NextResponse.json({
      briefing: {
        ...mockBriefing,
        generatedAt: new Date().toISOString(),
      },
      source: 'mock' as const,
    })
  }
}
