import React from 'react';

const StatusChart = ({ data }) => {
  const total = data.TODO + data.IN_PROGRESS + data.DONE;
  
  if (total === 0) {
    return <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No tasks</div>;
  }

  const pTodo = (data.TODO / total) * 100;
  const pInProg = (data.IN_PROGRESS / total) * 100;
  const pDone = (data.DONE / total) * 100;

  // Pure CSS Donut using conic-gradient
  const gradient = `conic-gradient(
    var(--text-secondary) 0% ${pTodo}%,
    var(--accent-secondary) ${pTodo}% ${pTodo + pInProg}%,
    var(--success) ${pTodo + pInProg}% 100%
  )`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)', // Inner circle for donut
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{total}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Tasks</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <LegendItem label="To Do" value={data.TODO} color="var(--text-secondary)" />
        <LegendItem label="In Progress" value={data.IN_PROGRESS} color="var(--accent-secondary)" />
        <LegendItem label="Done" value={data.DONE} color="var(--success)" />
      </div>
    </div>
  );
};

const LegendItem = ({ label, value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontWeight: 600 }}>{value}</span>
  </div>
);

export default StatusChart;
