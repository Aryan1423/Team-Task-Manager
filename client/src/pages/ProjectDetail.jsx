import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import MembersPanel from '../components/projects/MembersPanel';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Plus, Users, Search, Filter, X, ListTodo } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const { loading, error, request } = useApi();
  const toast = useToast();

  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [projectData, taskData, memberData] = await Promise.all([
        request('get', `/projects/${id}`),
        request('get', `/projects/${id}/tasks`),
        request('get', `/projects/${id}/members`),
      ]);
      setProject(projectData);
      setTasks(taskData);
      setMembers(memberData);
    } catch (error) {
      void error;
    }
  }, [id, request]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTask = async (data) => {
    setModalLoading(true);
    try {
      const task = await request('post', `/projects/${id}/tasks`, data);
      setTasks((current) => [task, ...current]);
      setCreateTaskOpen(false);
      toast.success('Task created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditTask = async (data) => {
    setModalLoading(true);
    try {
      const updated = await request('put', `/projects/${id}/tasks/${editTask.id}`, data);
      setTasks((current) => current.map((t) => t.id === updated.id ? updated : t));
      setEditTask(null);
      toast.success('Task updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    setModalLoading(true);
    try {
      await request('delete', `/projects/${id}/tasks/${deleteTask.id}`);
      setTasks((current) => current.filter((t) => t.id !== deleteTask.id));
      setDeleteTask(null);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const updated = await request('put', `/projects/${id}/tasks/${task.id}`, { status: newStatus });
      setTasks((current) => current.map((t) => t.id === updated.id ? updated : t));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleTaskClick = (task) => {
    setEditTask(task);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    if (filterSearch && !t.title.toLowerCase().includes(filterSearch.toLowerCase())) return false;
    return true;
  });

  const hasActiveFilters = filterStatus || filterPriority || filterSearch;
  const clearFilters = () => { setFilterStatus(''); setFilterPriority(''); setFilterSearch(''); };

  if (loading && !project) {
    return (
      <div className="page-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="skeleton" style={{ height: '60px', marginBottom: '2rem', maxWidth: '400px' }} />
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }} className="kanban-columns">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ flex: 1, minHeight: '300px' }} />)}
        </div>
      </div>
    );
  }

  if (error) return <div style={{ color: 'var(--danger)', padding: '2rem' }}>{error}</div>;
  if (!project) return null;

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'var(--text-secondary)' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'var(--accent-secondary)' },
    { id: 'DONE', title: 'Done', color: 'var(--success)' },
  ];

  return (
    <div className="page-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{project.name}</h1>
          {project.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{project.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => setMembersOpen(true)}>
            <Users size={16} /> Members
          </Button>
          <Button variant="secondary" onClick={() => setShowFilters((v) => !v)}>
            <Filter size={16} /> Filter
            {hasActiveFilters && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginLeft: '0.25rem' }} />}
          </Button>
          <Button onClick={() => setCreateTaskOpen(true)}>
            <Plus size={16} /> Add Task
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: '1', minWidth: '150px', maxWidth: '280px' }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', marginLeft: '0.5rem', width: '100%', fontSize: '0.8rem' }}
            />
          </div>
          <select className="styled-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.5rem 2rem 0.5rem 0.75rem' }}>
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select className="styled-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.5rem 2rem 0.5rem 0.75rem' }}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} style={{ fontSize: '0.8rem' }}>
              <X size={14} /> Clear
            </Button>
          )}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '1rem',
        flex: 1,
        minHeight: 0,
      }} className="kanban-columns">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              minWidth: 0,
            }}>
              <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: col.color, display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                  {col.title}
                </h3>
                <Badge>{colTasks.length}</Badge>
              </div>

              <div style={{ padding: '0.75rem', flex: 1, overflowY: 'auto' }}>
                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No tasks
                  </div>
                )}
                {colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={handleTaskClick}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="empty-state" style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translate(-50%, -50%)' }}>
          <ListTodo size={48} />
          <h3>No tasks yet</h3>
          <p>Add your first task to get started with this project.</p>
          <Button onClick={() => setCreateTaskOpen(true)} style={{ marginTop: '1rem' }}>
            <Plus size={16} /> Add Task
          </Button>
        </div>
      )}

      <TaskModal
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        members={members}
        loading={modalLoading}
      />

      <TaskModal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleEditTask}
        onDelete={() => {
          setDeleteTask(editTask);
          setEditTask(null);
        }}
        task={editTask}
        members={members}
        loading={modalLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTask?.title}"? This action cannot be undone.`}
        loading={modalLoading}
      />

      <MembersPanel
        isOpen={membersOpen}
        onClose={() => { setMembersOpen(false); loadData(); }}
        projectId={id}
        currentUserRole={project.role}
      />
    </div>
  );
};

export default ProjectDetail;
