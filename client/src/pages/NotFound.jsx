import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const destination = isAuthenticated ? '/' : '/login';
  const label = isAuthenticated ? 'Back to Dashboard' : 'Back to Login';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(circle at top, var(--bg-secondary), var(--bg-primary))'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--bg-primary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-secondary)',
          marginBottom: '1.25rem'
        }}>
          <Compass size={28} />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          404
        </p>
        <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Page not found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          The page you are looking for does not exist or has moved.
        </p>
        <Button as={Link} to={destination}>
          {label}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
