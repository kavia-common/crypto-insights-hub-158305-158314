import React, { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * FilterPanel
 * UI controls for filtering educational resources by Topic, Level, Duration, and Tags.
 * Props:
 * - filters: { topic: string, level: string, duration: [number, number], tags: string[] }
 * - options: { topics: string[], levels: string[], tags: string[], duration: { min: number, max: number } }
 * - onChange: (nextFilters) => void
 */
export default function FilterPanel({ filters, options, onChange }) {
  const { topics = [], levels = [], tags = [], duration = { min: 0, max: 120 } } = options || {};
  const [minD, maxD] = filters?.duration || [duration.min, duration.max];

  // Ensure duration bounds stay valid
  const clamped = useMemo(() => {
    const min = Math.max(duration.min, Math.min(minD ?? duration.min, duration.max));
    const max = Math.max(min, Math.min(maxD ?? duration.max, duration.max));
    return [min, max];
  }, [minD, maxD, duration.min, duration.max]);

  const update = (patch) => onChange({ ...filters, ...patch });

  const clearAll = () =>
    onChange({
      topic: '',
      level: '',
      duration: [duration.min, duration.max],
      tags: [],
    });

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Row 1: Topic + Level */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <Labeled label="Topic">
          <select
            aria-label="Filter by topic"
            value={filters.topic || ''}
            onChange={(e) => update({ topic: e.target.value })}
            style={selectStyle}
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Labeled>

        <Labeled label="Level">
          <select
            aria-label="Filter by level"
            value={filters.level || ''}
            onChange={(e) => update({ level: e.target.value })}
            style={selectStyle}
          >
            <option value="">All levels</option>
            {levels.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </Labeled>
      </div>

      {/* Row 2: Duration */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <Labeled label="Min Duration (min)">
          <input
            type="number"
            min={duration.min}
            max={duration.max}
            value={clamped[0]}
            onChange={(e) => {
              const v = Number(e.target.value || duration.min);
              update({ duration: [Math.max(duration.min, Math.min(v, clamped[1])), clamped[1]] });
            }}
            style={inputStyle}
          />
        </Labeled>

        <Labeled label="Max Duration (min)">
          <input
            type="number"
            min={duration.min}
            max={duration.max}
            value={clamped[1]}
            onChange={(e) => {
              const v = Number(e.target.value || duration.max);
              update({ duration: [clamped[0], Math.max(clamped[0], Math.min(v, duration.max))] });
            }}
            style={inputStyle}
          />
        </Labeled>
      </div>

      {/* Row 3: Tags */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Tags</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tags.length === 0 && <span style={{ color: 'var(--text-secondary)' }}>No tags available</span>}
          {tags.map((t) => {
            const checked = (filters.tags || []).includes(t);
            return (
              <label
                key={t}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: checked ? 'rgba(0,188,212,0.12)' : 'var(--bg-secondary)',
                  color: checked ? 'var(--color-secondary)' : 'var(--text-secondary)',
                  border: `1px solid ${checked ? 'var(--color-secondary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                title={t}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const set = new Set(filters.tags || []);
                    if (e.target.checked) set.add(t);
                    else set.delete(t);
                    update({ tags: Array.from(set) });
                  }}
                  style={{ accentColor: 'var(--color-secondary)' }}
                />
                <span>#{t}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={clearAll}
          className="tab"
          title="Clear all filters"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Labeled
 * Field wrapper for label + control.
 */
function Labeled({ label, children }) {
  return (
    <label>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

const selectStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 10,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 10,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
};
