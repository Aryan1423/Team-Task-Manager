import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const { loading, error, request } = useApi();
  const toast = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    request('get', '/projects').then(setProjects).catch(() => {});
  }, [request]);

  const handleCreate = async (data) => {
    setModalLoading(true);
    try {
      const project = await request('post', '/projects', data);
      setProjects((current) => [project, ...current]);
      setCreateOpen(false);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = async (data) => {
    setModalLoading(true);
    try {
      const updated = await request('put', `/projects/${editProject.id}`, data);
      setProjects((current) => current.map((p) => p.id === updated.id ? updated : p));
      setEditProject(null);
      toast.success('Project updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    setModalLoading(true);
    try {
      await request('delete', `/projects/${deleteProject.id}`);
      setProjects((current) => current.filter((p) => p.id !== deleteProject.id));
      setDeleteProject(null);
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading && projects.length === 0) {
    return (
      <div className="page-fade-in">
        <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Projects</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: '180px' }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.75rem' }}>Projects</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={20} />
          New Project
        </Button>
      </div>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        marginBottom: '2rem',
        maxWidth: '400px',
      }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            outline: 'none',
            marginLeft: '0.5rem',
            width: '100%',
            fontSize: '0.875rem',
          }}
        />
      </div>

      {projects.length === 0 && !loading ? (
        <div className="empty-state">
          <FolderKanban size={48} />
          <h3>No projects yet</h3>
          <p>Create your first project to start managing tasks with your team.</p>
          <Button onClick={() => setCreateOpen(true)} style={{ marginTop: '1.5rem' }}>
            <Plus size={18} /> Create Project
          </Button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={(p) => setDeleteProject(p)}
              onEdit={(p) => setEditProject(p)}
            />
          ))}
          {filteredProjects.length === 0 && projects.length > 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              {`No projects found matching "${search}"`}
            </div>
          )}
        </div>
      )}

      <ProjectModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        loading={modalLoading}
      />

      <ProjectModal
        isOpen={!!editProject}
        onClose={() => setEditProject(null)}
        onSubmit={handleEdit}
        project={editProject}
        loading={modalLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteProject?.name}"? This will permanently remove all tasks and team members associated with this project.`}
        loading={modalLoading}
      />
    </div>
  );
};

export default Projects;
