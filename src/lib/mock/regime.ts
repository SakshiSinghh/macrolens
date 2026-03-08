import { MacroRegime } from '@/types'

export const mockRegime: MacroRegime = {
  current: 'tightening',
  label: 'Late-Cycle Tightening',
  shiftingToward: 'stagflation-risk',
  shiftingLabel: 'Stagflation Risk',
  confidence: 72,
  drivers: [
    'Inflation re-accelerating above Fed target',
    'Labor market resilience limits rate cut probability',
    'Growth slowing in key economies (Germany, China)',
  ],
  lastUpdated: '2026-03-08T14:00:00Z',
}
