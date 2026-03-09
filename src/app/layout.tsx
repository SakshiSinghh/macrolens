import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'MacroLens — Macro Intelligence Platform',
  description: 'AI-powered macro intelligence platform converting macroeconomic news and signals into actionable risk alerts.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: ThemeProvider reads localStorage on the client
    // and updates data-theme on <html> — suppresses the inevitable server/client mismatch.
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-[#080C14] text-[#E8EDF5] antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
