import React, { useState } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    first_name: user.first_name || 'Admin',
    last_name: user.last_name || 'User',
    email_id: user.email_id || 'admin@example.com',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully (Mock)');
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account details and security</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Personal Information</h3>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="text-danger">*</span></label>
                <input 
                  value={formData.first_name} 
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Last Name <span className="text-danger">*</span></label>
                <input 
                  value={formData.last_name} 
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email ID <span className="text-danger">*</span></label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  value={formData.email_id} 
                  onChange={(e) => setFormData({ ...formData, email_id: e.target.value })} 
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
              <Save size={18} style={{ marginRight: '8px' }} />
              Save Changes
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Security</h3>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="login-form">
            <div className="form-group">
              <label>Current Password <span className="text-danger">*</span></label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label>New Password <span className="text-danger">*</span></label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label>Confirm New Password <span className="text-danger">*</span></label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button className="btn btn-primary" style={{ width: 'fit-content' }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
