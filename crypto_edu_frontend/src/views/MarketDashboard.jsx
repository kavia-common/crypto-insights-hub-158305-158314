import React from 'react';
import Card from '../components/shared/Card';
import ProgressBar from '../components/shared/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * MarketDashboard
 * Placeholder market dashboard showing sample cards and a progress bar.
 * Props:
 * - searchQuery?: string
 */
export default function MarketDashboard({ searchQuery }) {
  return (
    <div>
      <h1 className="page-title">Market Dashboard</h1>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card title="Market Overview">
          <p style={{ margin: 0 }}>
            {searchQuery ? `Showing results for: "${searchQuery}"` : 'Track crypto market trends and key metrics.'}
          </p>
        </Card>

        <Card title="Your Learning Progress">
          <ProgressBar value={42} label="Overall progress: 42%" />
        </Card>
      </div>
    </div>
  );
}
