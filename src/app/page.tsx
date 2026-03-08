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

export default function DashboardPage() {
  const topAlerts = mockAlerts.slice(0, 3)
  const topThemes = mockThemes.slice(0, 4)
  const highImpactNews = mockSources.filter(a => a.signalLabel === 'high-impact').slice(0, 8)

  return (
    <AppShell title="Dashboard" subtitle="Global Macro Intelligence Overview">
      {/* Top stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Alerts" value="5" sub="2 high severity" color="#EF4444" />
        <StatCard label="Themes Tracked" value="8" sub="3 rising fast" color="#F97316" />
        <StatCard label="Countries at Risk" value="12" sub="elevated or above" color="#EAB308" />
        <StatCard label="Avg Risk Score" value="64" sub="↑ +8 vs yesterday" color="#00C2FF" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Alerts — left column */}
        <div className="col-span-5 space-y-3">
          <SectionTitle>Active Risk Alerts</SectionTitle>
          {topAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>

        {/* Themes — center column */}
        <div className="col-span-4 space-y-3">
          <SectionTitle>Top Macro Themes</SectionTitle>
          {topThemes.map(theme => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>

        {/* Right column */}
        <div className="col-span-3 space-y-4">
          <GlobalRiskSummary />
          <MarketSnapshot signals={mockMarketSignals.slice(0, 6)} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-4">
        <MacroDevelopments articles={highImpactNews} />
      </div>
    </AppShell>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md px-4 py-3">
      <div className="text-xs text-[#7A8FA6] font-medium uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold font-mono" style={{ color }}>{value}</div>
      <div className="text-xs text-[#4A5A6E] mt-0.5">{sub}</div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <h2 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">{children}</h2>
      <div className="flex-1 h-px bg-[#1E2A3B]" />
    </div>
  )
}
