import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

const TaskModal = ({ isOpen, onClose, onSubmit, onDelete, task = null, members = [], loading = false }) => {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeId: '',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        assigneeId: task.assignee?.id || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
    }
  }, [task, isOpen]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      assigneeId: form.assigneeId || null,
      dueDate: form.dueDate || null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create Task'}
      footer={
        <>
          {isEdit && onDelete && (
            <Button variant="danger" onClick={onDelete} disabled={loading} style={{ marginRight: 'auto' }}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>{isEdit ? 'Save Changes' : 'Create Task'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          value={form.title}
          onChange={handleChange('title')}
          placeholder="Enter task title"
          required
          autoFocus
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Description</label>
          <textarea
            className="styled-textarea"
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Describe the task..."
            rows={3}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</label>
            <select className="styled-select" value={form.status} onChange={handleChange('status')}>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Priority</label>
            <select className="styled-select" value={form.priority} onChange={handleChange('priority')}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Assignee</label>
            <select className="styled-select" value={form.assigneeId} onChange={handleChange('assigneeId')}>
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={handleChange('dueDate')}
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
