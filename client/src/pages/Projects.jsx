import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import ProjectCard from '../components/projects/ProjectCard';
import { Plus, Search } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const { loading, error, request } = useApi();

  useEffect(() => {
    request('get', '/projects').then(setProjects).catch(() => {});
  }, [request]);

  const createProject = async () => {
    const name = window.prompt('Project name');
    if (!name) return;
    const description = window.prompt('Project description') || '';
    const project = await request('post', '/projects', { name, description });
    setProjects((current) => [project, ...current]);
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading && projects.length === 0) return <div>Loading projects...</div>;

  return (
    <div className="page-enter-active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.75rem' }}>Projects</h1>
        <Button onClick={createProject}>
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
        width: 'max-content'
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
            width: '250px'
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {filteredProjects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No projects found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
