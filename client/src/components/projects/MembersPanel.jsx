import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Badge from '../common/Badge';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Trash2, Shield, ShieldOff } from 'lucide-react';

const MembersPanel = ({ isOpen, onClose, projectId, currentUserRole }) => {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [addRole, setAddRole] = useState('MEMBER');
  const { loading, request } = useApi();
  const [addLoading, setAddLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    if (isOpen && projectId) {
      request('get', `/projects/${projectId}/members`)
        .then(setMembers)
        .catch(() => showError('Failed to load members'));
    }
  }, [isOpen, projectId, request, showError]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAddLoading(true);
    try {
      const member = await request('post', `/projects/${projectId}/members`, { email: email.trim(), role: addRole });
      setMembers((prev) => [...prev, member]);
      setEmail('');
      setAddRole('MEMBER');
      showSuccess('Member added successfully');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemove = async (member) => {
    try {
      await request('delete', `/projects/${projectId}/members/${member.id}`);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      showSuccess('Member removed');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleRoleChange = async (member, newRole) => {
    try {
      const updated = await request('put', `/projects/${projectId}/members/${member.id}`, { role: newRole });
      setMembers((prev) => prev.map((m) => m.id === updated.id ? updated : m));
      showSuccess(`Role updated to ${newRole}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const isAdmin = currentUserRole === 'ADMIN';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team Members" maxWidth="560px">

      {isAdmin && (
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Add Member by Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{ marginBottom: 0 }}
            />
          </div>
          <select className="styled-select" value={addRole} onChange={(e) => setAddRole(e.target.value)} style={{ marginBottom: '1rem', minWidth: '100px' }}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <Button type="submit" loading={addLoading} style={{ marginBottom: '1rem', whiteSpace: 'nowrap' }}>
            <UserPlus size={16} /> Add
          </Button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {loading && members.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
        )}
        {members.map((member) => (
          <div key={member.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--accent-gradient)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 600, flexShrink: 0,
            }}>
              {member.user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.user.email}</div>
            </div>
            <Badge variant={member.role}>{member.role}</Badge>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  onClick={() => handleRoleChange(member, member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN')}
                  title={member.role === 'ADMIN' ? 'Demote to Member' : 'Promote to Admin'}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.375rem', display: 'flex', borderRadius: 'var(--radius-sm)', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  {member.role === 'ADMIN' ? <ShieldOff size={14} /> : <Shield size={14} />}
                </button>
                <button
                  onClick={() => handleRemove(member)}
                  title="Remove member"
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.375rem', display: 'flex', borderRadius: 'var(--radius-sm)', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,60,60,0.1)'; e.currentTarget.style.color = 'var(--danger)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default MembersPanel;
