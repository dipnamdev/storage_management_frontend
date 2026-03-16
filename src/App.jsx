import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Warehouses from './pages/Warehouses';
import AddWarehouse from './pages/AddWarehouse';
import EditWarehouse from './pages/EditWarehouse';
import Commodities from './pages/Commodities';
import Claims from './pages/Claims';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import SubmitClaim from './pages/SubmitClaim';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        <Route path="/login/admin" element={<LoginPage role="ADMIN" onLogin={login} />} />
        <Route path="/login/manager" element={<LoginPage role="MANAGER" onLogin={login} />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          isAuthenticated ? (
            <Layout onLogout={logout}>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="warehouses" element={<Warehouses />} />
                <Route path="warehouses/add" element={<AddWarehouse />} />
                <Route path="warehouses/edit/:id" element={<EditWarehouse />} />
                <Route path="claims" element={<Claims />} />
                <Route path="commodities" element={<Commodities />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </Layout>
          ) : <Navigate to="/login/admin" />
        } />

        {/* Manager Routes */}
        <Route path="/manager/*" element={
          isAuthenticated ? (
            <Layout onLogout={logout}>
              <Routes>
                <Route path="dashboard" element={<Dashboard isManager={true} />} />
                <Route path="claims" element={<Claims isManager={true} />} />
                <Route path="claims/submit" element={<SubmitClaim />} />
                <Route path="commodities" element={<Commodities />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </Layout>
          ) : <Navigate to="/login/manager" />
        } />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
