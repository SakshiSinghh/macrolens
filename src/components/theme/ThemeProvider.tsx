'use client'
// ─── MacroLens Theme Provider ─────────────────────────────────────────────────
// Manages dark/light mode with localStorage persistence.
// Sets data-theme="dark|light" on <html> so CSS overrides in globals.css apply.
// Default is LIGHT — judges and new visitors land on a clean white UI.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  // On mount: read stored preference; default is light for new visitors
  useEffect(() => {
    const stored = localStorage.getItem('ml-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    }
    // No else: 'light' is already the initial state
  }, [])

  // Whenever theme changes: update <html> attribute + persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ml-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
