'use client'
import { useState, useEffect } from 'react'
import { Bell, RefreshCw, Clock, Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const [timeStr, setTimeStr] = useState('')
  const { theme, toggleTheme, isDark } = useTheme()

  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    }))
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="h-14 bg-[#080C14] border-b border-[#1E2A3B] flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 text-[#7A8FA6] hover:text-[#E8EDF5] rounded hover:bg-[#161D2E] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-base font-semibold text-[#E8EDF5]">{title}</h1>
          {subtitle && <p className="text-xs text-[#7A8FA6]">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#4A5A6E] font-mono">
          <Clock className="w-3 h-3" />
          <span>{timeStr}</span>
        </div>

        {/* Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 text-xs text-[#7A8FA6] hover:text-[#E8EDF5] transition-colors px-2 py-1 rounded border border-[#1E2A3B] hover:border-[#2D7DD2]/40"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Theme toggle — dark/light */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-1.5 text-[#7A8FA6] hover:text-[#E8EDF5] transition-colors rounded hover:bg-[#161D2E] border border-[#1E2A3B] hover:border-[#2D7DD2]/40"
          aria-label="Toggle theme"
        >
          {isDark
            ? <Sun  className="w-4 h-4 text-[#F5A623]" />
            : <Moon className="w-4 h-4 text-[#2D7DD2]" />
          }
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 text-[#7A8FA6] hover:text-[#E8EDF5] transition-colors rounded hover:bg-[#161D2E]">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full" />
        </button>
      </div>
    </header>
  )
}
