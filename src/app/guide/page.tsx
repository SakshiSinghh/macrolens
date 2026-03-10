'use client'
import { AppShell } from '@/components/layout/AppShell'
import Link from 'next/link'
import {
  LayoutDashboard, Radar, Globe, GitFork,
  Archive, MessageSquare, FileText, Bookmark,
  BookOpen, ChevronRight, Lightbulb, Target,
} from 'lucide-react'

// ─── Workflow steps ────────────────────────────────────────────────────────────
const WORKFLOW = [
  {
    step: 1, label: 'DETECT', color: '#00C2FF',
    desc: 'Identify what\'s moving in the macro environment right now.',
    pages: ['Dashboard', 'Theme Radar'],
  },
  {
    step: 2, label: 'UNDERSTAND IMPACT', color: '#2D7DD2',
    desc: 'Trace geographic spread and causal chains of the risk.',
    pages: ['Heat Map', 'Domino Graph'],
  },
  {
    step: 3, label: 'COMPARE HISTORY', color: '#7C3AED',
    desc: 'Anchor your view in historical episodes and AI analysis.',
    pages: ['Inst. Memory', 'AI Insights'],
  },
  {
    step: 4, label: 'ACT', color: '#22C55E',
    desc: 'Turn intelligence into a shareable briefing and watchlist.',
    pages: ['Daily Briefing', 'Watchlist'],
  },
]

// ─── Feature cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    href: '/',
    icon: LayoutDashboard,
    name: 'Dashboard',
    step: 'DETECT',
    stepColor: '#00C2FF',
    tagline: 'Command centre — regime, alerts, and top themes at a glance.',
    points: [
      'Regime Indicator shows current macro cycle phase',
      'Stat row: active themes, fired alerts, AI confidence',
      'Alerts panel with confidence scores up to 100%',
      'Themes panel ranked by momentum score',
    ],
    keyMetric: 'Momentum Score: 0–100. Above 75 = Rising Fast.',
  },
  {
    href: '/themes',
    icon: Radar,
    name: 'Theme Radar',
    step: 'DETECT',
    stepColor: '#00C2FF',
    tagline: 'All macro themes, ranked by momentum and trend direction.',
    points: [
      'Click any theme to load its detail panel',
      'Sparkline shows trajectory over recent weeks',
      'Cross-asset spillover matrix for trade ideas',
      'Regime Relevance score shows dominant drivers',
    ],
    keyMetric: 'Trend Direction: Rising Fast / Rising / Stable / Fading.',
  },
  {
    href: '/heatmap',
    icon: Globe,
    name: 'Heat Map',
    step: 'UNDERSTAND IMPACT',
    stepColor: '#2D7DD2',
    tagline: '16 countries, colour-coded by composite risk score.',
    points: [
      'Click any country for a full risk breakdown',
      'Toggle macro themes to see country exposure',
      'Spillover matrix shows contagion channels',
      'Red = elevated/high, green = low risk',
    ],
    keyMetric: 'Risk Score: 0–100. Above 75 = High. Composite of 4 factors.',
  },
  {
    href: '/domino',
    icon: GitFork,
    name: 'Domino Graph',
    step: 'UNDERSTAND IMPACT',
    stepColor: '#2D7DD2',
    tagline: 'Visual causal chains showing how one event triggers the next.',
    points: [
      'Click any node to see trigger probability and downstream effects',
      'Edge labels show probability of each causal step',
      'Switch chains to explore different macro scenarios',
      'Final nodes = investable outcomes',
    ],
    keyMetric: 'Compound probabilities along edges to get end-to-end scenario probability.',
  },
  {
    href: '/memory',
    icon: Archive,
    name: 'Inst. Memory',
    step: 'COMPARE HISTORY',
    stepColor: '#7C3AED',
    tagline: 'Compare today to historical macro episodes with similarity scores.',
    points: [
      'Similarity score: how closely today matches a past episode',
      'Outcome panel: asset returns 3m, 6m, 12m after episode peak',
      'Use as a base-rate anchor for scenario planning',
      'Above 80% similarity = strong historical analogue',
    ],
    keyMetric: 'Similarity Score: above 80% = act on the historical playbook.',
  },
  {
    href: '/insights',
    icon: MessageSquare,
    name: 'AI Insights',
    step: 'COMPARE HISTORY',
    stepColor: '#7C3AED',
    tagline: 'Ask macro questions grounded in live MacroLens data.',
    points: [
      'Suggestion chips organised by intent (Urgent, Contagion, Markets)',
      'Freeform questions answered with live platform data',
      'Every response references actual theme scores and alert levels',
      '"What would X mean for Y?" unlocks causal impact analysis',
    ],
    keyMetric: 'Grounded in live data — not generic AI training data.',
  },
  {
    href: '/briefing',
    icon: FileText,
    name: 'Daily Briefing',
    step: 'ACT',
    stepColor: '#22C55E',
    tagline: 'One-click daily macro summary — ready to share with your team.',
    points: [
      'Covers regime, priority alerts, themes, country risks',
      'AI narrative in plain English — no jargon',
      'Timestamped to the current data snapshot',
      'Regenerate at market open daily',
    ],
    keyMetric: 'Generate at market open. Share before team calls or client meetings.',
  },
  {
    href: '/watchlist',
    icon: Bookmark,
    name: 'Watchlist',
    step: 'ACT',
    stepColor: '#22C55E',
    tagline: 'Pin themes, countries, and alerts with custom thresholds and notes.',
    points: [
      'Quick Add panels for themes, countries, and alerts',
      'Set custom alert thresholds — badge fires when breached',
      'Inline note editing — record why you\'re watching',
      'Track anything, even items not yet in the platform',
    ],
    keyMetric: 'Set thresholds 5–10 points below your action level for advance warning.',
  },
]

// ─── Glossary ──────────────────────────────────────────────────────────────────
const GLOSSARY = [
  { term: 'Momentum Score', def: '0–100 measure of how fast a macro theme is accelerating. 75+ = Rising Fast. It measures rate of change, not absolute level.' },
  { term: 'Confidence Score', def: 'AI conviction that an alert is valid. Based on news volume, indicator movement, and market reaction. 85%+ = high conviction.' },
  { term: 'Regime', def: 'The current macro cycle phase — e.g. Late-Cycle Tightening, Stagflation Risk, Early Recovery. Determines which themes and assets are favoured.' },
  { term: 'Contagion', def: 'The spread of a macro risk from one country or asset class to another via trade, currency, or capital flow channels.' },
  { term: 'Domino Chain', def: 'A causal sequence where one macro event triggers another in a predictable order. Each link has a probability score.' },
  { term: 'Spillover Matrix', def: 'A cross-asset table showing how a macro theme (e.g. Inflation) impacts each sector/asset class — with direction (↑↓) and intensity.' },
  { term: 'Trigger Probability', def: 'The likelihood that a Domino node fires given that the upstream node has fired. Multiply along a chain for end-to-end probability.' },
  { term: 'Regime Relevance', def: 'How closely a theme aligns with the current macro cycle phase. High relevance = this theme is a dominant driver of current conditions.' },
  { term: 'News Volume', def: 'Article velocity for a theme over the past 72 hours. Sudden spikes historically precede price moves by 12–48 hours.' },
  { term: 'Risk Score', def: 'Country-level composite 0–100. Built from news volume, AI language severity, indicator movement, and market reaction. 75+ = High.' },
  { term: 'Similarity Score', def: 'How closely current macro indicators match a historical episode signature. 80%+ = strong analogue — use the historical playbook.' },
  { term: 'Alert Threshold', def: 'Your personal trigger level on a Watchlist item. A "THRESHOLD BREACHED" badge appears when the score exceeds it.' },
]

// ─── Suggested Workflows ──────────────────────────────────────────────────────
const WORKFLOWS = [
  {
    icon: Target,
    role: 'Morning Macro Check',
    color: '#00C2FF',
    steps: [
      'Dashboard → read the Regime Indicator and top 2 alerts',
      'Theme Radar → check which themes are Rising Fast',
      'Domino Graph → trace the causal chain for the top alert',
      'Daily Briefing → generate and share with your team',
    ],
    time: '~10 minutes',
  },
  {
    icon: Globe,
    role: 'EM Exposure Review',
    color: '#F97316',
    steps: [
      'Heat Map → toggle to Geopolitical theme, scan EM countries',
      'Click the highest-risk EM country → review breakdown',
      'AI Insights → "What themes are spreading from Europe to EM?"',
      'Watchlist → pin the top EM countries with custom thresholds',
    ],
    time: '~15 minutes',
  },
  {
    icon: Lightbulb,
    role: 'Trade Idea Research',
    color: '#7C3AED',
    steps: [
      'Theme Radar → find a Rising Fast theme with high Regime Relevance',
      'Check the Spillover Matrix → identify ↓↓ Strong asset class cells',
      'Domino Graph → confirm the causal chain and probability',
      'Inst. Memory → find similar historical episodes and their outcomes',
      'AI Insights → ask "How does [theme] affect [asset]?"',
    ],
    time: '~20 minutes',
  },
]

export default function GuidePage() {
  return (
    <AppShell title="User Guide" subtitle="How to get the most out of MacroLens">
      <div className="space-y-10 pb-8">

        {/* ── Hero ── */}
        <div className="bg-gradient-to-r from-[#0F1623] to-[#111C2E] border border-[#1E2A3B] rounded-lg p-6 md:p-8 flex items-start gap-5">
          <div className="w-12 h-12 rounded-lg bg-[#00C2FF]/15 border border-[#00C2FF]/20 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-[#00C2FF]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#E8EDF5] mb-2">MacroLens User Guide</h2>
            <p className="text-sm text-[#7A8FA6] leading-relaxed max-w-2xl">
              MacroLens is a macro intelligence platform built for asset managers and analysts.
              It detects macro risks, traces their causal chains, compares them to history, and helps you act — in one structured workflow.
              This guide explains every feature, every metric, and the fastest way to use them.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-[#4A5A6E]">Jump to:</span>
              {['Workflow', 'Features', 'Glossary', 'Workflows'].map(s => (
                <a key={s} href={`#${s.toLowerCase()}`}
                  className="text-xs text-[#2D7DD2] hover:text-[#00C2FF] transition-colors border border-[#1E2A3B] hover:border-[#2D7DD2]/40 px-2 py-1 rounded">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4-Step Workflow ── */}
        <section id="workflow">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-[#7A8FA6] uppercase tracking-widest">The MacroLens Workflow</h3>
            <div className="flex-1 h-px bg-[#1E2A3B]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORKFLOW.map((w, i) => (
              <div key={w.step} className="bg-[#0F1623] border border-[#1E2A3B] rounded-lg p-4 relative">
                {/* Step number */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ backgroundColor: `${w.color}20`, color: w.color, border: `1px solid ${w.color}40` }}>
                    {w.step}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: w.color }}>{w.label}</span>
                  {i < 3 && <ChevronRight className="w-3 h-3 text-[#1E2A3B] hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 z-10" />}
                </div>
                <p className="text-xs text-[#C8D5E5] mb-3 leading-relaxed">{w.desc}</p>
                <div className="space-y-1">
                  {w.pages.map(p => (
                    <div key={p} className="text-[10px] text-[#4A5A6E] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: w.color }} />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-[#7A8FA6] uppercase tracking-widest">Platform Features</h3>
            <div className="flex-1 h-px bg-[#1E2A3B]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div key={f.href} className="bg-[#0F1623] border border-[#1E2A3B] rounded-lg p-5 hover:border-[#2D7DD2]/30 transition-colors">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${f.stepColor}15`, border: `1px solid ${f.stepColor}30` }}>
                        <Icon className="w-4 h-4" style={{ color: f.stepColor }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#E8EDF5]">{f.name}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: f.stepColor }}>{f.step}</div>
                      </div>
                    </div>
                    <Link href={f.href}
                      className="text-[10px] text-[#4A5A6E] hover:text-[#00C2FF] border border-[#1E2A3B] hover:border-[#2D7DD2]/40 px-2 py-1 rounded transition-colors whitespace-nowrap">
                      Open →
                    </Link>
                  </div>

                  <p className="text-xs text-[#7A8FA6] mb-3 leading-relaxed">{f.tagline}</p>

                  {/* How to use */}
                  <div className="space-y-1.5 mb-3">
                    {f.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#7A8FA6]">
                        <span className="text-[#1E2A3B] mt-0.5 shrink-0">•</span>
                        <span className="leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key metric */}
                  <div className="bg-[#161D2E] rounded px-3 py-2 border-l-2" style={{ borderLeftColor: f.stepColor }}>
                    <span className="text-[10px] text-[#4A5A6E]">{f.keyMetric}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Glossary ── */}
        <section id="glossary">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-[#7A8FA6] uppercase tracking-widest">Glossary</h3>
            <div className="flex-1 h-px bg-[#1E2A3B]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GLOSSARY.map(g => (
              <div key={g.term} className="bg-[#0F1623] border border-[#1E2A3B] rounded-lg p-4">
                <div className="text-xs font-semibold text-[#00C2FF] mb-1.5">{g.term}</div>
                <div className="text-xs text-[#7A8FA6] leading-relaxed">{g.def}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Suggested Workflows ── */}
        <section id="workflows">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-[#7A8FA6] uppercase tracking-widest">Suggested Workflows</h3>
            <div className="flex-1 h-px bg-[#1E2A3B]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WORKFLOWS.map(w => {
              const Icon = w.icon
              return (
                <div key={w.role} className="bg-[#0F1623] border border-[#1E2A3B] rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${w.color}15`, border: `1px solid ${w.color}30` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: w.color }} />
                    </div>
                    <span className="text-sm font-semibold text-[#E8EDF5]">{w.role}</span>
                  </div>
                  <div className="text-[10px] text-[#4A5A6E] mb-3">{w.time}</div>
                  <ol className="space-y-2">
                    {w.steps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#7A8FA6]">
                        <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5"
                          style={{ backgroundColor: `${w.color}15`, color: w.color }}>
                          {i + 1}
                        </span>
                        <span className="leading-snug">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </AppShell>
  )
}
