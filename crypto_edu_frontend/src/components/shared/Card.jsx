import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card
 * A lightweight container component with optional header and footer.
 * Props:
 * - title?: string
 * - actions?: React.ReactNode
 * - children: React.ReactNode
 * - footer?: React.ReactNode
 */
export default function Card({ title, actions, children, footer }) {
  return (
    <section className="card">
      {(title || actions) && (
        <div className="card-header">
          {title && <div className="card-title">{title}</div>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </section>
  );
}
