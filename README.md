# MacroLens — AI-Powered Macro Intelligence Platform

> **Live Demo:** https://macrolens-k2pr29hqz-sakshis-projects-38aa5c82.vercel.app/

MacroLens converts macroeconomic news, economic indicators, and market signals into actionable risk alerts, theme tracking, and domino effect visualizations — purpose-built for asset managers and macro analysts.

---

## Features

| Page | Description |
|---|---|
| **Dashboard** | Real-time alerts, top themes, market snapshot, news feed with signal scores |
| **Theme Radar** | Detected macro themes with momentum, lifecycle timeline, and source articles |
| **Global Heat Map** | Interactive world map — country risk by theme, cross-asset spillover matrix |
| **Domino Graph** | Event cascade visualization — how one shock propagates across assets and countries |
| **AI Insights** | Chat interface grounded in platform data, not generic LLM answers |
| **Institutional Memory** | Historical episode comparison — what happened in similar past situations |
| **Morning Briefing** | Analyst-ready daily narrative, one-click copy/export |
| **Watchlist** | Pinned themes/countries with custom alert thresholds and analyst notes |

---

## Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy env file
cp .env.example .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

See `.env.example` for all variables. For Phase 1 (mock data only), no API keys are needed.

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | Lock to mock data (safe for demos) | Phase 1 |
| `OPENAI_API_KEY` | AI Insights + Morning Briefing | Phase 2 |
| `NEWS_API_KEY` | Live news ingestion | Phase 3 |
| `FRED_API_KEY` | Macro indicators (CPI, yields, etc.) | Phase 3 |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Inter / JetBrains Mono fonts
- **Charts:** Recharts (sparklines, momentum charts)
- **World Map:** react-simple-maps
- **Graph:** React Flow (@xyflow/react)
- **Icons:** Lucide React

---

## Architecture

```
src/
├── app/              # Next.js App Router pages + API routes
├── components/       # Reusable UI components
│   ├── layout/       # Sidebar, Header, RegimeBanner, AppShell
│   ├── dashboard/    # Dashboard-specific components
│   ├── heatmap/      # WorldMap, SpilloverMatrix
│   ├── domino/       # DominoGraph (React Flow)
│   └── ui/           # Badge, Card, Sparkline, RiskMeter, SignalScore
├── lib/
│   ├── mock/         # Realistic mock data (Phase 1 fallback)
│   └── utils.ts      # Shared utilities
└── types/            # All TypeScript interfaces
```

---

## Phases

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Complete | Full UI with mock data, deployed to Vercel |
| Phase 2 | Planned | Backend routes, scoring logic, alert generation |
| Phase 3 | Planned | FRED + NewsAPI integrations |
| Phase 4 | Planned | Polish, animations, demo hardening |
