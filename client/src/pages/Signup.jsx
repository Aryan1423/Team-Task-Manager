import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) return { width: '0%', color: 'transparent', label: '' };
    if (password.length < 6) return { width: '25%', color: 'var(--danger)', label: 'Weak' };
    if (password.length < 8) return { width: '50%', color: 'var(--warning)', label: 'Fair' };
    if (password.length < 12) return { width: '75%', color: 'var(--accent-secondary)', label: 'Good' };
    return { width: '100%', color: 'var(--success)', label: 'Strong' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      const validationErrors = err.response?.data?.errors;
      if (validationErrors?.length) {
        setError(validationErrors.map((e) => e.msg).join('. '));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'radial-gradient(circle at top left, var(--bg-secondary), var(--bg-primary))'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Join your team today</p>
        </div>

        {error && (
          <div style={{
            color: 'var(--danger)',
            marginBottom: '1rem',
            textAlign: 'center',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'hsla(0, 72%, 56%, 0.1)',
            border: '1px solid hsla(0, 72%, 56%, 0.2)',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Aryan"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: strength.width, height: '100%', background: strength.color, transition: 'all 0.3s', borderRadius: '2px' }} />
            </div>
            {strength.label && <span style={{ fontSize: '0.7rem', color: strength.color, fontWeight: 500, whiteSpace: 'nowrap' }}>{strength.label}</span>}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
          />

          <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign Up
          </Button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
