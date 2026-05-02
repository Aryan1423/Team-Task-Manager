import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';

const Topbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      flexShrink: 0,
    }}>

      <button
        className="hamburger-btn"
        onClick={onMenuToggle}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          padding: '0.5rem',
          display: 'none',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <Menu size={24} />
      </button>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
        </div>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'var(--accent-gradient)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 600, fontSize: '0.875rem',
        }}>
          {user?.name?.charAt(0)?.toUpperCase() || <UserIcon size={20} />}
        </div>
        <button onClick={logout} style={{
          background: 'none', border: 'none', color: 'var(--text-secondary)',
          cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center',
          transition: 'color 0.2s',
        }} title="Logout"
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
