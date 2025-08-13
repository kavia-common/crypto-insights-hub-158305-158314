import React from 'react';
import Card from '../components/shared/Card';

/**
 * PUBLIC_INTERFACE
 * Quizzes
 * Placeholder quizzes view for interactive knowledge checks.
 */
export default function Quizzes() {
  return (
    <div>
      <h1 className="page-title">Quizzes</h1>
      <Card title="Upcoming">
        <p>Interactive quizzes will appear here in later steps.</p>
      </Card>
    </div>
  );
}
