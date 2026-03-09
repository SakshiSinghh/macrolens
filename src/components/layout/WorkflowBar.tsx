'use client'
import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, TrendingUp, Globe, Clock, Zap } from 'lucide-react'

const WORKFLOW_STEPS = [
  {
    num: 1,
    label: 'DETECT',
    desc: 'Dashboard · Themes',
    href: '/',
    paths: ['/', '/themes'],
    icon: TrendingUp,
  },
  {
    num: 2,
    label: 'UNDERSTAND IMPACT',
    desc: 'Heat Map · Domino',
    href: '/heatmap',
    paths: ['/heatmap', '/domino'],
    icon: Globe,
  },
  {
    num: 3,
    label: 'COMPARE HISTORY',
    desc: 'Memory · AI Insights',
    href: '/memory',
    paths: ['/memory', '/insights'],
    icon: Clock,
  },
  {
    num: 4,
    label: 'ACT',
    desc: 'Briefing · Watchlist',
    href: '/briefing',
    paths: ['/briefing', '/watchlist'],
    icon: Zap,
  },
]

export function WorkflowBar() {
  const pathname = usePathname()

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2 mb-5 flex items-center shadow-sm">
      {WORKFLOW_STEPS.map((step, i) => {
        const active = step.paths.includes(pathname)
        return (
          <Fragment key={step.num}>
            <Link
              href={step.href}
              className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all min-w-0 ${
                active ? 'bg-[#1E3A5F]' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step.num}
              </div>
              <div className="min-w-0">
                <div
                  className={`text-xs font-bold tracking-wide truncate ${
                    active ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {step.label}
                </div>
                <div
                  className={`text-[10px] truncate mt-0.5 ${
                    active ? 'text-white/65' : 'text-slate-400'
                  }`}
                >
                  {step.desc}
                </div>
              </div>
            </Link>
            {i < WORKFLOW_STEPS.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mx-1" />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
