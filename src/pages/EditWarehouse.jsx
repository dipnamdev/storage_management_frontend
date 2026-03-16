import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';

const EditWarehouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    district_name: '',
    branch_name: '',
    warehouse_name: '',
    warehouse_number: '',
    gst_number: '',
    pan_number: '',
    pancard_holder: '',
    sr_no: '',
    deposit_name: '',
    warehouse_owner: ''
  });

  useEffect(() => {
    fetchWarehouse();
  }, [id]);

  const fetchWarehouse = async () => {
    try {
      const response = await api.get(`/warehouse/${id}`);
      const data = response.data.data;
      setFormData({
        district_name: data.district_name || '',
        branch_name: data.branch_name || '',
        warehouse_name: data.warehouse_name || '',
        warehouse_number: data.warehouse_number || '',
        gst_number: data.gst_number || '',
        pan_number: data.pan_number || '',
        pancard_holder: data.pancard_holder || '',
        sr_no: data.sr_no || '',
        deposit_name: data.deposit_name || '',
        warehouse_owner: data.warehouse_owner || ''
      });
    } catch (err) {
      alert('Failed to fetch warehouse details');
      navigate('/admin/warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/warehouse/update/${id}`, formData);
      navigate('/admin/warehouses');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update warehouse');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="main-content">Loading...</div>;
  }

  return (
    <div className="edit-warehouse-page">
      <div className="page-header">
        <button className="text-btn" onClick={() => navigate('/admin/warehouses')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ArrowLeft size={18} />
          Back to Warehouses
        </button>
        <h1>Edit Warehouse</h1>
        <p>Update warehouse information</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 style={{ marginBottom: '24px', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Warehouse Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Warehouse Name <span className="text-danger">*</span></label>
                <input required value={formData.warehouse_name} onChange={(e) => handleChange('warehouse_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Warehouse Number <span className="text-danger">*</span></label>
                <input required value={formData.warehouse_number} onChange={(e) => handleChange('warehouse_number', e.target.value)} />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>District <span className="text-danger">*</span></label>
                <input required value={formData.district_name} onChange={(e) => handleChange('district_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Branch <span className="text-danger">*</span></label>
                <input required value={formData.branch_name} onChange={(e) => handleChange('branch_name', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Warehouse Owner <span className="text-danger">*</span></label>
                <input required value={formData.warehouse_owner} onChange={(e) => handleChange('warehouse_owner', e.target.value)} />
              </div>
              <div className="form-group">
                <label>SR No <span className="text-danger">*</span></label>
                <input required value={formData.sr_no} onChange={(e) => handleChange('sr_no', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>GST Number <span className="text-danger">*</span></label>
                <input required value={formData.gst_number} onChange={(e) => handleChange('gst_number', e.target.value)} />
              </div>
              <div className="form-group">
                <label>PAN Number <span className="text-danger">*</span></label>
                <input required value={formData.pan_number} onChange={(e) => handleChange('pan_number', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pancard Holder <span className="text-danger">*</span></label>
                <input required value={formData.pancard_holder} onChange={(e) => handleChange('pancard_holder', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Deposit Name <span className="text-danger">*</span></label>
                <input required value={formData.deposit_name} onChange={(e) => handleChange('deposit_name', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/warehouses')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWarehouse;
