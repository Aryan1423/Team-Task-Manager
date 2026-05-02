import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskCard from '../components/tasks/TaskCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Plus, Users, Settings } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { loading, error, request } = useApi();

  useEffect(() => {
    Promise.all([
      request('get', `/projects/${id}`),
      request('get', `/projects/${id}/tasks`)
    ]).then(([projectData, taskData]) => {
      setProject(projectData);
      setTasks(taskData);
    }).catch(() => {});
  }, [id, request]);

  if (loading && !project) return <div>Loading project...</div>;
  if (error) return <div style={{ color: 'var(--danger)' }}>{error}</div>;
  if (!project) return null;

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'var(--text-secondary)' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'var(--accent-secondary)' },
    { id: 'DONE', title: 'Done', color: 'var(--success)' },
  ];

  const handleTaskClick = async (task) => {
    const nextStatus = task.status === 'TODO' ? 'IN_PROGRESS' : task.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    const updated = await request('put', `/projects/${id}/tasks/${task.id}`, { status: nextStatus });
    setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  const addTask = async () => {
    const title = window.prompt('Task title');
    if (!title) return;
    const description = window.prompt('Task description') || '';
    const task = await request('post', `/projects/${id}/tasks`, { title, description, priority: 'MEDIUM', status: 'TODO' });
    setTasks((current) => [task, ...current]);
  };

  return (
    <div className="page-enter-active" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{project.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{project.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <Button variant="secondary"><Users size={18} /> Members</Button>
           {project.role === 'ADMIN' && <Button variant="secondary"><Settings size={18} /> Settings</Button>}
           <Button onClick={addTask}><Plus size={18} /> Add Task</Button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        flex: 1,
        minHeight: 0 // important for scrollable columns
      }}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: col.color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                  {col.title}
                </h3>
                <Badge>{colTasks.length}</Badge>
              </div>
              
              <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectDetail;
