import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import StatusChart from '../components/dashboard/StatusChart';
import OverdueList from '../components/dashboard/OverdueList';
import { FolderKanban, CheckSquare, AlertCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { loading, error, request } = useApi();

  useEffect(() => {
    request('get', '/dashboard/stats').then(setStats).catch(() => {});
  }, [request]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: 'var(--danger)' }}>{error}</div>;
  if (!stats) return null;

  return (
    <div className="page-enter-active">
      <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard title="Active Projects" value={stats.totalProjects} icon={FolderKanban} trend={12} />
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckSquare} trend={5} />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks.length} icon={AlertCircle} trend={-10} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2fr', 
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Task Distribution</h3>
          <StatusChart data={stats.tasksByStatus} />
        </div>
        
        <OverdueList tasks={stats.overdueTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
