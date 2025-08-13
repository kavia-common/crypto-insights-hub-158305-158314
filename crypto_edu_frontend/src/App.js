import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

import MarketDashboard from './views/MarketDashboard';
import Resources from './views/Resources';
import Profile from './views/Profile';
import Quizzes from './views/Quizzes';
import Auth from './views/Auth';

/**
 * PUBLIC_INTERFACE
 * App
 * This is the main application component for the Crypto Education frontend.
 * It sets up the global theme, maintains view-based navigation state (no routing),
 * and composes the core layout (Header, Sidebar, Footer) with the main content area.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('dashboard');
  const [query, setQuery] = useState('');

  // Apply theme to document element for CSS variables theming.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /** PUBLIC_INTERFACE
   * toggleTheme
   * Toggles the UI between light and dark modes.
   */
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  /** PUBLIC_INTERFACE
   * handleNavigate
   * @param {string} nextView - the view identifier to show
   * Updates the current view in app state (simple view-based navigation).
   */
  const handleNavigate = (nextView) => {
    setView(nextView);
  };

  /** PUBLIC_INTERFACE
   * handleSearchChange
   * @param {string} value - the current input value
   * Stores the search query. Future steps can use this for filtering data.
   */
  const handleSearchChange = (value) => {
    setQuery(value);
  };

  const CurrentView = useMemo(() => {
    switch (view) {
      case 'dashboard':
        return <MarketDashboard searchQuery={query} />;
      case 'resources':
        return <Resources searchQuery={query} />;
      case 'quizzes':
        return <Quizzes />;
      case 'profile':
        return <Profile />;
      case 'auth':
        return <Auth />;
      default:
        return <MarketDashboard searchQuery={query} />;
    }
  }, [view, query]);

  return (
    <div className="app-root">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        currentView={view}
        onNavigate={handleNavigate}
        onSearchChange={handleSearchChange}
      />

      <div className="layout">
        <Sidebar currentView={view} onNavigate={handleNavigate} />
        <main className="main-content" role="main" aria-live="polite">
          {CurrentView}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
