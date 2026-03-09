'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, RefreshCw, Clock, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'
import { mockAlerts } from '@/lib/mock/alerts'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

const HIGH_ALERTS = mockAlerts.filter(a => a.severity === 'high').slice(0, 4)

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const [timeStr, setTimeStr]     = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef                  = useRef<HTMLDivElement>(null)
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
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
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            title="View active alerts"
            className="relative p-1.5 text-[#7A8FA6] hover:text-[#E8EDF5] transition-colors rounded hover:bg-[#161D2E] border border-[#1E2A3B] hover:border-[#2D7DD2]/40"
          >
            <Bell className="w-4 h-4" />
            {HIGH_ALERTS.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0F1623] border border-[#1E2A3B] rounded-lg shadow-xl z-50 animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2A3B]">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span className="text-xs font-semibold text-[#E8EDF5] uppercase tracking-wider">Active Alerts</span>
                  <span className="text-[10px] bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20 px-1.5 py-0.5 rounded-full font-mono">
                    {HIGH_ALERTS.length}
                  </span>
                </div>
                <button onClick={() => setNotifOpen(false)} className="text-[#4A5A6E] hover:text-[#E8EDF5] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-[#1E2A3B] max-h-72 overflow-y-auto">
                {HIGH_ALERTS.map(alert => (
                  <div key={alert.id} className="px-4 py-3 hover:bg-[#161D2E] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#E8EDF5] leading-snug">{alert.title}</p>
                        <p className="text-[10px] text-[#7A8FA6] mt-0.5 line-clamp-2">{alert.triggerReasons[0]}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono font-bold text-[#EF4444]">{alert.confidenceScore}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] uppercase font-semibold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1.5 py-0.5 rounded">{alert.severity}</span>
                      <span className="text-[9px] text-[#4A5A6E]">confidence: {alert.confidenceScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-[#1E2A3B]">
                <a href="/insights" onClick={() => setNotifOpen(false)} className="text-xs text-[#2D7DD2] hover:text-[#00C2FF] transition-colors">
                  View all in AI Insights →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
