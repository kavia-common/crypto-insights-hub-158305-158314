import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Tabs
 * Simple tabs UI with controlled active key.
 * Props:
 * - tabs: { key: string, label: string }[]
 * - activeKey: string
 * - onChange: (key: string) => void
 */
export default function Tabs({ tabs = [], activeKey, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="Tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={activeKey === t.key}
          className={`tab ${activeKey === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
