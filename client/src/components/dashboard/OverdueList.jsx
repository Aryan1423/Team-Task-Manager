import React from 'react';
import Badge from '../common/Badge';
import { format, isPast } from 'date-fns';

const OverdueList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No overdue tasks! Great job.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Overdue Tasks</h3>
        <Badge variant="URGENT">{tasks.length} pending</Badge>
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {tasks.map(task => (
          <div key={task.id} style={{ 
            padding: '1rem 1.5rem', 
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{task.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Project: {task.project}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <Badge variant={task.priority}>{task.priority}</Badge>
              <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverdueList;
