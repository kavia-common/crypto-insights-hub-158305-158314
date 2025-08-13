//
// Mock Educational Content Service
//

/**
 * Sample educational resources covering topics, levels, durations, tags,
 * and strategy orientation (long-term vs short-term).
 */
const SAMPLE_RESOURCES = [
  // Long-term strategy content
  {
    id: 'lt-101',
    strategy: 'long',
    title: 'Crypto Investing Fundamentals',
    description: 'Understand blockchain basics, market cycles, and long-term allocation strategies.',
    topic: 'Fundamentals',
    level: 'Beginner',
    durationMinutes: 35,
    tags: ['basics', 'blockchain', 'portfolio'],
    format: 'Article',
    rating: 4.7,
    progress: 15,
  },
  {
    id: 'lt-102',
    strategy: 'long',
    title: 'Building a Diversified Portfolio',
    description: 'Learn diversification techniques, position sizing, and rebalancing for the long run.',
    topic: 'Portfolio Strategy',
    level: 'Intermediate',
    durationMinutes: 52,
    tags: ['allocation', 'diversification', 'risk'],
    format: 'Video',
    rating: 4.6,
    progress: 40,
  },
  {
    id: 'lt-103',
    strategy: 'long',
    title: 'On-Chain Metrics for Long-Term Investors',
    description: 'Assess network activity, holder behavior, and supply dynamics to inform long-term theses.',
    topic: 'On-Chain Analysis',
    level: 'Advanced',
    durationMinutes: 70,
    tags: ['on-chain', 'metrics', 'analytics'],
    format: 'Article',
    rating: 4.8,
    progress: 0,
  },
  {
    id: 'lt-104',
    strategy: 'long',
    title: 'Risk Management Essentials',
    description: 'Define risk budgets, set drawdown limits, and manage volatility exposure.',
    topic: 'Risk Management',
    level: 'Intermediate',
    durationMinutes: 45,
    tags: ['risk', 'drawdown', 'volatility'],
    format: 'Article',
    rating: 4.5,
    progress: 60,
  },
  {
    id: 'lt-105',
    strategy: 'long',
    title: 'Staking and Passive Yield',
    description: 'Explore staking, validator selection, and sustainable passive yield strategies.',
    topic: 'DeFi',
    level: 'Beginner',
    durationMinutes: 28,
    tags: ['staking', 'yield', 'security'],
    format: 'Video',
    rating: 4.4,
    progress: 10,
  },

  // Short-term strategy content
  {
    id: 'st-201',
    strategy: 'short',
    title: 'Intro to Technical Analysis',
    description: 'A concise primer on chart patterns, support/resistance, and momentum.',
    topic: 'Technical Analysis',
    level: 'Beginner',
    durationMinutes: 32,
    tags: ['charts', 'momentum', 'patterns'],
    format: 'Article',
    rating: 4.3,
    progress: 25,
  },
  {
    id: 'st-202',
    strategy: 'short',
    title: 'Scalping and Day Trading Setups',
    description: 'High-probability intraday setups, risk control, and trade journaling.',
    topic: 'Trading Strategy',
    level: 'Advanced',
    durationMinutes: 65,
    tags: ['scalping', 'intraday', 'risk'],
    format: 'Video',
    rating: 4.6,
    progress: 0,
  },
  {
    id: 'st-203',
    strategy: 'short',
    title: 'Indicators Deep Dive: RSI & MACD',
    description: 'Learn to combine RSI and MACD for timing entries and exits effectively.',
    topic: 'Technical Analysis',
    level: 'Intermediate',
    durationMinutes: 48,
    tags: ['indicators', 'RSI', 'MACD'],
    format: 'Article',
    rating: 4.5,
    progress: 80,
  },
  {
    id: 'st-204',
    strategy: 'short',
    title: 'Order Flow & Liquidity',
    description: 'Navigate liquidity pools, identify stop clusters, and read order book signals.',
    topic: 'Market Microstructure',
    level: 'Advanced',
    durationMinutes: 72,
    tags: ['order flow', 'liquidity', 'microstructure'],
    format: 'Article',
    rating: 4.7,
    progress: 5,
  },
  {
    id: 'st-205',
    strategy: 'short',
    title: 'Securing Your Trading Setup',
    description: 'Protect accounts, manage API keys, and avoid common security pitfalls.',
    topic: 'Security',
    level: 'Beginner',
    durationMinutes: 26,
    tags: ['security', 'accounts', 'best practices'],
    format: 'Video',
    rating: 4.2,
    progress: 30,
  },

  // Some crossover topics for both lists to enrich filtering
  {
    id: 'lt-106',
    strategy: 'long',
    title: 'Sector Rotation in Crypto',
    description: 'Identify emerging sectors, rotate positions, and capture multi-quarter trends.',
    topic: 'Portfolio Strategy',
    level: 'Advanced',
    durationMinutes: 62,
    tags: ['sectors', 'rotation', 'macro'],
    format: 'Article',
    rating: 4.6,
    progress: 0,
  },
  {
    id: 'st-206',
    strategy: 'short',
    title: 'News Catalysts and Volatility',
    description: 'Trade around news events, manage gaps, and set alerts for key catalysts.',
    topic: 'Trading Strategy',
    level: 'Intermediate',
    durationMinutes: 41,
    tags: ['news', 'volatility', 'alerts'],
    format: 'Article',
    rating: 4.4,
    progress: 50,
  },
];

/**
 * PUBLIC_INTERFACE
 * fetchEducationalResources
 * Fetch mock educational resources optionally scoped by strategy.
 * Params:
 * - opts?: { strategy?: 'long' | 'short' }
 * Returns: Promise<Array<Resource>>
 */
export async function fetchEducationalResources({ strategy = 'long' } = {}) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 150));
  return SAMPLE_RESOURCES.filter((r) => r.strategy === strategy);
}

/**
 * PUBLIC_INTERFACE
 * getResourceFilterOptions
 * Build filter option lists (topics, levels, tags) and duration range from resources.
 * Returns: {
 *   topics: string[],
 *   levels: string[],
 *   tags: string[],
 *   duration: { min: number, max: number }
 * }
 */
export function getResourceFilterOptions(resources = []) {
  const topics = Array.from(new Set(resources.map((r) => r.topic))).sort((a, b) => a.localeCompare(b));
  const levelOrder = ['Beginner', 'Intermediate', 'Advanced'];
  const levels = Array.from(new Set(resources.map((r) => r.level))).sort(
    (a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b)
  );
  const tagSet = new Set();
  resources.forEach((r) => (r.tags || []).forEach((t) => tagSet.add(String(t))));
  const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));

  let min = Number.POSITIVE_INFINITY;
  let max = 0;
  resources.forEach((r) => {
    const d = Number(r.durationMinutes || 0);
    if (d < min) min = d;
    if (d > max) max = d;
  });
  if (!isFinite(min)) min = 0;
  return { topics, levels, tags, duration: { min, max } };
}

/**
 * PUBLIC_INTERFACE
 * formatDuration
 * Format minutes into a user-friendly "Hh Mm" or "Mm" string.
 */
export function formatDuration(minutes = 0) {
  const m = Math.max(0, Math.round(Number(minutes) || 0));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h > 0) return `${h}h ${rem}m`;
  return `${rem}m`;
}
