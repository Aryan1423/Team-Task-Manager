import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, style: styleProp, onFocus, onBlur, ...props }, ref) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
      {label && <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <input
        ref={ref}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-secondary)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s',
          width: '100%',
          ...styleProp
        }}
        onFocus={(e) => {
          if (!error) e.target.style.borderColor = 'var(--accent-primary)';
          onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!error) e.target.style.borderColor = 'var(--border-color)';
          onBlur?.(e);
        }}
        {...props}
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
