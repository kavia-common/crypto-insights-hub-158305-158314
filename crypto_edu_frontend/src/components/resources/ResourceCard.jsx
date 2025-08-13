import React from 'react';
import Card from '../shared/Card';
import ProgressBar from '../shared/ProgressBar';
import { formatDuration } from '../../services/contentService';

/**
 * PUBLIC_INTERFACE
 * ResourceCard
 * Displays a single educational resource with topic, level, duration, tags, and progress.
 * Props:
 * - resource: {
 *     id: string,
 *     title: string,
 *     description: string,
 *     topic: string,
 *     level: 'Beginner' | 'Intermediate' | 'Advanced',
 *     durationMinutes: number,
 *     tags: string[],
 *     rating?: number,
 *     progress?: number,
 *     format?: string
 *   }
 */
export default function ResourceCard({ resource }) {
  const {
    title,
    description,
    topic,
    level,
    durationMinutes,
    tags = [],
    rating,
    progress,
    format,
  } = resource || {};

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span>{title}</span>
          {format && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                padding: '2px 6px',
                borderRadius: 8,
                background: 'var(--bg-secondary)',
              }}
              aria-label={`Format: ${format}`}
              title={`Format: ${format}`}
            >
              {format}
            </span>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <Badge label={topic} />
        <Badge label={level} variant={levelVariant(level)} />
        <Badge label={formatDuration(durationMinutes)} title="Estimated duration" />
        {typeof rating === 'number' && <Badge label={`⭐ ${rating.toFixed(1)}`} title="Average rating" />}
      </div>

      <p style={{ marginTop: 8, marginBottom: 12, color: 'var(--text-secondary)' }}>
        {truncate(description, 140)}
      </p>

      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {tags.map((t) => (
            <Tag key={t} text={t} />
          ))}
        </div>
      )}

      {typeof progress === 'number' && (
        <ProgressBar value={Math.max(0, Math.min(100, progress))} label={`Progress ${progress}%`} />
      )}
    </Card>
  );
}

/**
 * PUBLIC_INTERFACE
 * Badge
 * Small pill-like label for metadata.
 */
function Badge({ label, title, variant = 'default' }) {
  const colors = {
    default: { bg: 'var(--bg-secondary)', border: 'var(--border-color)', color: 'var(--text-primary)' },
    green: { bg: 'rgba(0,188,212,0.12)', border: 'var(--color-secondary)', color: 'var(--color-secondary)' },
    amber: { bg: 'rgba(255,193,7,0.12)', border: 'var(--color-accent)', color: 'var(--color-accent)' },
    gray: { bg: 'var(--bg-secondary)', border: 'var(--border-color)', color: 'var(--text-secondary)' },
  }[variant] || {};
  return (
    <span
      title={title}
      style={{
        fontSize: 12,
        padding: '4px 8px',
        borderRadius: 999,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.color,
      }}
    >
      {label}
    </span>
  );
}

/**
 * PUBLIC_INTERFACE
 * Tag
 * Compact tag chip.
 */
function Tag({ text }) {
  return (
    <span
      style={{
        fontSize: 12,
        padding: '3px 8px',
        borderRadius: 999,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
      }}
      aria-label={`Tag: ${text}`}
    >
      #{text}
    </span>
  );
}

/**
 * PUBLIC_INTERFACE
 * levelVariant
 * Map level to badge variant for color coding.
 */
function levelVariant(level) {
  switch (level) {
    case 'Beginner':
      return 'green';
    case 'Advanced':
      return 'amber';
    default:
      return 'gray';
  }
}

/**
 * PUBLIC_INTERFACE
 * truncate
 * Simple text truncation helper.
 */
function truncate(text, max = 120) {
  const t = String(text || '');
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
