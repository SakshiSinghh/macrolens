'use client'
import { AppShell } from '@/components/layout/AppShell'
import { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Bot, User } from 'lucide-react'
import { mockThemes } from '@/lib/mock/themes'
import { mockAlerts } from '@/lib/mock/alerts'

interface Message { role: 'user' | 'assistant'; content: string; timestamp: Date }

const SUGGESTIONS = [
  'How does rising inflation affect tech stocks?',
  'Why is US macro risk elevated right now?',
  'What themes are spreading from Europe to emerging markets?',
  'What would a China property collapse mean for commodities?',
  'Compare current inflation to the 2022 episode',
]

const MOCK_RESPONSES: Record<string, string> = {
  default: `**Current Regime:** Late-Cycle Tightening → shifting toward Stagflation Risk (72% confidence)

**Top active themes:**
• US Inflation Resurgence (momentum: 87, rising fast) — CPI beat expectations for the 3rd consecutive month. 10Y yields at 4.82%.
• Fed Rate Trajectory Shift (momentum: 81) — Markets pricing fewer than 1 cut for full year 2026.
• China Property Stress (momentum: 78) — Fresh developer defaults weighing on commodity demand.

**Active high-severity alerts:** US inflation risk (confidence: 91%), China property stress (confidence: 84%)

Is there a specific theme, country, or asset class you'd like to drill into?`,

  inflation_tech: `**US Inflation & Tech Stocks — MacroLens Analysis**

Current inflation data (CPI +0.4% MoM, 3.2% YoY) is impacting tech equities through multiple channels:

**1. Discount rate effect** — Higher inflation forces the Fed to maintain elevated rates. Tech/growth stocks are long-duration assets whose future cash flows are discounted at higher rates, compressing valuations. NDX is currently -2.3% on the session.

**2. Fed premium** — Markets now pricing fewer than 1 rate cut for 2026. This "higher for longer" stance removes the reflationary support that drove the 2020–2021 tech rally.

**3. Risk appetite** — Inflation uncertainty raises volatility expectations, reducing risk appetite for speculative names.

**MacroLens Domino Chain:**
CPI Surprise → Fed Stays Hawkish → Bond Yields Rise → Tech Stocks Weaken (85% probability)

**Watch:** NDX 17,500 support. A break could accelerate rotation from growth to value.`,

  risk_elevated: `**Why US Macro Risk Is Elevated — MacroLens Breakdown**

MacroLens assigns United States a risk score of **82 (High)**, driven by:

• **News Volume: 92** — CPI print + Fed commentary generated highest article velocity in 3 months (+4.2/day)
• **AI Severity: 88** — Language analysis across Reuters, FT, Bloomberg signals systemic concern
• **Indicator Movement: 78** — 10Y yield +30bps in 2 weeks; DXY pushing 106
• **Market Reaction: 70** — S&P -1.7%, Nasdaq -2.3%, HYG spreads widening

**Active alerts:**
→ US Inflation Risk (91% confidence, HIGH severity)
→ Fed Rate Repricing (84% confidence, HIGH severity)

**Historical comparison:** Current setup has 88% similarity to March 2022 — which preceded a 525bps hiking cycle and a 19% S&P drawdown.`,

  europe_em: `**European-to-EM Theme Spillover — MacroLens Tracking**

The European Energy Shock (momentum: 73, Rising Fast) is transmitting to emerging markets via three channels:

**1. Commodity channel** — Russia's 15% gas cut pushing energy prices higher. EM commodity importers (Turkey, India, South Africa) face worsening trade balances.

**2. USD channel** — Energy inflation → Fed hawkishness → stronger USD → EM currency pressure. TRY, ZAR, BRL showing stress.

**3. Capital flows** — Risk-off sentiment triggered EM capital outflows. MacroLens Domino Chain: Energy Shock → USD Strengthens → EM Under Pressure → EM Capital Outflows (75% probability).

**Countries to watch:** TR (Elevated · 72), BR (Moderate · 64), ZA (Moderate · 58)

Check the Heat Map (Geopolitical theme) for a visual breakdown.`,

  china_property: `**China Property Collapse — Commodity Impact Analysis**

China Property Stress (momentum: 78, Elevated Risk) has direct commodity exposure given China's 50%+ share of global steel/copper demand.

**Direct impacts:**
• **Iron Ore** — Largest exposure. Chinese property accounts for ~35% of steel demand. IRON futures -12% over 30 days.
• **Copper** — Property & infrastructure represent 40% of Chinese copper use. Current price: $3.82/lb (-8% 30d).
• **AUD/CAD** — Commodity currencies under pressure as China demand outlook deteriorates.

**Spillover chain (MacroLens):**
Developer Defaults → Construction Halts → Steel/Cement Demand Collapse → Iron Ore/Copper Sell-off → AUD/BRL Under Pressure

**Contagion risk:** Evergrande-linked entities missing bond payments signals systemic stress, not isolated defaults. Watch for PBoC emergency easing as a reversal signal.`,

  compare_2022: `**Current Inflation vs 2022 Episode — Institutional Memory**

MacroLens assigns **88% similarity** to the March 2022 US Inflation episode. Key comparisons:

| Indicator | 2022 Peak | Current |
|-----------|-----------|---------|
| CPI YoY | 9.1% | 3.2% |
| Fed Funds | 0.25%→5.50% | 5.50% (hold) |
| 10Y Yield | 4.25% (Oct peak) | 4.82% |
| DXY | 114.8 | 105.8 |

**Key difference:** Inflation is lower now (3.2% vs 9.1%) but the Fed has less room to cut — any re-acceleration is more dangerous at this stage of the cycle.

**What happened next in 2022:**
→ S&P fell 19.4% (worst year since 2008)
→ Nasdaq fell 33%+
→ USD strengthened 15%
→ EM currencies broadly declined

**MacroLens view:** If CPI re-accelerates to 3.5%+, expect a replay of mid-2022 dynamics — but with less Fed ammunition to arrest the downturn.`,
}

function getMockResponse(query: string): string {
  const q = query.toLowerCase()
  if ((q.includes('inflation') || q.includes('cpi')) && (q.includes('tech') || q.includes('stock'))) return MOCK_RESPONSES.inflation_tech
  if (q.includes('risk') && (q.includes('elevated') || q.includes('why') || q.includes('high'))) return MOCK_RESPONSES.risk_elevated
  if (q.includes('europe') || q.includes('emerging') || q.includes('em ') || q.includes('spread')) return MOCK_RESPONSES.europe_em
  if (q.includes('china') || q.includes('property') || q.includes('commodit')) return MOCK_RESPONSES.china_property
  if (q.includes('2022') || q.includes('compare') || q.includes('historical') || q.includes('episode')) return MOCK_RESPONSES.compare_2022
  return `**MacroLens Analysis — "${query}"**

Based on current platform data:

• **Active themes:** ${mockThemes.slice(0, 3).map(t => t.name).join(', ')}
• **Top alert:** ${mockAlerts[0].title} (${mockAlerts[0].confidenceScore}% confidence)
• **Regime:** Late-Cycle Tightening shifting toward Stagflation Risk (72% confidence)
• **Highest risk country:** United States (82, High) — driven by CPI re-acceleration

For deeper analysis, explore the **Theme Radar** for momentum trends, the **Domino Graph** for causal chains, or the **Inst. Memory** page to compare with historical episodes.`
}

// Minimal markdown: bold **text** and bullet • / →
function renderMarkdown(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-[#E8EDF5] font-semibold">{part.slice(2, -2)}</strong>
      }
      return <span key={j}>{part}</span>
    })
    return <p key={i} className={`${line === '' ? 'mt-2' : ''} leading-relaxed`}>{parts}</p>
  })
}

export default function InsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: MOCK_RESPONSES.default, timestamp: new Date() },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const sendMessage = (text?: string) => {
    const query = (text ?? input).trim()
    if (!query || thinking) return

    const userMsg: Message = { role: 'user', content: query, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    // Simulate thinking delay for realism
    setTimeout(() => {
      const response = getMockResponse(query)
      const assistantMsg: Message = { role: 'assistant', content: response, timestamp: new Date() }
      setMessages(prev => [...prev, assistantMsg])
      setThinking(false)
    }, 900)
  }

  return (
    <AppShell title="AI Insights" subtitle="Query macro intelligence grounded in platform data">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        {/* Suggestions sidebar */}
        <div className="col-span-3 space-y-2">
          <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-3">Suggested Queries</div>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={thinking}
              className="w-full text-left text-xs text-[#7A8FA6] bg-[#0F1623] border border-[#1E2A3B] rounded-md px-3 py-2.5 hover:text-[#E8EDF5] hover:border-[#2D7DD2]/40 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
          <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md p-3 mt-4">
            <div className="text-xs text-[#4A5A6E] uppercase tracking-wider mb-2">Context</div>
            <div className="space-y-1 text-xs text-[#7A8FA6]">
              <div>• {mockThemes.length} active themes</div>
              <div>• {mockAlerts.length} risk alerts</div>
              <div>• 16 countries tracked</div>
              <div>• 2 domino chains</div>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="col-span-9 flex flex-col bg-[#0F1623] border border-[#1E2A3B] rounded-md overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded shrink-0 flex items-center justify-center mt-0.5 ${msg.role === 'assistant' ? 'bg-[#00C2FF]/20' : 'bg-[#2D7DD2]/20'}`}>
                  {msg.role === 'assistant'
                    ? <Bot className="w-3.5 h-3.5 text-[#00C2FF]" />
                    : <User className="w-3.5 h-3.5 text-[#2D7DD2]" />}
                </div>
                <div className={`max-w-[80%] rounded-md px-4 py-3 text-sm ${msg.role === 'assistant' ? 'bg-[#161D2E] text-[#C8D5E5]' : 'bg-[#2D7DD2]/20 text-[#E8EDF5]'}`}>
                  {msg.role === 'assistant' ? renderMarkdown(msg.content) : <p>{msg.content}</p>}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {thinking && (
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded shrink-0 flex items-center justify-center mt-0.5 bg-[#00C2FF]/20">
                  <Bot className="w-3.5 h-3.5 text-[#00C2FF]" />
                </div>
                <div className="bg-[#161D2E] rounded-md px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#1E2A3B] p-3 flex gap-2">
            <input
              className="flex-1 bg-[#161D2E] border border-[#1E2A3B] rounded text-sm text-[#E8EDF5] px-3 py-2 placeholder:text-[#4A5A6E] focus:outline-none focus:border-[#2D7DD2]/60"
              placeholder="Ask about macro themes, alerts, or market implications..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={thinking}
            />
            <button
              onClick={() => sendMessage()}
              disabled={thinking || !input.trim()}
              className="bg-[#00C2FF] hover:bg-[#00A8E0] disabled:opacity-50 text-[#080C14] rounded px-3 py-2 transition-colors"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
