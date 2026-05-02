import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.role}</div>
        </div>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          backgroundColor: 'var(--bg-glass)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-primary)'
        }}>
          <UserIcon size={20} />
        </div>
        <button onClick={logout} style={{
          background: 'none', border: 'none', color: 'var(--text-secondary)',
          cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center'
        }} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
