export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { mockThemes } from '@/lib/mock/themes'
import { mockAlerts } from '@/lib/mock/alerts'
import { mockRegime } from '@/lib/mock/regime'
import { rankAlerts } from '@/lib/alert-engine'
import { rankThemesByMomentum } from '@/lib/theme-engine'

// ─── Mock keyword-based response logic ────────────────────────────────────────

function generateMockResponse(message: string): string {
  const msg = message.toLowerCase()

  if (msg.includes('regime') || msg.includes('cycle') || msg.includes('environment')) {
    return `The current macro regime is **${mockRegime.label}** with ${mockRegime.confidence}% confidence. The regime is shifting toward **${mockRegime.shiftingLabel}**. Key drivers include: ${mockRegime.drivers.join('; ')}.`
  }

  if (msg.includes('inflation') || msg.includes('cpi') || msg.includes('pce')) {
    const inflationTheme = mockThemes.find((t) => t.key === 'inflation')
    if (inflationTheme) {
      return `**US Inflation Resurgence** is the top macro theme with a momentum score of ${inflationTheme.momentumScore}/100 (trend: ${inflationTheme.trendDirection}). CPI came in at +3.2% YoY with core inflation remaining sticky above the Fed's 2% target. The theme is tracking ${inflationTheme.articleCount} articles with ${inflationTheme.highImpactArticleCount} classified as high-impact. Key drivers: ${inflationTheme.relatedDrivers.join(', ')}.`
    }
  }

  if (msg.includes('fed') || msg.includes('rate') || msg.includes('fomc') || msg.includes('interest')) {
    const rateTheme = mockThemes.find((t) => t.key === 'rate-hikes')
    if (rateTheme) {
      return `**Fed Rate Trajectory** is a high-momentum theme (score: ${rateTheme.momentumScore}/100). Market pricing for Fed rate cuts has been pushed back sharply — from 3 expected cuts to fewer than 1 for full-year 2026. The 10-year Treasury yield has risen to 4.82%. Affected countries: ${rateTheme.affectedCountries.join(', ')}.`
    }
  }

  if (msg.includes('china') || msg.includes('property') || msg.includes('evergrande')) {
    const chinaTheme = mockThemes.find((t) => t.key === 'property')
    if (chinaTheme) {
      return `**China Property Stress** is an elevated-risk theme (momentum: ${chinaTheme.momentumScore}/100). An Evergrande-linked developer recently missed a $2.1B offshore bond payment, and new home sales are down 34% YoY. This is creating spillover risk for commodity exporters (AU, BR, CL) through iron ore and copper demand channels.`
    }
  }

  if (msg.includes('energy') || msg.includes('gas') || msg.includes('oil') || msg.includes('opec')) {
    const energyTheme = mockThemes.find((t) => t.key === 'energy')
    if (energyTheme) {
      return `**European Energy Shock** is rising fast (momentum: ${energyTheme.momentumScore}/100). Russia has cut pipeline gas flows to Europe by a further 15%, pushing TTF natural gas futures higher. This threatens to re-accelerate Eurozone inflation and limits the ECB's ability to cut rates. Most exposed countries: ${energyTheme.affectedCountries.join(', ')}.`
    }
  }

  if (msg.includes('recession') || msg.includes('gdp') || msg.includes('germany') || msg.includes('eurozone')) {
    const recessionTheme = mockThemes.find((t) => t.key === 'recession')
    if (recessionTheme) {
      return `**Europe Recession Risk** is an emerging theme (momentum: ${recessionTheme.momentumScore}/100). Germany confirmed a technical recession with Q4 GDP -0.3% (second consecutive contraction), and the IMF cut Eurozone 2026 growth to 0.8%. The PMI composite has been below 50 for four consecutive months.`
    }
  }

  if (msg.includes('currency') || msg.includes('dollar') || msg.includes('em') || msg.includes('emerging market') || msg.includes('fx')) {
    const currencyTheme = mockThemes.find((t) => t.key === 'currency')
    if (currencyTheme) {
      return `**EM Currency Pressure** is rising (momentum: ${currencyTheme.momentumScore}/100). The DXY dollar index is approaching 106 driven by higher-for-longer US rates. The Turkish lira, South African rand, and Brazilian real are all under significant pressure. Dollar-denominated EM debt servicing costs are rising sharply. Key watchpoint: BoJ intervention threshold as JPY approaches 151.`
    }
  }

  if (msg.includes('alert') || msg.includes('risk')) {
    const topAlerts = rankAlerts(mockAlerts).slice(0, 3)
    const alertSummary = topAlerts
      .map((a) => `**${a.title}** (${a.severity}, ${a.confidenceScore}% confidence)`)
      .join('; ')
    return `Current top risk alerts: ${alertSummary}. The highest-priority alert is US Inflation Risk at high severity with 91% confidence, triggered by consecutive above-consensus CPI prints.`
  }

  if (msg.includes('theme') || msg.includes('momentum') || msg.includes('top')) {
    const rankedThemes = rankThemesByMomentum(mockThemes).slice(0, 4)
    const themeSummary = rankedThemes
      .map((t) => `${t.name} (${t.momentumScore})`)
      .join(', ')
    return `Top macro themes by momentum score: ${themeSummary}. All four leading themes are trending upward, with US Inflation Resurgence (87) at the top driven by persistent CPI beats and the Fed's hawkish stance.`
  }

  if (msg.includes('hello') || msg.includes('hi ') || msg.includes('what can you') || msg.includes('help')) {
    return `Hello! I'm **MacroLens AI**, your institutional macro intelligence assistant. I can help you analyze current macro themes, risk alerts, country exposures, regime classification, and market implications. Try asking me about: inflation, Fed policy, China property stress, European energy, EM currencies, recession risk, or current top alerts.`
  }

  // Default fallback response
  const rankedThemes = rankThemesByMomentum(mockThemes).slice(0, 3)
  return `Based on current MacroLens data, the macro environment is characterized by **${mockRegime.label}** (${mockRegime.confidence}% confidence), shifting toward ${mockRegime.shiftingLabel}. Top themes by momentum: ${rankedThemes.map((t) => `${t.name} (${t.momentumScore})`).join(', ')}. Ask me about specific themes, alerts, or country risks for more detail.`
}

// POST /api/chat
// Body: { message: string, history?: Array<{role: string, content: string}> }
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message: string = body.message ?? ''
    const history: Array<{ role: string; content: string }> = body.history ?? []

    if (!message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const openAiKey = process.env.OPENAI_API_KEY

    if (openAiKey) {
      // Build platform context for the system prompt
      const rankedThemes = rankThemesByMomentum(mockThemes).slice(0, 5)
      const topAlerts = rankAlerts(mockAlerts).slice(0, 3)

      const platformContext = `
Macro Regime: ${mockRegime.label} → shifting toward ${mockRegime.shiftingLabel} (${mockRegime.confidence}% confidence)
Regime Drivers: ${mockRegime.drivers.join('; ')}

Top Themes by Momentum:
${rankedThemes.map((t) => `- ${t.name}: momentum ${t.momentumScore}/100, trend ${t.trendDirection}, velocity ${t.velocity}pts/day, countries: ${t.affectedCountries.join(', ')}`).join('\n')}

Active Risk Alerts:
${topAlerts.map((a) => `- ${a.title}: ${a.severity} severity, ${a.confidenceScore}% confidence — ${a.triggerReasons[0]}`).join('\n')}

Key Market Signals:
- CPI: 3.2% YoY (above 3.1% consensus)
- Fed Funds Rate: 5.5% (higher-for-longer)
- 10Y UST Yield: 4.82% (+14bps)
- DXY: ~106 (multi-year high)
- Unemployment: 4.1%
- GDP Growth QoQ: 0.8%
`

      const messages = [
        {
          role: 'system',
          content: `You are MacroLens AI, an institutional macro intelligence assistant. Answer questions strictly grounded in the following real-time platform data. Be concise, specific, and use financial terminology. Always reference specific numbers, themes, or alerts from the data.

Platform data:
${platformContext}`,
        },
        // Include conversation history
        ...history.map((h) => ({
          role: h.role as 'user' | 'assistant',
          content: h.content,
        })),
        { role: 'user' as const, content: message },
      ]

      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 500,
          temperature: 0.6,
        }),
      })

      if (!aiResponse.ok) {
        throw new Error(`OpenAI API error: ${aiResponse.status}`)
      }

      const aiData = await aiResponse.json()
      const responseText: string = aiData.choices?.[0]?.message?.content ?? ''

      if (!responseText) {
        throw new Error('Empty response from OpenAI')
      }

      return NextResponse.json({
        response: responseText,
        source: 'ai' as const,
        model: 'gpt-4o-mini',
      })
    }

    // Fallback: keyword-based mock response
    const mockResponse = generateMockResponse(message)

    return NextResponse.json({
      response: mockResponse,
      source: 'mock' as const,
    })
  } catch (error) {
    console.error('[api/chat] Error processing chat message:', error)
    // Last-resort fallback
    try {
      const body = await request.json().catch(() => ({ message: '' }))
      const fallbackResponse = generateMockResponse(body.message ?? '')
      return NextResponse.json({
        response: fallbackResponse,
        source: 'mock' as const,
      })
    } catch {
      return NextResponse.json({
        response:
          'I apologize, I encountered an error processing your request. Please try again.',
        source: 'mock' as const,
      })
    }
  }
}
