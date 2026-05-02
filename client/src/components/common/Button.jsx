import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', loading = false, disabled, style: styleProp, as: Component = 'button', ...props }) => {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    fontSize: '0.875rem',
    border: 'none',
    outline: 'none',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    opacity: (loading || disabled) ? 0.6 : 1,
    pointerEvents: (loading || disabled) ? 'none' : 'auto',
  };

  const variants = {
    primary: {
      background: 'var(--accent-primary)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      background: 'var(--bg-glass)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--danger)',
      border: '1px solid var(--danger)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none',
      padding: '0.5rem 0.75rem',
    },
  };

  return (
    <Component
      style={{ ...baseStyle, ...variants[variant], ...styleProp }}
      className={className}
      disabled={Component === 'button' ? loading || disabled : undefined}
      aria-disabled={Component !== 'button' && (loading || disabled) ? true : undefined}
      {...props}
    >
      {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </Component>
  );
};

if (typeof document !== 'undefined' && !document.getElementById('btn-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'btn-spinner-style';
  style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}

export default Button;
