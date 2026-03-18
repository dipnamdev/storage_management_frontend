import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const AddWarehouse = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    warehouseData: {
      warehouse_name: '',
      warehouse_number: '',
      district_name: '',
      branch_name: '',
      gst_number: '',
      pan_number: '',
      pancard_holder: '',
      sr_no: '',
      deposit_name: '',
      warehouse_owner: ''
    },
    managerData: {
      first_name: '',
      last_name: '',
      email_id: '',
      password: ''
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/warehouse/create', formData);
      showToast('Warehouse added successfully', 'success');
      navigate('/admin/warehouses');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to add warehouse', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-warehouse-page">
      <div className="page-header">
        <button className="text-btn" onClick={() => navigate('/admin/warehouses')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ArrowLeft size={18} />
          Back to Warehouses
        </button>
        <h1>Add New Warehouse</h1>
        <p>Create a new storage unit and assign a manager</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 style={{ marginBottom: '24px', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Warehouse Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Warehouse Name <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.warehouse_name} onChange={(e) => handleChange('warehouseData', 'warehouse_name', e.target.value)} placeholder="e.g. Central Hub" />
              </div>
              <div className="form-group">
                <label>Warehouse Number <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.warehouse_number} onChange={(e) => handleChange('warehouseData', 'warehouse_number', e.target.value)} placeholder="e.g. WH-101" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>District <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.district_name} onChange={(e) => handleChange('warehouseData', 'district_name', e.target.value)} placeholder="e.g. Mumbai" />
              </div>
              <div className="form-group">
                <label>Branch <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.branch_name} onChange={(e) => handleChange('warehouseData', 'branch_name', e.target.value)} placeholder="e.g. South Hub" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Warehouse Owner <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.warehouse_owner} onChange={(e) => handleChange('warehouseData', 'warehouse_owner', e.target.value)} placeholder="Owner Name" />
              </div>
              <div className="form-group">
                <label>SR No <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.sr_no} onChange={(e) => handleChange('warehouseData', 'sr_no', e.target.value)} placeholder="SR Number" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>GST Number <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.gst_number} onChange={(e) => handleChange('warehouseData', 'gst_number', e.target.value)} placeholder="GSTIN" />
              </div>
              <div className="form-group">
                <label>PAN Number <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.pan_number} onChange={(e) => handleChange('warehouseData', 'pan_number', e.target.value)} placeholder="PAN" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pancard Holder <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.pancard_holder} onChange={(e) => handleChange('warehouseData', 'pancard_holder', e.target.value)} placeholder="Name on PAN" />
              </div>
              <div className="form-group">
                <label>Deposit Name <span className="text-danger">*</span></label>
                <input required value={formData.warehouseData.deposit_name} onChange={(e) => handleChange('warehouseData', 'deposit_name', e.target.value)} placeholder="Deposit Name" />
              </div>
            </div>
          </div>

          <div className="form-section" style={{ marginTop: '40px' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Manager Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="text-danger">*</span></label>
                <input required value={formData.managerData.first_name} onChange={(e) => handleChange('managerData', 'first_name', e.target.value)} placeholder="Manager's First Name" />
              </div>
              <div className="form-group">
                <label>Last Name <span className="text-danger">*</span></label>
                <input required value={formData.managerData.last_name} onChange={(e) => handleChange('managerData', 'last_name', e.target.value)} placeholder="Manager's Last Name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email ID <span className="text-danger">*</span></label>
                <input required type="email" value={formData.managerData.email_id} onChange={(e) => handleChange('managerData', 'email_id', e.target.value)} placeholder="manager@example.com" />
              </div>
              <div className="form-group">
                <label>Password <span className="text-danger">*</span></label>
                <input required type="password" value={formData.managerData.password} onChange={(e) => handleChange('managerData', 'password', e.target.value)} placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/warehouses')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Save Warehouse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWarehouse;
