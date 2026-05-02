import React from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="page-enter-active" style={{ maxWidth: '600px' }}>
      <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Settings</h1>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Profile Information</h2>
        <form>
          <Input label="Full Name" defaultValue={user?.name} />
          <Input label="Email Address" type="email" defaultValue={user?.email} disabled style={{ opacity: 0.7 }} />
          <Button type="button" style={{ marginTop: '1rem' }}>Save Changes</Button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Change Password</h2>
        <form>
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
          <Input label="Confirm New Password" type="password" />
          <Button type="button" variant="secondary" style={{ marginTop: '1rem' }}>Update Password</Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
