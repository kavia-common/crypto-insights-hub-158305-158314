import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/shared/Card';
import Tabs from '../components/shared/Tabs';
import Sparkline from '../components/shared/Sparkline';
import { fetchMarketSnapshot, formatCurrency, formatPercent } from '../services/marketService';

/**
 * PUBLIC_INTERFACE
 * MarketDashboard
 * Market Trend Dashboard displaying:
 * - Key metrics (BTC/ETH change, BTC dominance, market volume, volatility) as cards
 * - Timeframe toggle (24h, 7d, 30d) and strategy tabs (Long-term, Short-term)
 * - Responsive list/table of major assets with sparkline trends
 * Props:
 * - searchQuery?: string
 */
export default function MarketDashboard({ searchQuery }) {
  const [timeframe, setTimeframe] = useState('24h');
  const [strategy, setStrategy] = useState('long'); // 'long' | 'short'
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [assets, setAssets] = useState([]);

  const timeframeTabs = useMemo(
    () => [
      { key: '24h', label: '24h' },
      { key: '7d', label: '7d' },
      { key: '30d', label: '30d' },
    ],
    []
  );

  const strategyTabs = useMemo(
    () => [
      { key: 'long', label: 'Long-term' },
      { key: 'short', label: 'Short-term' },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchMarketSnapshot({ timeframe, strategy, query: searchQuery })
      .then((res) => {
        if (!mounted) return;
        setMetrics(res.metrics);
        setAssets(res.assets);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [timeframe, strategy, searchQuery]);

  const filteredAssets = useMemo(() => {
    // fetchMarketSnapshot already filters by query; this is kept in case future local filtering is needed
    return assets;
  }, [assets]);

  return (
    <div>
      <h1 className="page-title">Market Dashboard</h1>

      {/* Controls */}
      <Card
        title="Market Controls"
        actions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div aria-label="Timeframe selection" title="Select timeframe">
              <Tabs tabs={timeframeTabs} activeKey={timeframe} onChange={setTimeframe} />
            </div>
            <div aria-label="Strategy selection" title="Select viewing strategy">
              <Tabs tabs={strategyTabs} activeKey={strategy} onChange={setStrategy} />
            </div>
          </div>
        }
      >
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {searchQuery
            ? `Showing ${timeframe} market data for "${searchQuery}" (${strategy === 'long' ? 'Long-term' : 'Short-term'} view)`
            : `Showing ${timeframe} market snapshot (${strategy === 'long' ? 'Long-term' : 'Short-term'} view)`}
        </div>
      </Card>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 16 }}>
        <Card title="BTC Change">
          {loading || !metrics ? (
            <MetricSkeleton />
          ) : (
            <MetricValue
              value={formatPercent(metrics.btcChange)}
              positive={metrics.btcChange >= 0}
              caption={`vs ${timeframe}`}
            />
          )}
        </Card>

        <Card title="ETH Change">
          {loading || !metrics ? (
            <MetricSkeleton />
          ) : (
            <MetricValue
              value={formatPercent(metrics.ethChange)}
              positive={metrics.ethChange >= 0}
              caption={`vs ${timeframe}`}
            />
          )}
        </Card>

        <Card title="BTC Dominance">
          {loading || !metrics ? (
            <MetricSkeleton />
          ) : (
            <MetricValue value={`${metrics.dominance.toFixed(2)}%`} positive caption="of total market cap" />
          )}
        </Card>

        <Card title="Market Volume (est.)">
          {loading || !metrics ? (
            <MetricSkeleton />
          ) : (
            <MetricValue value={formatCurrency(metrics.volume, { compact: true })} positive caption="last 24h" />
          )}
        </Card>

        <Card title="Volatility">
          {loading || !metrics ? (
            <MetricSkeleton />
          ) : (
            <MetricValue value={`${metrics.volatility.toFixed(1)}%`} positive={metrics.volatility < 10} caption={`${timeframe} realized`} />
          )}
        </Card>
      </div>

      {/* Assets Table */}
      <Card
        title="Major Assets"
        actions={
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {loading ? 'Loading...' : `${filteredAssets.length} assets`}
          </span>
        }
      >
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table
            role="table"
            aria-label="Major assets with price, change, and trend"
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              minWidth: 640,
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <Th>Asset</Th>
                <Th>Price</Th>
                <Th>Change ({timeframe})</Th>
                <Th>Trend</Th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} style={{ padding: '14px 8px', color: 'var(--text-secondary)' }}>
                    Loading market data...
                  </td>
                </tr>
              )}
              {!loading && filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '14px 8px', color: 'var(--text-secondary)' }}>
                    No assets found for the current filters.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredAssets.map((a) => {
                  const positive = a.changePct >= 0;
                  return (
                    <tr key={a.symbol} style={{ borderTop: `1px solid var(--border-color)` }}>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            aria-hidden="true"
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: 'var(--muted)',
                              border: '1px solid var(--border-color)',
                              display: 'inline-block',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {a.name}{' '}
                              <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>· {a.symbol}</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Market Cap: {formatCurrency(a.marketCap, { compact: true })}</div>
                          </div>
                        </div>
                      </Td>
                      <Td style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(a.price)}</Td>
                      <Td style={{ fontVariantNumeric: 'tabular-nums', color: positive ? 'var(--color-secondary)' : 'var(--color-accent)', fontWeight: 600 }}>
                        {formatPercent(a.changePct)}
                      </Td>
                      <Td>
                        <Sparkline
                          data={a.sparkline}
                          width={140}
                          height={36}
                          color={positive ? 'var(--color-secondary)' : 'var(--color-accent)'}
                          title={`${a.name} ${timeframe} trend`}
                        />
                      </Td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * MetricValue
 * Present a large metric value with an optional caption and positive/negative styling.
 */
function MetricValue({ value, caption, positive = true }) {
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: positive ? 'var(--color-secondary)' : 'var(--color-accent)' }}>{value}</div>
      {caption && <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 12 }}>{caption}</div>}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * MetricSkeleton
 * Lightweight skeleton for metric cards.
 */
function MetricSkeleton() {
  return (
    <div>
      <div
        style={{
          width: 120,
          height: 24,
          borderRadius: 8,
          background: 'var(--muted)',
          border: '1px solid var(--border-color)',
        }}
      />
      <div
        style={{
          marginTop: 8,
          width: 90,
          height: 12,
          borderRadius: 999,
          background: 'var(--muted)',
          border: '1px solid var(--border-color)',
        }}
      />
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Th
 * Themed table header cell.
 */
function Th({ children }) {
  return (
    <th
      style={{
        padding: '12px 8px',
        borderBottom: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        fontWeight: 600,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {children}
    </th>
  );
}

/**
 * PUBLIC_INTERFACE
 * Td
 * Themed table data cell.
 */
function Td({ children, style }) {
  return (
    <td
      style={{
        padding: '14px 8px',
        borderBottom: '1px solid var(--border-color)',
        ...style,
      }}
    >
      {children}
    </td>
  );
}
