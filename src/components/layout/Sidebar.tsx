'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Radar,
  Globe,
  GitFork,
  MessageSquare,
  Archive,
  FileText,
  Bookmark,
  Activity,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/themes', label: 'Theme Radar', icon: Radar },
  { href: '/heatmap', label: 'Heat Map', icon: Globe },
  { href: '/domino', label: 'Domino Graph', icon: GitFork },
  { href: '/insights', label: 'AI Insights', icon: MessageSquare },
  { href: '/memory', label: 'Inst. Memory', icon: Archive },
  { href: '/briefing', label: 'Daily Briefing', icon: FileText },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
]

// NEXT_PUBLIC_DATA_SOURCE controls the footer badge:
//   "LIVE"  → real FRED + NewsAPI keys configured
//   "DEMO"  → running on rich mock data (safe for demos, no key needed)
// Defaults to DEMO if env var is not set.
const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? 'DEMO'
const isLive = DATA_SOURCE === 'LIVE'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-[#080C14] border-r border-[#1E2A3B] flex flex-col z-40">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#1E2A3B]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#00C2FF]/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-[#00C2FF]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#E8EDF5] tracking-wide">MacroLens</span>
            <div className="text-[10px] text-[#4A5A6E] font-mono">MACRO INTELLIGENCE</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors group relative',
                active
                  ? 'bg-[#00C2FF]/10 text-[#00C2FF]'
                  : 'text-[#7A8FA6] hover:text-[#E8EDF5] hover:bg-[#161D2E]'
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00C2FF] rounded-r" />
              )}
              <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-[#00C2FF]' : 'text-[#4A5A6E] group-hover:text-[#7A8FA6]')} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer — data source indicator */}
      <div className="px-4 py-3 border-t border-[#1E2A3B]">
        <div className="text-[10px] text-[#4A5A6E] font-mono">
          <div className="flex items-center justify-between">
            <span>DATA</span>
            {isLive ? (
              /* LIVE — animated green ping */
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
                </span>
                <span className="text-[#22C55E]">LIVE</span>
              </span>
            ) : (
              /* DEMO — static amber dot */
              <span className="flex items-center gap-1.5">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5A623]" />
                <span className="text-[#F5A623]">DEMO</span>
              </span>
            )}
          </div>
          <div className="text-[#4A5A6E] mt-0.5">
            {isLive ? 'FRED · NewsAPI' : 'Rich mock data'}
          </div>
        </div>
      </div>
    </aside>
  )
}
