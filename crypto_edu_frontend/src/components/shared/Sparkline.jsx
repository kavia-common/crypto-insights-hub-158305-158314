import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sparkline
 * Lightweight inline SVG sparkline for visualizing small time series trends.
 * Props:
 * - data: number[] (array of numeric values; can be any scale; the component normalizes internally)
 * - width?: number (default 120)
 * - height?: number (default 36)
 * - color?: string (stroke color, defaults to CSS var --color-secondary)
 * - strokeWidth?: number (default 2)
 * - title?: string (accessible title, default "Trend sparkline")
 */
export default function Sparkline({
  data = [],
  width = 120,
  height = 36,
  color = 'var(--color-secondary)',
  strokeWidth = 2,
  title = 'Trend sparkline',
}) {
  // Guard: render an empty SVG placeholder if no data provided.
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="No trend data"
        style={{ display: 'block' }}
      />
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid division by zero

  // Convert data points to coordinates within the SVG viewport.
  const stepX = data.length > 1 ? width / (data.length - 1) : width;
  const toY = (v) => {
    // normalize so that higher value is higher on the chart (smaller y)
    const t = (v - min) / range;
    return height - t * height;
  };

  const points = data.map((v, i) => `${i * stepX},${toY(v)}`).join(' ');
  const d = `M ${points.replace(/ /g, ' L ')}`;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label={title}
      style={{ display: 'block' }}
    >
      <title>{title}</title>
      <desc>Compact line chart showing a trend.</desc>
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
