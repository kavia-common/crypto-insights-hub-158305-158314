import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/shared/Card';
import Tabs from '../components/shared/Tabs';
import ResourceCard from '../components/resources/ResourceCard';
import FilterPanel from '../components/resources/FilterPanel';
import { fetchEducationalResources, getResourceFilterOptions } from '../services/contentService';

/**
 * PUBLIC_INTERFACE
 * Resources
 * Educational resources view displaying a responsive grid of items with
 * strategy tabs (Long-term, Short-term), search integration, and filters
 * (Topic, Level, Duration, Tags) using a FilterPanel subcomponent.
 * Props:
 * - searchQuery?: string (from header search)
 */
export default function Resources({ searchQuery }) {
  // Strategy tabs: 'long' | 'short'
  const [strategy, setStrategy] = useState('long');

  // Data and loading state
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  // Filters state
  const [filters, setFilters] = useState({
    topic: '',
    level: '',
    duration: [0, 999], // minutes
    tags: [],
  });

  // Load data for current strategy
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchEducationalResources({ strategy })
      .then((items) => {
        if (!mounted) return;
        setResources(items);
        // Reset filters when switching strategies to avoid confusion
        const { min, max } = getResourceFilterOptions(items).duration;
        setFilters({ topic: '', level: '', duration: [min, max], tags: [] });
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [strategy]);

  // Build options for FilterPanel based on loaded resources
  const filterOptions = useMemo(() => {
    return getResourceFilterOptions(resources);
  }, [resources]);

  // Apply search and filters
  const filteredResources = useMemo(() => {
    const q = String(searchQuery || '').trim().toLowerCase();

    return resources.filter((r) => {
      // Search match on title, description, topic, tags
      const searchMatch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        (r.tags || []).some((t) => t.toLowerCase().includes(q));

      if (!searchMatch) return false;

      // Topic
      if (filters.topic && r.topic !== filters.topic) return false;

      // Level
      if (filters.level && r.level !== filters.level) return false;

      // Duration range [min, max]
      const [minD, maxD] = filters.duration || [0, 999];
      const dur = Number(r.durationMinutes || 0);
      if (dur < minD || dur > maxD) return false;

      // Tags: all selected tags should be present
      if (filters.tags && filters.tags.length > 0) {
        const set = new Set((r.tags || []).map((t) => String(t)));
        for (const t of filters.tags) {
          if (!set.has(t)) return false;
        }
      }

      return true;
    });
  }, [resources, filters, searchQuery]);

  const strategyTabs = useMemo(
    () => [
      { key: 'long', label: 'Long-term' },
      { key: 'short', label: 'Short-term' },
    ],
    []
  );

  return (
    <div>
      <h1 className="page-title">Educational Resources</h1>

      {/* Strategy and summary */}
      <Card
        title="Browse Learning Materials"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div aria-label="Strategy selection" title="Select learning strategy">
              <Tabs tabs={strategyTabs} activeKey={strategy} onChange={setStrategy} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {loading ? 'Loading...' : `${filteredResources.length} of ${resources.length} shown`}
            </span>
          </div>
        }
      >
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {searchQuery
            ? `Searching "${searchQuery}" in ${strategy === 'long' ? 'Long-term' : 'Short-term'} resources`
            : `Explore curated ${strategy === 'long' ? 'Long-term' : 'Short-term'} resources across topics and levels.`}
        </div>
      </Card>

      {/* Filters */}
      <Card title="Filters">
        <FilterPanel
          filters={filters}
          options={filterOptions}
          onChange={setFilters}
        />
      </Card>

      {/* Resource Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginTop: 16,
        }}
        role="list"
        aria-label="Educational resources"
      >
        {loading && (
          <Card>
            <div style={{ color: 'var(--text-secondary)' }}>Loading resources...</div>
          </Card>
        )}
        {!loading && filteredResources.length === 0 && (
          <Card>
            <div style={{ color: 'var(--text-secondary)' }}>
              No resources match the current search and filters.
            </div>
          </Card>
        )}
        {!loading &&
          filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
      </div>
    </div>
  );
}
