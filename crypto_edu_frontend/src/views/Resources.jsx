import React, { useState } from 'react';
import Card from '../components/shared/Card';
import Tabs from '../components/shared/Tabs';

/**
 * PUBLIC_INTERFACE
 * Resources
 * Placeholder resources view with tabbed categories.
 * Props:
 * - searchQuery?: string
 */
export default function Resources({ searchQuery }) {
  const [active, setActive] = useState('all');
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'long', label: 'Long-term' },
    { key: 'short', label: 'Short-term' },
    { key: 'fundamentals', label: 'Fundamentals' },
  ];

  return (
    <div>
      <h1 className="page-title">Resources</h1>
      <Card
        title="Categories"
        actions={<span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Filters</span>}
      >
        <Tabs tabs={tabs} activeKey={active} onChange={setActive} />
        <div style={{ marginTop: 12, color: 'var(--text-secondary)' }}>
          {searchQuery ? `Searching "${searchQuery}" in ${active} resources.` : `Browse ${active} resources.`}
        </div>
      </Card>
    </div>
  );
}
