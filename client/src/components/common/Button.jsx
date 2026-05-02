import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    border: 'none',
    outline: 'none',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
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
    }
  };

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant], ...props.style }} 
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
