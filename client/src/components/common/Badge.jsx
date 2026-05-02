import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: { bg: 'var(--bg-glass)', color: 'var(--text-secondary)' },
    TODO: { bg: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' },
    IN_PROGRESS: { bg: 'hsla(190, 90%, 50%, 0.1)', color: 'var(--accent-secondary)', border: '1px solid var(--accent-secondary)' },
    DONE: { bg: 'hsla(145, 63%, 49%, 0.1)', color: 'var(--success)', border: '1px solid var(--success)' },
    LOW: { bg: 'var(--bg-glass)', color: 'var(--text-secondary)' },
    MEDIUM: { bg: 'hsla(38, 92%, 55%, 0.1)', color: 'var(--warning)', border: '1px solid var(--warning)' },
    HIGH: { bg: 'hsla(252, 87%, 64%, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' },
    URGENT: { bg: 'hsla(0, 72%, 56%, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' },
    ADMIN: { bg: 'hsla(252, 87%, 64%, 0.15)', color: 'var(--accent-primary)' },
    MEMBER: { bg: 'var(--bg-glass)', color: 'var(--text-secondary)' }
  };

  const style = variants[variant] || variants.default;

  return (
    <span className={className} style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.5rem',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      backgroundColor: style.bg,
      color: style.color,
      border: style.border || 'none',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
};

export default Badge;
