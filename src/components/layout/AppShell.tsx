'use client'
import { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, HelpCircle, BookOpen, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { RegimeBanner } from './RegimeBanner'
import { WorkflowBar } from './WorkflowBar'
import { mockRegime } from '@/lib/mock/regime'
import { PAGE_HELP } from '@/lib/help-content'

interface AppShellProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const pathname = usePathname()
  const pageHelp = PAGE_HELP[pathname]

  return (
    <div className="min-h-screen bg-[#080C14] text-[#E8EDF5]">
      {/* Sidebar: fixed on desktop, slide-in overlay on mobile */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Help panel backdrop */}
      {helpOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
          onClick={() => setHelpOpen(false)}
        />
      )}

      {/* Help drawer — slides in from right */}
      {pageHelp && (
        <div className={`
          fixed right-0 top-0 h-full w-full sm:w-96 bg-[#0F1623] border-l border-[#1E2A3B] z-50
          flex flex-col shadow-2xl transition-transform duration-300
          ${helpOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2A3B] shrink-0">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#00C2FF]" />
              <span className="text-sm font-semibold text-[#E8EDF5]">How to use: {title}</span>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="text-[#4A5A6E] hover:text-[#E8EDF5] transition-colors p-1 rounded hover:bg-[#161D2E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

            {/* Description */}
            <p className="text-sm text-[#C8D5E5] leading-relaxed">{pageHelp.description}</p>

            {/* What you're looking at */}
            <div>
              <div className="text-[10px] font-bold text-[#4A5A6E] uppercase tracking-widest mb-2.5">What you&apos;re looking at</div>
              <div className="space-y-2">
                {pageHelp.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] shrink-0 mt-1.5" />
                    <span className="text-xs text-[#7A8FA6] leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key metrics */}
            {pageHelp.metrics.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-[#4A5A6E] uppercase tracking-widest mb-2.5">Key metrics</div>
                <div className="space-y-2">
                  {pageHelp.metrics.map((m, i) => (
                    <div key={i} className="bg-[#161D2E] rounded-md p-3 border-l-2 border-[#2D7DD2]">
                      <div className="text-xs font-semibold text-[#E8EDF5] mb-1">{m.name}</div>
                      <div className="text-xs text-[#7A8FA6] leading-relaxed">{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro tips */}
            <div>
              <div className="text-[10px] font-bold text-[#4A5A6E] uppercase tracking-widest mb-2.5">Pro tips</div>
              <div className="space-y-2">
                {pageHelp.tips.map((t, i) => (
                  <div key={i} className="bg-[#161D2E] rounded-md p-3 flex items-start gap-2.5 border border-[#1E2A3B]">
                    <span className="text-[#F5A623] text-xs shrink-0 mt-0.5">💡</span>
                    <span className="text-xs text-[#7A8FA6] leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer footer — link to full guide */}
          <div className="px-5 py-4 border-t border-[#1E2A3B] shrink-0">
            <Link
              href="/guide"
              onClick={() => setHelpOpen(false)}
              className="flex items-center justify-between w-full bg-[#161D2E] hover:bg-[#1E2A3B] border border-[#1E2A3B] rounded-md px-4 py-3 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#2D7DD2]" />
                <div>
                  <div className="text-xs font-semibold text-[#E8EDF5]">Full User Guide</div>
                  <div className="text-[10px] text-[#4A5A6E]">Glossary, workflows, all features</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#4A5A6E] group-hover:text-[#7A8FA6] transition-colors" />
            </Link>
          </div>
        </div>
      )}

      {/* Main area — md+ gets left offset to clear the fixed sidebar */}
      <div className="md:ml-56 flex flex-col min-h-screen">
        <RegimeBanner regime={mockRegime} />
        <Header
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMobileSidebarOpen(true)}
          hasHelp={!!pageHelp}
          onHelpClick={() => setHelpOpen(v => !v)}
        />
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          <WorkflowBar />
          {children}
        </main>
      </div>
    </div>
  )
}
