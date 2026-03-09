import { AppShell } from '@/components/layout/AppShell'
import { AlertCard } from '@/components/dashboard/AlertCard'
import { ThemeCard } from '@/components/dashboard/ThemeCard'
import { MarketSnapshot } from '@/components/dashboard/MarketSnapshot'
import { GlobalRiskSummary } from '@/components/dashboard/GlobalRiskSummary'
import { MacroDevelopments } from '@/components/dashboard/MacroDevelopments'
import { mockAlerts } from '@/lib/mock/alerts'
import { mockThemes } from '@/lib/mock/themes'
import { mockMarketSignals } from '@/lib/mock/market'
import { mockSources } from '@/lib/mock/sources'
import { mockRegime } from '@/lib/mock/regime'
import Link from 'next/link'

// ─── Regime colour palette ────────────────────────────────────────────────────
const REGIME_COLORS: Record<string, { bg: string; border: string; accent: string; text: string }> = {
  'tightening':       { bg: '#FFF7ED', border: '#FED7AA', accent: '#EA580C', text: '#7C2D12' },
  'easing':           { bg: '#F0FDF4', border: '#BBF7D0', accent: '#16A34A', text: '#14532D' },
  'stagflation-risk': { bg: '#FFF1F2', border: '#FECACA', accent: '#DC2626', text: '#7F1D1D' },
  'neutral':          { bg: '#F0F9FF', border: '#BAE6FD', accent: '#0284C7', text: '#0C4A6E' },
}

export default function DashboardPage() {
  const topAlerts = mockAlerts.slice(0, 3)
  const topThemes = mockThemes.slice(0, 4)
  const topNews   = mockSources.filter(a => a.signalLabel === 'high-impact').slice(0, 5)
  const regime    = mockRegime
  const rColor    = REGIME_COLORS[regime.current] ?? REGIME_COLORS['neutral']

  return (
    <AppShell title="Dashboard" subtitle="Global Macro Intelligence Overview">

      {/* ── 1. Regime hero ──────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-4 md:p-5 mb-5 border"
        style={{ backgroundColor: rColor.bg, borderColor: rColor.border }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: rColor.accent }}>
              Current Macro Regime
            </div>
            <h2 className="text-lg md:text-xl font-bold mb-1" style={{ color: rColor.text }}>
              {regime.label}
            </h2>
            {regime.shiftingLabel && (
              <div className="text-sm font-medium mb-2 md:mb-3" style={{ color: rColor.accent }}>
                → Shifting toward: <span className="font-semibold">{regime.shiftingLabel}</span>
              </div>
            )}
            <div className="space-y-1">
              {regime.drivers.map((d, i) => (
                <div key={i} className="flex items-start gap-1.5 text-sm" style={{ color: rColor.text }}>
                  <span className="shrink-0 mt-0.5" style={{ color: rColor.accent }}>•</span>
                  <span className="opacity-80">{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl md:text-4xl font-bold font-mono" style={{ color: rColor.accent }}>
              {regime.confidence}%
            </div>
            <div className="text-xs font-semibold mb-2" style={{ color: rColor.accent }}>confidence</div>
            <div className="w-20 md:w-24 h-2 rounded-full overflow-hidden ml-auto" style={{ backgroundColor: rColor.border }}>
              <div className="h-full rounded-full" style={{ width: `${regime.confidence}%`, backgroundColor: rColor.accent }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Stat row: 2 cols on mobile, 4 on desktop ─────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Active Alerts"     value="5"  sub="2 high severity"   color="#EF4444" />
        <StatCard label="Themes Tracked"    value="8"  sub="3 🔥 HOT momentum" color="#F97316" />
        <StatCard label="Countries at Risk" value="12" sub="elevated or above"  color="#EAB308" />
        <StatCard label="Avg Risk Score"    value="64" sub="↑ +8 vs yesterday" color="#2D7DD2" />
      </div>

      {/* ── 3. Main grid: stacked on mobile, 12-col on desktop ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Alerts */}
        <div className="lg:col-span-5 space-y-3">
          <SectionTitle>Active Risk Alerts</SectionTitle>
          {topAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
          <Link href="/insights" className="block text-center text-xs text-[#2D7DD2] hover:text-[#1a5fa0] py-1 transition-colors">
            Explore all alerts in AI Insights →
          </Link>
        </div>

        {/* Themes */}
        <div className="lg:col-span-4 space-y-3">
          <SectionTitle>Top Macro Themes</SectionTitle>
          {topThemes.map(theme => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
          <Link href="/themes" className="block text-center text-xs text-[#2D7DD2] hover:text-[#1a5fa0] py-1 transition-colors">
            View all 8 themes →
          </Link>
        </div>

        {/* Right column — hidden on mobile to reduce clutter */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <GlobalRiskSummary />
          <MarketSnapshot signals={mockMarketSignals.slice(0, 6)} />
        </div>
      </div>

      {/* ── 4. Top signals ──────────────────────────────────────────────── */}
      <div className="mt-4">
        <MacroDevelopments articles={topNews} showViewAll />
      </div>
    </AppShell>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md px-3 md:px-4 py-3">
      <div className="text-[10px] md:text-xs text-[#7A8FA6] font-medium uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl md:text-2xl font-bold font-mono" style={{ color }}>{value}</div>
      <div className="text-[10px] md:text-xs text-[#4A5A6E] mt-0.5">{sub}</div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <h2 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider whitespace-nowrap">{children}</h2>
      <div className="flex-1 h-px bg-[#1E2A3B]" />
    </div>
  )
}
