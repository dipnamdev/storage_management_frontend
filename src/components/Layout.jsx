import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Warehouse, 
  FileText, 
  Box, 
  BarChart2, 
  User, 
  LogOut,
  Moon,
  Sun,
  Plus
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'SUPER_ADMIN';

  const adminItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Warehouse', icon: <Warehouse size={20} />, path: '/admin/warehouses' },
    { name: 'Warehouse Bills', icon: <FileText size={20} />, path: '/admin/warehouse-bills' },
    { name: 'Commodity', icon: <Box size={20} />, path: '/admin/commodities' },
    { name: 'Reports', icon: <BarChart2 size={20} />, path: '/admin/reports' },
    { name: 'Profile', icon: <User size={20} />, path: '/admin/profile' },
  ];

  const managerItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/manager/dashboard' },
    { name: 'Claim List', icon: <FileText size={20} />, path: '/manager/warehouse-bills' },
    { name: 'Profile', icon: <User size={20} />, path: '/manager/profile' },
  ];

  const menuItems = isAdmin ? adminItems : managerItems;

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>{isAdmin ? 'SMS Admin' : 'SMS Manager'}</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const Topbar = ({ theme, toggleTheme }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';

  return (
    <header className="topbar">
      <div className="topbar-search">
        {/* Placeholder for search */}
      </div>
      <div className="topbar-actions">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="user-profile">
          <img src={`https://ui-avatars.com/api/?name=${name}&background=194ff0&color=fff`} alt="User" />
          <span>{name}</span>
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children, onLogout }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Set initial theme
  document.documentElement.setAttribute('data-theme', theme);

  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <div className="content-wrapper">
        <Topbar theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
