import React from 'react';
import Card from '../components/shared/Card';
import ProgressBar from '../components/shared/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * Profile
 * Placeholder user profile view with progress indicators.
 */
export default function Profile() {
  return (
    <div>
      <h1 className="page-title">Profile</h1>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card title="Learning Streak">
          <p>Days active this week: 3</p>
          <ProgressBar value={60} label="Weekly goal 60%" />
        </Card>
        <Card title="Quiz Performance">
          <p>Last 5 quizzes: 80% average</p>
          <ProgressBar value={80} label="Average score 80%" />
        </Card>
      </div>
    </div>
  );
}
