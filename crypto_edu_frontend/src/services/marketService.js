//
// Mock Market Data Service
//

/**
 * Simple deterministic PRNG (mulberry32) to create reproducible mock data.
 */
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const ASSET_BASE = [
  { symbol: 'BTC', name: 'Bitcoin', basePrice: 68000, baseCap: 1.35e12, seed: 101 },
  { symbol: 'ETH', name: 'Ethereum', basePrice: 3500, baseCap: 4.2e11, seed: 102 },
  { symbol: 'BNB', name: 'BNB', basePrice: 580, baseCap: 9.0e10, seed: 103 },
  { symbol: 'XRP', name: 'XRP', basePrice: 0.62, baseCap: 3.4e10, seed: 104 },
  { symbol: 'ADA', name: 'Cardano', basePrice: 0.45, baseCap: 1.6e10, seed: 105 },
  { symbol: 'SOL', name: 'Solana', basePrice: 155, baseCap: 7.0e10, seed: 106 },
];

const TF_CONF = {
  '24h': { volatility: 0.02, points: 30 },
  '7d': { volatility: 0.045, points: 30 },
  '30d': { volatility: 0.08, points: 30 },
};

function generateSeries({ seed, len, volatility }) {
  const rnd = mulberry32(seed);
  let v = 100;
  const series = [];
  for (let i = 0; i < len; i += 1) {
    const shock = (rnd() - 0.5) * 2 * volatility; // centered around 0
    v = v * (1 + shock);
    series.push(v);
  }
  return series;
}

function buildAssetsFor(timeframe) {
  const conf = TF_CONF[timeframe] || TF_CONF['24h'];
  return ASSET_BASE.map((a, idx) => {
    const seed = a.seed + (timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30);
    const series = generateSeries({ seed, len: conf.points, volatility: conf.volatility + idx * 0.002 });
    const first = series[0];
    const last = series[series.length - 1];
    const changePct = ((last - first) / first) * 100;

    // Derive current price from basePrice and the total change ratio
    const price = a.basePrice * (last / first);

    // Adjust market cap relative to price drift (simple proportional model)
    const marketCap = a.baseCap * (price / a.basePrice);

    return {
      symbol: a.symbol,
      name: a.name,
      price,
      changePct,
      marketCap,
      sparkline: series, // Sparkline component will normalize internally
    };
  });
}

function computeMetrics(timeframe, assets) {
  const totalCap = assets.reduce((acc, a) => acc + a.marketCap, 0) || 1;
  const btc = assets.find((a) => a.symbol === 'BTC');
  const eth = assets.find((a) => a.symbol === 'ETH');

  // Volatility mock baseline per timeframe
  const volMap = { '24h': 3.1, '7d': 6.9, '30d': 14.2 };

  // Approximate 24h volume as a fraction of total cap (mock)
  const volFrac = timeframe === '24h' ? 0.055 : timeframe === '7d' ? 0.04 : 0.028;
  const volume = totalCap * volFrac;

  return {
    btcChange: btc ? btc.changePct : 0,
    ethChange: eth ? eth.changePct : 0,
    dominance: btc ? (btc.marketCap / totalCap) * 100 : 0,
    volume, // in USD
    volatility: volMap[timeframe] ?? 5.0,
  };
}

/**
 * PUBLIC_INTERFACE
 * fetchMarketSnapshot
 * Fetch a mock market snapshot including key metrics and a list of major assets.
 * Params:
 * - timeframe?: '24h' | '7d' | '30d'
 * - strategy?: 'long' | 'short'
 * - query?: string (optional filter by symbol/name)
 * Returns: Promise<{ metrics: {btcChange:number, ethChange:number, dominance:number, volume:number, volatility:number}, assets: Array }>
 */
export async function fetchMarketSnapshot({ timeframe = '24h', strategy = 'long', query = '' } = {}) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 200));

  let assets = buildAssetsFor(timeframe);

  // Strategy-oriented ordering:
  if (strategy === 'short') {
    assets = assets.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
  } else {
    // 'long' emphasizes size
    assets = assets.sort((a, b) => b.marketCap - a.marketCap);
  }

  // Optional filter by query
  const q = String(query || '').trim().toLowerCase();
  if (q) {
    assets = assets.filter(
      (a) =>
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    );
  }

  const metrics = computeMetrics(timeframe, assets);

  return { metrics, assets };
}

/**
 * PUBLIC_INTERFACE
 * formatCurrency
 * Convenience formatter for USD values (compact when large).
 * Params:
 * - value: number
 * - opts?: { compact?: boolean }
 * Returns: string like "$1.2B"
 */
export function formatCurrency(value, opts = {}) {
  const { compact = false } = opts;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: compact ? 'compact' : 'standard',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
  } catch {
    const v = Number(value || 0);
    return `$${v.toFixed(2)}`;
  }
}

/**
 * PUBLIC_INTERFACE
 * formatPercent
 * Format a number as percentage with sign.
 */
export function formatPercent(value) {
  const v = Number(value || 0);
  const sign = v > 0 ? '+' : v < 0 ? '' : '';
  return `${sign}${v.toFixed(2)}%`;
}
