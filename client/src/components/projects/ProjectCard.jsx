import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { Users, MoreVertical, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`} className="glass-panel" style={{ 
      padding: '1.5rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{project.name}</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
          <MoreVertical size={20} />
        </button>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1, margin: 0 }}>
        {project.description || 'No description provided.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <Users size={14} />
          <span>{project.membersCount} Members</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <Calendar size={14} />
          <span>Updated {format(new Date(project.updatedAt), 'MMM d')}</span>
        </div>
        
        {project.role === 'ADMIN' && (
          <div style={{ marginLeft: 'auto' }}>
            <Badge variant="ADMIN">ADMIN</Badge>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
