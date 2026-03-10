export interface PageHelp {
  description: string
  bullets: string[]
  metrics: { name: string; desc: string }[]
  tips: string[]
}

export const PAGE_HELP: Record<string, PageHelp> = {
  '/': {
    description: 'Your daily command center. The Dashboard gives you a full-spectrum view of the macro environment in one screen — regime, live alerts, top themes, and market signals.',
    bullets: [
      'Regime Indicator — tells you the current macro cycle phase (e.g. Late-Cycle Tightening). Start here every session.',
      'Stat row — instant pulse on how many themes are active, how many alerts have fired, and overall AI confidence.',
      'Alerts panel — high-confidence signals the model has detected. Above 85% confidence means act, not watch.',
      'Themes panel — top macro themes ranked by momentum. Rising Fast means the theme is accelerating now.',
    ],
    metrics: [
      { name: 'Momentum Score', desc: '0–100. Above 75 = Rising Fast. Below 40 = fading. This is how fast a theme is accelerating, not just its size.' },
      { name: 'Confidence Score', desc: '0–100%. The AI\'s conviction that an alert is valid based on news volume, indicator movement, and market reaction.' },
      { name: 'Regime', desc: 'The macro cycle phase. Determines which themes and assets are likely to outperform or underperform.' },
    ],
    tips: [
      'If two or more alerts are above 85% confidence simultaneously, that\'s a high-conviction regime signal — check the Domino Graph next.',
      'Momentum scores above 75 on multiple themes in the same cycle phase often precede significant market moves.',
    ],
  },

  '/themes': {
    description: 'Theme Radar tracks all active macro themes by momentum score and trend direction. Drill into any theme to see its drivers, sparkline trajectory, and cross-asset impact.',
    bullets: [
      'Theme list — sorted by momentum. Click any theme to load its detail panel on the right.',
      'Sparkline — shows momentum trajectory over recent weeks. A rising sparkline + high score = accelerating risk.',
      'Cross-Asset Spillover Matrix — shows how this theme affects each asset class (equities, bonds, FX, commodities).',
      'Stats row in detail — Momentum, Regime Relevance, News Volume, and Market Reaction all in one view.',
    ],
    metrics: [
      { name: 'Trend Direction', desc: 'Rising Fast / Rising / Stable / Fading. Based on rate of change in momentum, not absolute level.' },
      { name: 'Regime Relevance', desc: 'How closely aligned this theme is with the current macro regime. High relevance = it\'s the dominant driver.' },
      { name: 'News Volume', desc: 'Article velocity over the past 72 hours. Sudden spikes precede price moves by 12–48 hours historically.' },
    ],
    tips: [
      'Look for themes where Momentum is high AND Regime Relevance is high — these are the themes driving current market behaviour.',
      'The Spillover Matrix ↓↓ cells are your trade ideas — Strong negative impact on an asset class is a positioning signal.',
    ],
  },

  '/heatmap': {
    description: 'Heat Map shows country-level risk scores across 16 monitored economies. Click any country for a breakdown of what\'s driving its risk score and how it\'s connected to other countries.',
    bullets: [
      'Map colours — green (low risk) through red (high/critical). Darker red = higher urgency.',
      'Country detail panel — risk score breakdown by news volume, AI severity, indicator movement, and market reaction.',
      'Theme filter — toggle between macro themes (Inflation, Rate Hikes, Property Stress, etc.) to see country exposure by theme.',
      'Spillover Matrix — shows cross-country risk transmission at the bottom of the detail panel.',
    ],
    metrics: [
      { name: 'Risk Score', desc: '0–100. Composite of news volume, AI severity, indicator movement, and market reaction. Above 75 = High.' },
      { name: 'Risk Level', desc: 'Low / Moderate / Elevated / High / Critical. Maps to colour coding on the map.' },
      { name: 'Contagion', desc: 'When one country\'s risk score transmits to another via trade, currency, or capital flow channels.' },
    ],
    tips: [
      'Switch theme filters to see which countries are most exposed to a specific macro theme — e.g. toggle to Property Stress to find China contagion channels.',
      'Countries with high scores on multiple theme filters simultaneously are systemic risk nodes — worth a Watchlist pin.',
    ],
  },

  '/domino': {
    description: 'Domino Graph visualises causal chains — how one macro event triggers the next. Each node is an event; each edge is a causal link with a probability score.',
    bullets: [
      'Click any node to see its description, trigger probability, and what it causes downstream.',
      'Chain selector — switch between different macro scenarios (e.g. Inflation Chain vs. Property Stress Chain).',
      'Edge labels — probabilities on each link. A 90% edge means that causal step is nearly certain given the upstream trigger.',
      'The final nodes in a chain are the investable outcomes — asset class moves or policy responses.',
    ],
    metrics: [
      { name: 'Trigger Probability', desc: 'Likelihood that this node fires given that the upstream node has fired. Compound the probabilities to get end-to-end chain probability.' },
      { name: 'Chain Confidence', desc: 'Overall confidence in the complete causal chain. Based on historical episode similarity and current data alignment.' },
    ],
    tips: [
      'Multiply probabilities along the chain to get the end-to-end scenario probability. E.g. 85% × 80% × 75% = ~51% for a 3-step chain.',
      'Use the Domino Graph before AI Insights — it gives you the causal structure to ask better questions.',
    ],
  },

  '/memory': {
    description: 'Institutional Memory compares the current macro environment to historical episodes. Similarity scores tell you how closely today resembles a past event — and what happened next.',
    bullets: [
      'Episode cards — curated historical macro events with dates, context, and outcome summaries.',
      'Similarity score — 0–100% match between current data patterns and the historical episode.',
      'Outcome panel — what happened to key assets (equities, bonds, FX) in the 3, 6, and 12 months after each episode.',
      'Use this as a base-rate anchor — it doesn\'t predict the future, but it shows you the historical distribution of outcomes.',
    ],
    metrics: [
      { name: 'Similarity Score', desc: 'How closely current indicators (CPI, yields, DXY, spreads) match the historical episode\'s signature. Above 80% = strong analogue.' },
      { name: 'Outcome Horizon', desc: 'Historical asset returns measured at 3m, 6m, and 12m after the episode peak. Provides a distribution of outcomes, not a point forecast.' },
    ],
    tips: [
      'Focus on episodes with 80%+ similarity AND a similar regime phase — the combination is a much stronger base rate than similarity alone.',
      'Use the worst historical outcome as your risk scenario for position sizing, not the average outcome.',
    ],
  },

  '/insights': {
    description: 'AI Insights is a chat interface grounded entirely in MacroLens data — themes, alerts, regime, and historical episodes. Ask freeform questions or use suggestion chips.',
    bullets: [
      'Suggestion groups — pre-built questions organised by intent (Urgent, Contagion, Markets, History). Start here if you\'re not sure what to ask.',
      'Freeform questions — type any macro question. The model answers using live platform data, not generic training data.',
      'Responses are structured — regime context, active themes, alert levels, and next steps in every answer.',
      'Grounding notice — tells you exactly how many themes, alerts, and countries the response is based on.',
    ],
    metrics: [
      { name: 'Grounding', desc: 'Every response references actual MacroLens data (theme momentum scores, alert confidence, country risk scores) — not hallucinated information.' },
    ],
    tips: [
      'Ask "What would X mean for Y?" — e.g. "What would a China property collapse mean for copper?" gives you a full causal impact analysis.',
      'Use the History chip to compare current conditions to 2022 — it\'s the most useful base-rate anchor in the platform.',
      'After the Domino Graph, come here to ask about the final nodes in the chain — e.g. "How does tech stock weakness affect portfolio duration?"',
    ],
  },

  '/briefing': {
    description: 'Daily Briefing generates a structured macro summary in one click — covering regime, top alerts, active themes, and country risks. Designed to be shared with your team.',
    bullets: [
      'Click "Generate Briefing" to compile everything MacroLens knows into a single structured document.',
      'Sections cover: Regime, Priority Alerts, Top Themes, Country Risks, and AI Narrative.',
      'The briefing is timestamped and reflects the current data snapshot — regenerate daily for a fresh view.',
      'Use it before team calls, client meetings, or to share a concise macro view without the full platform.',
    ],
    metrics: [
      { name: 'Briefing Freshness', desc: 'Briefings reflect data at time of generation. Regenerate at market open for the most current view.' },
    ],
    tips: [
      'Generate your briefing first thing in the morning before markets open — use it to set your team\'s agenda.',
      'The AI Narrative section in the briefing is the most shareable part — plain-English macro summary with no jargon.',
    ],
  },

  '/watchlist': {
    description: 'Watchlist lets you pin specific themes, countries, and alerts with custom alert thresholds and personal notes. Your personal monitoring layer on top of the platform.',
    bullets: [
      'Pin any theme, country, or alert using the Quick Add panels on the right.',
      'Set a custom threshold — you\'ll see a "THRESHOLD BREACHED" badge when a score crosses your level.',
      'Click any note to edit it inline — use notes to record why you\'re watching something and what the trigger condition is.',
      'Add items manually with the "Add Item" button — useful for tracking things not yet in the platform.',
    ],
    metrics: [
      { name: 'Alert Threshold', desc: 'Your personal trigger level for a watched item. When the score exceeds this, the badge fires. Set it just above your concern level.' },
    ],
    tips: [
      'Set thresholds 5–10 points below where you\'d actually act — gives you warning time to analyse before a move.',
      'Use notes to record your view at the time of adding: "Added because CPI beat 3 months running — watching for 4th."',
    ],
  },
}
