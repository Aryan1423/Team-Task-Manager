import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useApi } from '../hooks/useApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Lock } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const { request } = useApi();

  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required'); return; }
    setProfileLoading(true);
    try {
      const data = await request('put', '/auth/profile', { name: name.trim() });
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) { toast.error('Current password is required'); return; }
    if (newPassword.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }

    setPasswordLoading(true);
    try {
      await request('put', '/auth/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page-fade-in" style={{ maxWidth: '600px' }}>
      <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Settings</h1>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
            <User size={20} />
          </div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Profile Information</h2>
        </div>
        <form onSubmit={handleProfileSubmit}>
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            Email cannot be changed.
          </p>
          <Button type="submit" loading={profileLoading}>
            Save Changes
          </Button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
            <Lock size={20} />
          </div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Change Password</h2>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
          />
          <Button type="submit" variant="secondary" loading={passwordLoading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
