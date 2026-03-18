import React, { useState, useEffect } from 'react';
import { 
  Warehouse, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const Dashboard = ({ isManager }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const rawStats = [
      { label: 'Total Warehouses', value: isManager ? '1' : '12', icon: <Warehouse />, color: 'var(--primary)', hideForManager: true },
      { label: 'Total Bills', value: isManager ? '25' : '156', icon: <FileText />, color: '#6366f1' },
      { label: 'Pending Approvals', value: isManager ? '5' : '24', icon: <Clock />, color: '#f59e0b' },
      { label: 'Approved Bills', value: isManager ? '15' : '120', icon: <CheckCircle2 />, color: '#10b981' },
      { label: 'Rejected Bills', value: isManager ? '5' : '12', icon: <XCircle />, color: '#ef4444' },
    ];
    setStats(isManager ? rawStats.filter(s => !s.hideForManager) : rawStats);
  }, [isManager]);

  const chartData = [
    { name: 'WH-01', claims: 40 },
    { name: 'WH-02', claims: 30 },
    { name: 'WH-03', claims: 20 },
    { name: 'WH-04', claims: 27 },
    { name: 'WH-05', claims: 18 },
  ];

  const recentBills = [
    { id: 'BILL-001', warehouse: 'Main Station', commodity: 'Rice', status: 'Approved', date: '2024-03-10' },
    { id: 'BILL-002', warehouse: 'West Wing', commodity: 'Wheat', status: 'Pending', date: '2024-03-12' },
    { id: 'BILL-003', warehouse: 'North Store', commodity: 'Maize', status: 'Rejected', date: '2024-03-14' },
    { id: 'BILL-004', warehouse: 'East Hub', commodity: 'Rice', status: 'Approved', date: '2024-03-15' },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {isManager ? 'Warehouse Manager' : 'Admin'} ({user.first_name})</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="card stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {!isManager && (
          <div className="card chart-card">
            <h3>Warehouse Summary</h3>
            <div className="chart-container" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    cursor={{ fill: 'var(--bg-sidebar)' }}
                  />
                  <Bar dataKey="claims" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="card table-card" style={{ gridColumn: isManager ? 'span 2' : 'unset' }}>
          <div className="card-header">
            <h3>Recent Bills</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bill ID</th>
                  {!isManager && <th>Warehouse</th>}
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="fw-500">{bill.id}</td>
                    {!isManager && <td>{bill.warehouse}</td>}
                    <td>
                      <span className={`badge badge-${bill.status.toLowerCase()}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td>{bill.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
