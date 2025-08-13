import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchBar
 * Minimal search input that calls onChange with the current value.
 * Props:
 * - placeholder?: string
 * - onChange?: (value: string) => void
 */
export default function SearchBar({ placeholder = 'Search...', onChange }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    if (onChange) onChange(v);
  };

  return (
    <label className="search-bar" aria-label="Search">
      <span className="search-icon" aria-hidden="true">🔎</span>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label={placeholder}
      />
    </label>
  );
}
