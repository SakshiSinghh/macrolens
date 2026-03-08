import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'MacroLens — Macro Intelligence Platform',
  description: 'AI-powered macro intelligence platform converting macroeconomic news and signals into actionable risk alerts.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#080C14] text-[#E8EDF5] antialiased`}>
        {children}
      </body>
    </html>
  )
}
