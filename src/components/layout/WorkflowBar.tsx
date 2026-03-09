'use client'
import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

const WORKFLOW_STEPS = [
  { num: 1, label: 'DETECT',           shortLabel: 'DETECT',  desc: 'Dashboard · Themes',   href: '/',        paths: ['/', '/themes']          },
  { num: 2, label: 'UNDERSTAND IMPACT', shortLabel: 'IMPACT',  desc: 'Heat Map · Domino',    href: '/heatmap', paths: ['/heatmap', '/domino']    },
  { num: 3, label: 'COMPARE HISTORY',  shortLabel: 'HISTORY', desc: 'Memory · AI Insights', href: '/memory',  paths: ['/memory', '/insights']   },
  { num: 4, label: 'ACT',              shortLabel: 'ACT',     desc: 'Briefing · Watchlist', href: '/briefing',paths: ['/briefing', '/watchlist'] },
]

export function WorkflowBar() {
  const pathname = usePathname()

  return (
    <div className="bg-white border border-slate-200 rounded-xl mb-5 shadow-sm overflow-hidden">
      {/* Mobile: compact scrollable strip (step number + short label) */}
      <div className="flex md:hidden overflow-x-auto scrollbar-hide">
        {WORKFLOW_STEPS.map((step, i) => {
          const active = step.paths.includes(pathname)
          return (
            <Fragment key={step.num}>
              <Link
                href={step.href}
                className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap transition-all ${
                  active ? 'bg-[#1E3A5F]' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step.num}
                </div>
                <span className={`text-[11px] font-bold tracking-wide ${
                  active ? 'text-white' : 'text-slate-500'
                }`}>
                  {step.shortLabel}
                </span>
              </Link>
              {i < WORKFLOW_STEPS.length - 1 && (
                <div className="flex items-center px-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                </div>
              )}
            </Fragment>
          )
        })}
      </div>

      {/* Desktop: full bar with descriptions */}
      <div className="hidden md:flex items-center p-2">
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
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step.num}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold tracking-wide truncate ${
                    active ? 'text-white' : 'text-slate-600'
                  }`}>
                    {step.label}
                  </div>
                  <div className={`text-[10px] truncate mt-0.5 ${
                    active ? 'text-white/65' : 'text-slate-400'
                  }`}>
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
    </div>
  )
}
