import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Lock, Mail, ShieldCheck, Warehouse } from 'lucide-react';

const LoginPage = ({ role, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/user/login', {
        email_id: email,
        password: password
      });

      const { token, user } = response.data;
      
      // Basic validation if role matches (if needed by backend, though backend usually handles this)
      if (role === 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized for Admin access');
      }
      if (role === 'MANAGER' && user.role !== 'WAREHOUSE_MANAGER') {
        throw new Error('Unauthorized for Manager access');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (onLogin) onLogin(token);

      if (user.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/manager/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <div className="login-icon">
            {role === 'ADMIN' ? <ShieldCheck size={32} /> : <Warehouse size={32} />}
          </div>
          <h1>{role === 'ADMIN' ? 'Admin Login' : 'Manager Login'}</h1>
          <p>Storage Management System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email Address <span className="text-danger">*</span></label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password <span className="text-danger">*</span></label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={() => navigate(role === 'ADMIN' ? '/login/manager' : '/login/admin')}>
            Login as {role === 'ADMIN' ? 'Warehouse Manager' : 'Admin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
