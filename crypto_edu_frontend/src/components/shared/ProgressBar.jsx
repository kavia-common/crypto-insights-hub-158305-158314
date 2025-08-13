import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ProgressBar
 * Displays a horizontal progress indicator.
 * Props:
 * - value: number (0-100)
 * - label?: string
 */
export default function ProgressBar({ value = 0, label }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${v}%` }} />
      </div>
      {label && <div className="progress-label">{label}</div>}
    </div>
  );
}
