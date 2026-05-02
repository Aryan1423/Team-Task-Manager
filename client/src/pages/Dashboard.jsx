import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import StatusChart from '../components/dashboard/StatusChart';
import OverdueList from '../components/dashboard/OverdueList';
import { FolderKanban, CheckSquare, AlertCircle, Clock } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const SkeletonCard = () => (
  <div className="skeleton" style={{ height: '120px' }} />
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { loading, error, request } = useApi();

  useEffect(() => {
    request('get', '/dashboard/stats').then(setStats).catch(() => {});
  }, [request]);

  if (loading && !stats) {
    return (
      <div className="page-fade-in">
        <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Dashboard Overview</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }} className="dashboard-grid-2col">
          <div className="skeleton" style={{ height: '300px' }} />
          <div className="skeleton" style={{ height: '300px' }} />
        </div>
      </div>
    );
  }

  if (error) return <div style={{ color: 'var(--danger)', padding: '2rem' }}>{error}</div>;
  if (!stats) return null;

  const doneCount = stats.tasksByStatus?.DONE || 0;
  const completionRate = stats.totalTasks > 0 ? Math.round((doneCount / stats.totalTasks) * 100) : 0;

  return (
    <div className="page-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Dashboard Overview</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard title="Active Projects" value={stats.totalProjects} icon={FolderKanban} />
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckSquare} />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks.length} icon={AlertCircle} />
        <StatCard title="Completion Rate" value={`${completionRate}%`} icon={Clock} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '1.5rem',
        alignItems: 'start'
      }} className="dashboard-grid-2col">
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
