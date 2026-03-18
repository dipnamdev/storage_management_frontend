import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const Commodities = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();
  
  const initialFormState = {
    commodityData: { name: '' },
    priceData: { financial_year: '2023-24', price_per_unit: '' }
  };
  const [formData, setFormData] = useState(initialFormState);
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm'
  });

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    setLoading(true);
    try {
      const response = await api.get('/commodity');
      setCommodities(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch commodities:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.commodity_id); // The update API needs the commodity_id
    setFormData({
      commodityData: { name: item.name },
      priceData: { financial_year: item.financial_year || '2023-24', price_per_unit: item.price_per_unit || '' }
    });
    setIsModalOpen(true);
  };

  const handleDelete = (priceId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Commodity Price',
      message: 'Are you sure you want to delete this price entry? This action cannot be undone.',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await api.delete(`/commodity/${priceId}`);
          showToast('Commodity deleted successfully', 'success');
          fetchCommodities();
        } catch (err) {
          showToast(err.response?.data?.error || 'Failed to delete commodity', 'error');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // ... (existing PUT logic stays the same)
        const payload = {
          name: formData.commodityData.name,
          financial_year: formData.priceData.financial_year,
          price_per_unit: formData.priceData.price_per_unit
        };
        await api.put(`/commodity/${editingId}`, payload);
        showToast('Commodity updated successfully', 'success');
        setIsModalOpen(false);
        fetchCommodities();
      } else {
        // Check if price already exists for this year
        const existing = commodities.find(c => 
          c.name.toLowerCase() === formData.commodityData.name.toLowerCase() && 
          c.financial_year === formData.priceData.financial_year
        );

        const performAdd = async () => {
          try {
            await api.post('/commodity/add', formData);
            showToast('Commodity saved successfully', 'success');
            setIsModalOpen(false);
            fetchCommodities();
          } catch (err) {
            showToast(err.response?.data?.error || 'Failed to save commodity', 'error');
          }
        };

        if (existing) {
          setConfirmModal({
            isOpen: true,
            title: 'Confirm Update',
            message: `${formData.commodityData.name} already has a price for ${formData.priceData.financial_year}. Do you want to update it?`,
            confirmText: 'Update',
            onConfirm: () => {
              performAdd();
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
          });
        } else {
          await performAdd();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save commodity', 'error');
    }
  };

  return (
    <div className="commodity-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Commodities</h1>
          <p>Manage commodity prices and financial years</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add Commodity
        </button>
      </div>

      <div className="card table-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Commodity Name</th>
                <th>Financial Year</th>
                <th>Price (per unit)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : commodities.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No commodities found</td></tr>
              ) : commodities.map((item) => (
                <tr key={item.price_id}>
                  <td className="fw-500">{item.name}</td>
                  <td>{item.financial_year}</td>
                  <td>₹{item.price_per_unit}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" title="Edit" onClick={() => openEditModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn text-danger" title="Delete" onClick={() => handleDelete(item.price_id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Commodity' : 'Add Commodity Price'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-btn"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Commodity Name <span className="text-danger">*</span></label>
                <input 
                  required 
                  placeholder="e.g. Rice"
                  value={formData.commodityData.name}
                  onChange={(e) => setFormData({ ...formData, commodityData: { name: e.target.value } })} 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Financial Year <span className="text-danger">*</span></label>
                  <select 
                    value={formData.priceData.financial_year}
                    onChange={(e) => setFormData({ ...formData, priceData: { ...formData.priceData, financial_year: e.target.value } })}
                  >
                    <option>2023-24</option>
                    <option>2024-25</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price per unit <span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    placeholder="0.00"
                    value={formData.priceData.price_per_unit}
                    onChange={(e) => setFormData({ ...formData, priceData: { ...formData.priceData, price_per_unit: e.target.value } })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Save Commodity'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{confirmModal.title}</h2>
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                className="close-btn"
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {confirmModal.message}
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </button>
              <button 
                className={`btn ${confirmModal.confirmText === 'Delete' ? 'btn-danger' : 'btn-primary'}`}
                onClick={confirmModal.onConfirm}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commodities;
