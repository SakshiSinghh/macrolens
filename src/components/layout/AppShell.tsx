'use client'
import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { RegimeBanner } from './RegimeBanner'
import { mockRegime } from '@/lib/mock/regime'

interface AppShellProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#080C14] text-[#E8EDF5]">
      <Sidebar />
      <div className="ml-56 flex flex-col min-h-screen">
        <RegimeBanner regime={mockRegime} />
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
