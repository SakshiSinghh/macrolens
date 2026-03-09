# MacroLens

**AI-powered macro intelligence platform** — real-time regime detection, theme momentum tracking, country risk heat maps, and AI-generated morning briefings.

🌐 **Live Demo**: [macrolens-liart.vercel.app](https://macrolens-liart.vercel.app)

---

## Features

| Feature | Description |
|---------|-------------|
| **Regime Banner** | Classifies the current macro regime (tightening, easing, stagflation-risk, etc.) with confidence score and live FRED indicators |
| **Theme Radar** | Tracks 8 macro themes (inflation, rate-hikes, recession, currency, property, energy, supply-chain, geopolitical) by momentum score |
| **Country Heatmap** | Interactive world map with risk-coloured countries, spillover-contagion arrows, and drill-down detail panels |
| **Alert Feed** | Priority-ranked macro alerts with confidence arc visualisations and animated severity indicators |
| **Morning Briefing** | AI-structured daily brief with copy-to-clipboard, markdown export, and print/PDF support |
| **Historical Memory** | Browse past macro episodes; side-by-side Now vs History comparison panel |
| **Light / Dark Mode** | Toggle between themes; preference persists in `localStorage` |

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### 1. Clone & install

```bash
git clone https://github.com/SakshiSinghh/macrolens.git
cd macrolens
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Open .env.local and fill in API keys (all optional — the app works fully on rich mock data)
```

### 3. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Build for production

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_DATA_SOURCE` | No | `DEMO` or `LIVE` — controls sidebar badge (default: `DEMO`) |
| `NEXT_PUBLIC_DEMO_MODE` | No | Set `true` to lock all API routes to rich mock data (recommended for public demos) |
| `FRED_API_KEY` | No | FRED API key for live macro indicators (CPI, Fed Funds Rate, 10Y yield, unemployment, GDP) |
| `NEWS_API_KEY` | No | NewsAPI.org key for live macro headlines |
| `OPENAI_API_KEY` | No | GPT-4o-mini for AI Insights chat and Daily Briefing narratives |
| `ALPHA_VANTAGE_API_KEY` | No | Market data (equity, FX, bonds) |

> **No keys required.** The app ships with 40+ curated mock articles, realistic FRED indicator fallbacks, and a full mock heatmap — everything runs out of the box.

---

## Project Architecture

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Dashboard (regime + themes + alerts + heatmap)
│   ├── heatmap/page.tsx        # Country risk heatmap full view
│   ├── alerts/page.tsx         # Alert feed with filters
│   ├── briefing/page.tsx       # Morning briefing with export
│   ├── memory/page.tsx         # Historical episode browser + compare panel
│   ├── insights/page.tsx       # AI chat interface
│   └── api/                    # API routes (all with graceful mock fallback)
│       ├── regime/             # GET /api/regime  — macro regime classification
│       ├── themes/             # GET /api/themes  — theme momentum ranking
│       ├── alerts/             # GET /api/alerts  — alert generation & ranking
│       └── news/               # GET /api/news    — macro news articles
│
├── components/
│   ├── layout/                 # AppShell, Header, Sidebar (responsive + mobile)
│   ├── dashboard/              # RegimeBanner, ThemeCard, AlertCard
│   ├── heatmap/                # WorldMap with risk fill + spillover arrows
│   └── theme/                  # ThemeProvider (light/dark mode context)
│
├── lib/
│   ├── fred.ts                 # FRED API client + mock fallback
│   ├── newsapi.ts              # NewsAPI client + mock fallback
│   ├── scoring.ts              # Regime classification + theme momentum scoring
│   ├── alert-engine.ts         # Alert generation + ranking
│   ├── theme-engine.ts         # Theme momentum ranking
│   └── mock/                   # Curated mock data (regime, themes, alerts, heatmap, …)
│
└── types/                      # Shared TypeScript types
```

### Data Flow

```
FRED API ──────────┐
                   ├──▶ /api/regime ──▶ RegimeBanner
NewsAPI ───────────┤   /api/themes ──▶ ThemeRadar
Mock fallback ─────┤   /api/alerts ──▶ AlertFeed
                   └──▶ /api/news   ──▶ MorningBriefing
```

Every API route follows this decision chain:
1. `NEXT_PUBLIC_DEMO_MODE=true` → return rich mock data immediately
2. Attempt live API call with ISR caching (`revalidate: 3600`)
3. Fall back to mock data silently on any error

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| World Map | react-simple-maps + d3-geo |
| Flow Diagrams | @xyflow/react |
| UI Primitives | Radix UI |
| Icons | Lucide React |
| Data Sources | FRED API, NewsAPI.org, mock fallbacks |
| Deployment | Vercel |

---

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Full UI scaffold with rich mock data, deployed to Vercel |
| Phase 2 | ✅ Complete | Backend scoring engine, alert generation, API routes |
| Phase 3 | ✅ Complete | FRED + NewsAPI live integrations with graceful fallback |
| Phase 4 | ✅ Complete | Animations, responsive layout, light mode, spillover map, briefing export, demo hardening |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in the [Vercel dashboard](https://vercel.com/new)
3. Add environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_DEMO_MODE=true` — locks to mock data for a stable public demo
   - Optionally add `FRED_API_KEY` and `NEWS_API_KEY` for live data
4. Deploy — Vercel auto-detects Next.js and configures everything

---

## Contributing

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Type-check
node node_modules/typescript/bin/tsc --noEmit

# Full build
node node_modules/next/dist/bin/next build

# Push and open a PR
git push origin feature/my-feature
```

---

*Built with [Claude Code](https://claude.ai/code) · Deployed on [Vercel](https://vercel.com)*
