'use client'
import { MacroThemeKey } from '@/types'

interface SpilloverMatrixProps {
  activeTheme: MacroThemeKey
}

const matrices: Partial<Record<MacroThemeKey, { assets: string[]; rows: { label: string; cells: string[] }[] }>> = {
  inflation: {
    assets: ['US Equities', 'Treasuries', 'USD', 'Gold', 'EM Bonds'],
    rows: [
      { label: 'Tech Stocks', cells: ['↓↓ Strong', '↓ Moderate', '↑ Up', '→ Neutral', '↓ Moderate'] },
      { label: 'Real Estate', cells: ['↓↓ Strong', '↓ Moderate', '→ Neutral', '→ Neutral', '↓ Moderate'] },
      { label: 'Commodities', cells: ['↑ Moderate', '↓ Moderate', '↑ Up', '↑ Up', '↓ Weak'] },
      { label: 'Financials', cells: ['→ Neutral', '↓ Moderate', '↑ Up', '→ Neutral', '↓ Moderate'] },
    ],
  },
  'rate-hikes': {
    assets: ['Growth Stocks', 'Bonds', 'USD', 'EM FX', 'REITs'],
    rows: [
      { label: 'Tech/Growth', cells: ['↓↓ Strong', '↓↓ Strong', '↑↑ Strong', '↓ Moderate', '↓↓ Strong'] },
      { label: 'Financials', cells: ['↑ Moderate', '↓ Weak', '↑ Up', '→ Neutral', '↓ Moderate'] },
      { label: 'Utilities', cells: ['↓ Moderate', '↓ Moderate', '→ Neutral', '→ Neutral', '↓ Moderate'] },
      { label: 'Commodities', cells: ['→ Neutral', '↓ Weak', '↑ Up', '↓ Moderate', '→ Neutral'] },
    ],
  },
  property: {
    assets: ['Iron Ore', 'Copper', 'AUD', 'CN Equities', 'EM Bonds'],
    rows: [
      { label: 'Materials', cells: ['↓↓ Strong', '↓↓ Strong', '↓↓ Strong', '↓ Moderate', '↓ Moderate'] },
      { label: 'Energy', cells: ['→ Neutral', '↓ Weak', '↓ Moderate', '↓ Moderate', '↓ Weak'] },
      { label: 'Financials', cells: ['→ Neutral', '→ Neutral', '↓ Moderate', '↓↓ Strong', '↓ Moderate'] },
      { label: 'Industrials', cells: ['↓↓ Strong', '↓↓ Strong', '↓ Moderate', '↓↓ Strong', '↓ Moderate'] },
    ],
  },
}

const cellColor = (cell: string) => {
  if (cell.startsWith('↓↓')) return '#EF4444'
  if (cell.startsWith('↓')) return '#F97316'
  if (cell.startsWith('↑↑')) return '#22C55E'
  if (cell.startsWith('↑')) return '#86EFAC'
  return '#7A8FA6'
}

export function SpilloverMatrix({ activeTheme }: SpilloverMatrixProps) {
  const matrix = matrices[activeTheme] ?? matrices.inflation!

  return (
    <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
      <div className="px-4 py-3 border-b border-[#1E2A3B] flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Cross-Asset Spillover Matrix</h3>
        <span className="text-xs text-[#4A5A6E]">Theme: <span className="text-[#E8EDF5] capitalize">{activeTheme.replace('-', ' ')}</span></span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1E2A3B]">
              <th className="px-4 py-2.5 text-left text-[#4A5A6E] font-medium w-36">Sector / Asset</th>
              {matrix.assets.map(a => (
                <th key={a} className="px-3 py-2.5 text-center text-[#7A8FA6] font-medium whitespace-nowrap">{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row, i) => (
              <tr key={i} className="border-b border-[#1E2A3B] hover:bg-[#161D2E] transition-colors">
                <td className="px-4 py-2.5 text-[#E8EDF5] font-medium">{row.label}</td>
                {row.cells.map((cell, j) => (
                  <td key={j} className="px-3 py-2.5 text-center font-mono" style={{ color: cellColor(cell) }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
