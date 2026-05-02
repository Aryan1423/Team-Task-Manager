import React from 'react';
import Badge from '../common/Badge';
import { format } from 'date-fns';
import { Clock, ArrowRight } from 'lucide-react';

const statusLabel = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
const nextStatus = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' };

const TaskCard = ({ task, onClick, onStatusChange }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div
      className="glass-panel"
      onClick={() => onClick?.(task)}
      style={{
        padding: '1rem',
        marginBottom: '0.75rem',
        cursor: 'pointer',
        transition: 'transform 0.1s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1, marginRight: '0.5rem' }}>{task.title}</h4>
        <Badge variant={task.priority}>{task.priority}</Badge>
      </div>

      {task.description && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {task.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isOverdue ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Clock size={12} />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}

          {onStatusChange && task.status !== 'DONE' && (
            <button
              onClick={(e) => { e.stopPropagation(); onStatusChange(task, nextStatus[task.status]); }}
              title={`Move to ${statusLabel[nextStatus[task.status]]}`}
              style={{
                background: 'none', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-secondary)', cursor: 'pointer', padding: '0.15rem 0.4rem',
                display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', fontWeight: 600,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-secondary)'; e.currentTarget.style.background = 'hsla(190, 90%, 50%, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'none'; }}
            >
              <ArrowRight size={10} />
              {statusLabel[nextStatus[task.status]]}
            </button>
          )}
        </div>

        {task.assignee ? (
           <div title={task.assignee.name} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold', flexShrink: 0 }}>
             {task.assignee.name.charAt(0).toUpperCase()}
           </div>
        ) : (
          <div title="Unassigned" style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px dashed var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} />
        )}
      </div>
    </div>
  );
};

export default TaskCard;
