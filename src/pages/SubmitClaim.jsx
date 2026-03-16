import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';

const SubmitClaim = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commodities, setCommodities] = useState([]);
  const [formData, setFormData] = useState({
    commodity_id: '',
    quantity: '',
    claim_details: ''
  });

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      // Small mock for now since we don't have a GET /commodity list endpoint that is stable
      setCommodities([
        { id: 1, name: 'Rice' },
        { id: 2, name: 'Wheat' },
        { id: 3, name: 'Maize' }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/claim/submit', formData);
      alert('Claim submitted successfully');
      navigate('/manager/claims');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-claim-page">
      <div className="page-header">
        <button className="text-btn" onClick={() => navigate('/manager/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <h1>Submit Storage Claim</h1>
        <p>Request approval for a new storage item</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Commodity <span className="text-danger">*</span></label>
            <select 
              required 
              value={formData.commodity_id}
              onChange={(e) => setFormData({ ...formData, commodity_id: e.target.value })}
            >
              <option value="">Select a commodity</option>
              {commodities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity <span className="text-danger">*</span></label>
            <input 
              required 
              type="text" 
              placeholder="e.g. 500kg" 
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Claim Details</label>
            <textarea 
              rows="4" 
              placeholder="Add any additional notes..."
              value={formData.claim_details}
              onChange={(e) => setFormData({ ...formData, claim_details: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitClaim;
