import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { Users, MoreVertical, Calendar, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
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
      <Link to={`/projects/${project.id}`} style={{ padding: '1.5rem 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'inherit', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{project.name}</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1, margin: 0 }}>
          {project.description || 'No description provided.'}
        </p>
      </Link>

      <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <Users size={14} />
          <span>{project.membersCount} Members</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <Calendar size={14} />
          <span>Updated {format(new Date(project.updatedAt), 'MMM d')}</span>
        </div>

        {project.role === 'ADMIN' && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="ADMIN">ADMIN</Badge>
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen((v) => !v); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit?.(project); }}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button className="dropdown-item danger" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(project); }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {project.role !== 'ADMIN' && (
          <div style={{ marginLeft: 'auto' }}>
            <Badge variant="MEMBER">MEMBER</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
