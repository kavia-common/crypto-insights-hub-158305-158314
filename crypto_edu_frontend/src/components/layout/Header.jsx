import React from 'react';
import SearchBar from '../shared/SearchBar';

/**
 * PUBLIC_INTERFACE
 * Header
 * Top application bar providing brand, quick navigation, search, and theme toggle.
 * Props:
 * - theme: 'light' | 'dark'
 * - onToggleTheme: () => void
 * - currentView: string
 * - onNavigate: (view: string) => void
 * - onSearchChange: (value: string) => void
 */
export default function Header({ theme, onToggleTheme, currentView, onNavigate, onSearchChange }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'resources', label: 'Resources' },
    { key: 'quizzes', label: 'Quizzes' },
    { key: 'profile', label: 'Profile' },
    { key: 'auth', label: 'Auth' },
  ];

  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="brand" aria-label="Application brand">
          <span>CryptoEdu</span>
          <span className="brand-badge">Beta</span>
        </div>

        <div className="header-spacer" />

        <nav className="top-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-btn ${currentView === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
              aria-current={currentView === item.key ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <SearchBar placeholder="Search resources or markets..." onChange={onSearchChange} />

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
