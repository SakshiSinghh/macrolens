'use client'
import { AppShell } from '@/components/layout/AppShell'
import { useState } from 'react'
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
  default: `Based on current MacroLens data, here's what the platform is tracking:

**Current regime:** Late-Cycle Tightening → shifting toward Stagflation Risk (72% confidence)

**Top active themes:**
• US Inflation Resurgence (momentum: 87, rising fast) — CPI beat expectations for the 3rd consecutive month. 10Y yields at 4.82%.
• Fed Rate Trajectory Shift (momentum: 81) — Markets pricing fewer than 1 cut for full year 2026.
• China Property Stress (momentum: 78) — Fresh developer defaults weighing on commodity demand.

**Active high-severity alerts:** US inflation risk (confidence: 91%), China property stress (confidence: 84%)

Is there a specific theme, country, or asset class you'd like to drill into?`,
  inflation: `**US Inflation & Tech Stocks — MacroLens Analysis**

Current inflation data (CPI +0.4% MoM, 3.2% YoY) is directly impacting tech equities through multiple channels:

1. **Discount rate effect** — Higher inflation forces the Fed to maintain elevated rates. Tech/growth stocks are long-duration assets whose future cash flows are discounted at higher rates, compressing valuations. NDX is currently -2.3% on the session.

2. **Fed premium** — The market is now pricing fewer than 1 rate cut for 2026. This "higher for longer" stance removes the reflationary support that drove the 2020-2021 tech rally.

3. **Risk appetite** — Inflation uncertainty raises volatility expectations, reducing risk appetite for speculative tech names.

**MacroLens Domino Chain:**
CPI Surprise → Fed Stays Hawkish → Bond Yields Rise → Tech Stocks Weaken

The platform currently shows 79% probability on the Fed-to-yields link and 85% on yields-to-tech weakness.

**Watch:** S&P 5,000 support level. A break could accelerate rotation from growth to value.`,
}

export default function InsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: MOCK_RESPONSES.default,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')

  const sendMessage = (text?: string) => {
    const query = text ?? input
    if (!query.trim()) return

    const userMsg: Message = { role: 'user', content: query, timestamp: new Date() }
    const lower = query.toLowerCase()
    const response = lower.includes('inflation') && lower.includes('tech')
      ? MOCK_RESPONSES.inflation
      : `**MacroLens Analysis — "${query}"**\n\nBased on current platform data:\n\n• **Active themes:** ${mockThemes.slice(0, 3).map(t => t.name).join(', ')}\n• **Top alert:** ${mockAlerts[0].title} (${mockAlerts[0].confidenceScore}% confidence)\n• **Regime:** Late-Cycle Tightening shifting toward Stagflation Risk\n\nThe platform is tracking this in real-time. For deeper analysis, check the Theme Radar and Domino Graph pages.\n\n*Note: In Phase 2, this will query actual processed platform data via OpenAI API.*`

    const assistantMsg: Message = { role: 'assistant', content: response, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInput('')
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
              className="w-full text-left text-xs text-[#7A8FA6] bg-[#0F1623] border border-[#1E2A3B] rounded-md px-3 py-2.5 hover:text-[#E8EDF5] hover:border-[#2D7DD2]/40 transition-colors"
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
                <div className={`max-w-[80%] rounded-md px-4 py-3 text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-[#161D2E] text-[#E8EDF5]' : 'bg-[#2D7DD2]/20 text-[#E8EDF5]'}`}>
                  <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-[#1E2A3B] p-3 flex gap-2">
            <input
              className="flex-1 bg-[#161D2E] border border-[#1E2A3B] rounded text-sm text-[#E8EDF5] px-3 py-2 placeholder:text-[#4A5A6E] focus:outline-none focus:border-[#2D7DD2]/60"
              placeholder="Ask about macro themes, alerts, or market implications..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={() => sendMessage()}
              className="bg-[#00C2FF] hover:bg-[#00A8E0] text-[#080C14] rounded px-3 py-2 transition-colors"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
