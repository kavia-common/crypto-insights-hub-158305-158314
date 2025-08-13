import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Left navigation panel offering quick links to primary views.
 * Props:
 * - currentView: string
 * - onNavigate: (view: string) => void
 */
export default function Sidebar({ currentView, onNavigate }) {
  const navItems = [
    { key: 'dashboard', label: 'Market Dashboard', icon: '📊' },
    { key: 'resources', label: 'Resources', icon: '📚' },
    { key: 'quizzes', label: 'Quizzes', icon: '🧠' },
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'auth', label: 'Auth', icon: '🔐' },
  ];

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="section-title">Navigate</div>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.key} className="nav-item">
            <button
              className={`nav-link ${currentView === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
              aria-current={currentView === item.key ? 'page' : undefined}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
