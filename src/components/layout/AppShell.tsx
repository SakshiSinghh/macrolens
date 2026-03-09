'use client'
import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { RegimeBanner } from './RegimeBanner'
import { WorkflowBar } from './WorkflowBar'
import { mockRegime } from '@/lib/mock/regime'

interface AppShellProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  // Mobile sidebar toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

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

      {/* Main area — md+ gets left offset to clear the fixed sidebar */}
      <div className="md:ml-56 flex flex-col min-h-screen">
        <RegimeBanner regime={mockRegime} />
        <Header
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          <WorkflowBar />
          {children}
        </main>
      </div>
    </div>
  )
}
