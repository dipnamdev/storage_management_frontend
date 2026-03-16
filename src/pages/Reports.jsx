import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Filter } from 'lucide-react';

const Reports = () => {
  const data = [
    { name: 'Apr', claims: 400, approved: 240 },
    { name: 'May', claims: 300, approved: 139 },
    { name: 'Jun', claims: 200, approved: 980 },
    { name: 'Jul', claims: 278, approved: 390 },
    { name: 'Aug', claims: 189, approved: 480 },
    { name: 'Sep', claims: 239, approved: 380 },
  ];

  return (
    <div className="reports-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Reports</h1>
          <p>Analytical view of system performance</p>
        </div>
        <div className="filter-group card" style={{ display: 'flex', gap: '16px', padding: '12px 20px', flexDirection: 'row', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select><option>FY 2023-24</option></select>
          <select><option>All Warehouses</option></select>
          <select><option>All Commodities</option></select>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Claims Trend</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="claims" stroke="var(--primary)" fillOpacity={1} fill="url(#colorClaims)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Approval Rate</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
