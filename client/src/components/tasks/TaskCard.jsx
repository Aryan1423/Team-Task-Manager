import React from 'react';
import Badge from '../common/Badge';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  return (
    <div 
      className="glass-panel" 
      onClick={() => onClick(task)}
      style={{ 
        padding: '1rem', 
        marginBottom: '1rem',
        cursor: 'grab',
        transition: 'transform 0.1s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{task.title}</h4>
        <Badge variant={task.priority}>{task.priority}</Badge>
      </div>
      
      {task.description && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          {task.dueDate && (
            <>
              <Clock size={12} />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </>
          )}
        </div>
        
        {task.assignee ? (
           <div title={task.assignee.name} style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>
             {task.assignee.name.charAt(0).toUpperCase()}
           </div>
        ) : (
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px dashed var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        )}
      </div>
    </div>
  );
};

export default TaskCard;
