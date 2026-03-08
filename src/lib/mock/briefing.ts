import { DailyBriefing } from '@/types'
import { mockRegime } from './regime'

export const mockBriefing: DailyBriefing = {
  date: '2026-03-08',
  regime: mockRegime,
  headline: 'Inflation Shock Dominates — Fed Cut Expectations Collapse as CPI Beats for Third Consecutive Month',
  narrative: `Markets entered a risk-off session today after US CPI printed above expectations for the third consecutive month, reinforcing the Federal Reserve\'s higher-for-longer narrative and triggering sharp repricing across rates, equities, and emerging market assets. The February CPI came in at +0.4% MoM (vs +0.3% consensus), pushing the year-on-year rate to 3.2%. Treasury yields surged — the 10-year approaching 4.82% — while the S&P 500 shed 1.7% and the Nasdaq fell 2.3% as growth stocks bore the brunt of the discount rate reset. The dollar index pushed toward 106, its strongest level since late 2023, placing broad pressure on emerging market currencies including the Turkish lira, South African rand, and Brazilian real.

Compounding the macro backdrop, China\'s property sector saw fresh stress with an Evergrande-linked developer missing a $2.1B offshore bond payment. Brent crude fell 3.2% on deteriorating China industrial demand expectations, dragging commodity currencies lower. In Europe, Russia\'s further 15% gas supply cut pushed TTF natural gas futures higher, reviving energy inflation concerns just as the ECB was beginning to signal potential easing. The convergence of US inflation persistence, China credit stress, and European energy fragility represents the highest aggregate macro risk reading MacroLens has recorded in the current cycle. Key watchpoints for the next 48 hours: Fed speaker comments, bond yield trajectory, and any PBoC policy response to China property stress.`,
  topThemes: ['inflation', 'rate-hikes', 'property', 'energy'],
  topAlerts: ['alert-001', 'alert-002', 'alert-003'],
  keyWatchpoints: [
    'Fed speaker appearances March 10–12 — watch for tone shift',
    '10Y UST yield direction — 5.00% psychological level',
    'PBoC potential stimulus announcement on China property',
    'EU energy ministers emergency meeting',
    'S&P 500 5,000 support level',
  ],
  generatedAt: '2026-03-08T15:00:00Z',
  isAiGenerated: false,
}
