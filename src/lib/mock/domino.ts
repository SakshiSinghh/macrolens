import { DominoChain } from '@/types'

export const mockDominoChains: DominoChain[] = [
  {
    id: 'chain-us-inflation',
    title: 'US Inflation Cascade',
    triggerEvent: 'US CPI beats expectations — core inflation sticky at 3.2%',
    nodes: [
      { id: 'n1', label: 'US CPI Surprise', description: 'CPI +0.4% MoM vs +0.3% forecast. Third consecutive above-consensus print.', type: 'event', riskLevel: 'high', position: { x: 50, y: 200 } },
      { id: 'n2', label: 'Fed Stays Hawkish', description: 'FOMC reassesses rate cut timeline. Market prices fewer than 1 cut for 2026.', type: 'theme', riskLevel: 'high', position: { x: 280, y: 200 } },
      { id: 'n3', label: 'Bond Yields Rise', description: '10Y Treasury yield surges to 4.82%. 2Y/10Y spread compresses further.', type: 'asset', riskLevel: 'elevated', position: { x: 510, y: 100 } },
      { id: 'n4', label: 'Tech Stocks Weaken', description: 'High-duration growth equities reprice lower. NDX -2.3% on the session.', type: 'sector', riskLevel: 'elevated', position: { x: 510, y: 300 } },
      { id: 'n5', label: 'USD Strengthens', description: 'DXY pushes toward 106. Safe-haven dollar demand accelerates.', type: 'asset', riskLevel: 'elevated', position: { x: 740, y: 100 } },
      { id: 'n6', label: 'EM Under Pressure', description: 'EM currencies fall broadly. Dollar-denominated debt costs rise for EM sovereigns.', type: 'country', riskLevel: 'high', position: { x: 740, y: 300 } },
      { id: 'n7', label: 'Gold Sells Off', description: 'Rising real yields reduce gold\'s relative appeal. Spot gold -0.6%.', type: 'asset', riskLevel: 'moderate', position: { x: 970, y: 100 } },
      { id: 'n8', label: 'EM Capital Outflows', description: 'Portfolio capital exits EM equities and bonds toward US dollar assets.', type: 'country', riskLevel: 'high', position: { x: 970, y: 300 } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', label: 'triggers', reasoning: 'Above-consensus CPI reduces Fed\'s flexibility to cut rates', strength: 'strong', probability: 0.92 },
      { id: 'e2', source: 'n2', target: 'n3', label: 'pushes up', reasoning: 'Higher-for-longer rates force bond market repricing', strength: 'strong', probability: 0.88 },
      { id: 'e3', source: 'n2', target: 'n4', label: 'pressures', reasoning: 'Growth stocks are long-duration assets sensitive to discount rate', strength: 'strong', probability: 0.85 },
      { id: 'e4', source: 'n2', target: 'n5', label: 'strengthens', reasoning: 'Rate differential widens, attracting dollar inflows', strength: 'strong', probability: 0.87 },
      { id: 'e5', source: 'n5', target: 'n6', label: 'tightens', reasoning: 'Strong dollar tightens external financing conditions for EM', strength: 'moderate', probability: 0.78 },
      { id: 'e6', source: 'n3', target: 'n7', label: 'suppresses', reasoning: 'Higher real yields reduce gold\'s zero-yield appeal', strength: 'moderate', probability: 0.72 },
      { id: 'e7', source: 'n6', target: 'n8', label: 'causes', reasoning: 'Tighter conditions force capital repatriation from EM', strength: 'moderate', probability: 0.75 },
    ],
  },
  {
    id: 'chain-china-property',
    title: 'China Property Stress Cascade',
    triggerEvent: 'Evergrande-linked developer misses $2.1B bond payment',
    nodes: [
      { id: 'p1', label: 'Developer Default', description: 'Major Chinese property developer misses offshore bond payment, triggering credit event.', type: 'event', riskLevel: 'high', position: { x: 50, y: 200 } },
      { id: 'p2', label: 'Housing Sales Collapse', description: 'New home sales down 34% YoY. Buyer confidence severely impacted.', type: 'theme', riskLevel: 'high', position: { x: 280, y: 200 } },
      { id: 'p3', label: 'China Credit Stress', description: 'Banking sector NPLs rise. Property-linked credit products face mark-downs.', type: 'sector', riskLevel: 'high', position: { x: 510, y: 100 } },
      { id: 'p4', label: 'Commodity Demand Falls', description: 'Steel, cement, copper demand collapses. Industrial activity contracts further.', type: 'sector', riskLevel: 'elevated', position: { x: 510, y: 300 } },
      { id: 'p5', label: 'Iron Ore / Copper Drop', description: 'Iron ore futures fall 4%. Copper at 3-month low. Commodity exporters exposed.', type: 'asset', riskLevel: 'elevated', position: { x: 740, y: 100 } },
      { id: 'p6', label: 'AUD / BRL Weaken', description: 'Commodity currencies fall in sympathy with raw material price declines.', type: 'asset', riskLevel: 'elevated', position: { x: 740, y: 300 } },
      { id: 'p7', label: 'China Growth Slows', description: 'Property sector accounts for ~25% of Chinese GDP. Broader slowdown risk rises.', type: 'country', riskLevel: 'high', position: { x: 970, y: 200 } },
    ],
    edges: [
      { id: 'pe1', source: 'p1', target: 'p2', label: 'accelerates', reasoning: 'Default news destroys buyer confidence, accelerating sales decline', strength: 'strong', probability: 0.90 },
      { id: 'pe2', source: 'p2', target: 'p3', label: 'worsens', reasoning: 'Declining sales reduce developer cash flows, increasing banking sector NPLs', strength: 'strong', probability: 0.83 },
      { id: 'pe3', source: 'p2', target: 'p4', label: 'reduces', reasoning: 'Fewer housing starts directly reduces construction materials demand', strength: 'strong', probability: 0.89 },
      { id: 'pe4', source: 'p4', target: 'p5', label: 'depresses', reasoning: 'Lower industrial demand reduces global commodity prices', strength: 'strong', probability: 0.86 },
      { id: 'pe5', source: 'p5', target: 'p6', label: 'weakens', reasoning: 'Commodity exporters (AU, BR) face deteriorating terms of trade', strength: 'moderate', probability: 0.78 },
      { id: 'pe6', source: 'p3', target: 'p7', label: 'drags', reasoning: 'Credit tightening reduces broader investment and consumption in China', strength: 'moderate', probability: 0.80 },
      { id: 'pe7', source: 'p4', target: 'p7', label: 'worsens', reasoning: 'Industrial slowdown directly subtracts from Chinese GDP growth', strength: 'strong', probability: 0.84 },
    ],
  },
]
