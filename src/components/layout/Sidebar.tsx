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
  BookOpen,
} from 'lucide-react'

// ─── Workflow navigation ───────────────────────────────────────────────────────
// Four labeled sections guide users through the product workflow:
//   DETECT → UNDERSTAND IMPACT → COMPARE HISTORY → ACT
const NAV_SECTIONS = [
  {
    id: 'detect',
    label: 'DETECT',
    step: 1,
    items: [
      { href: '/',       label: 'Dashboard',   icon: LayoutDashboard },
      { href: '/themes', label: 'Theme Radar',  icon: Radar },
    ],
  },
  {
    id: 'understand',
    label: 'UNDERSTAND IMPACT',
    step: 2,
    items: [
      { href: '/heatmap', label: 'Heat Map',     icon: Globe },
      { href: '/domino',  label: 'Domino Graph', icon: GitFork },
    ],
  },
  {
    id: 'compare',
    label: 'COMPARE HISTORY',
    step: 3,
    items: [
      { href: '/memory',   label: 'Inst. Memory', icon: Archive },
      { href: '/insights', label: 'AI Insights',  icon: MessageSquare },
    ],
  },
  {
    id: 'act',
    label: 'ACT',
    step: 4,
    items: [
      { href: '/briefing',  label: 'Daily Briefing', icon: FileText },
      { href: '/watchlist', label: 'Watchlist',       icon: Bookmark },
    ],
  },
]

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? 'DEMO'
const isLive = DATA_SOURCE === 'LIVE'

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen w-56 bg-[#080C14] border-r border-[#1E2A3B] flex flex-col z-40',
        'transition-transform duration-250',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}
    >
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

      {/* Workflow nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.id}>
            {/* Thin divider between sections (skip before the first) */}
            {idx > 0 && (
              <div className="mx-1 my-2 border-t border-[#1E2A3B]" />
            )}

            {/* Section header: step pill + label */}
            <div className="flex items-center gap-1.5 px-2 pt-1 pb-1.5">
              <span className="w-[18px] h-[18px] rounded-full bg-[#1E2A3B] flex items-center justify-center text-[9px] font-bold text-[#4A5A6E] shrink-0">
                {section.step}
              </span>
              <span className="text-[10px] font-semibold text-[#4A5A6E] tracking-widest uppercase leading-none">
                {section.label}
              </span>
            </div>

            {/* Nav links */}
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onMobileClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors group relative',
                      active
                        ? 'bg-[#00C2FF]/10 text-[#00C2FF]'
                        : 'text-[#7A8FA6] hover:text-[#E8EDF5] hover:bg-[#161D2E]',
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00C2FF] rounded-r" />
                    )}
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0',
                        active ? 'text-[#00C2FF]' : 'text-[#4A5A6E] group-hover:text-[#7A8FA6]',
                      )}
                    />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Guide link */}
      <div className="px-2 pb-2 border-t border-[#1E2A3B] pt-2">
        <Link
          href="/guide"
          onClick={onMobileClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors group relative',
            pathname === '/guide'
              ? 'bg-[#00C2FF]/10 text-[#00C2FF]'
              : 'text-[#7A8FA6] hover:text-[#E8EDF5] hover:bg-[#161D2E]',
          )}
        >
          {pathname === '/guide' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00C2FF] rounded-r" />
          )}
          <BookOpen className={cn(
            'w-4 h-4 shrink-0',
            pathname === '/guide' ? 'text-[#00C2FF]' : 'text-[#4A5A6E] group-hover:text-[#7A8FA6]',
          )} />
          <span>User Guide</span>
        </Link>
      </div>

      {/* Footer — data source badge */}
      <div className="px-4 py-3 border-t border-[#1E2A3B]">
        <div className="text-[10px] text-[#4A5A6E] font-mono">
          <div className="flex items-center justify-between">
            <span>DATA</span>
            {isLive ? (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
                </span>
                <span className="text-[#22C55E]">LIVE</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5A623]" />
                <span className="text-[#F5A623]">DEMO</span>
              </span>
            )}
          </div>
          <div className="text-[#4A5A6E] mt-0.5">
            FRED · NewsAPI
          </div>
        </div>
      </div>
    </aside>
  )
}
