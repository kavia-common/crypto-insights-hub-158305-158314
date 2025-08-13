import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Footer
 * Minimal application footer with attribution and year.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <span>© {year} CryptoEdu · Built with a modern, minimal UI.</span>
    </footer>
  );
}
