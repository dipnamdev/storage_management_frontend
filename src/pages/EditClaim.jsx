import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const EditClaim = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [commodities, setCommodities] = useState([]);
  
  const financialYears = (() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -2; i <= 2; i++) {
      const startYear = currentYear + i;
      const endYear = (startYear + 1).toString().slice(-2);
      years.push(`${startYear}-${endYear}`);
    }
    return years;
  })();

  const [formData, setFormData] = useState({
    depositor_name: '',
    depositor_gst: '',
    commodity_id: '',
    bill_no: '',
    claim_month: (new Date().getMonth() + 1).toString(),
    financial_year: '',
    taxable_amount: ''
  });

  useEffect(() => {
    fetchCommodities();
    fetchBillDetails();
  }, [id]);

  const fetchCommodities = async () => {
    try {
      const response = await api.get('/commodity');
      setCommodities(response.data.data || response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBillDetails = async () => {
    setFetching(true);
    try {
      const response = await api.get(`/billing/${id}`);
      const data = response.data.data || response.data;
      
      // Pre-fill form
      setFormData({
        depositor_name: data.depositor_name || '',
        depositor_gst: data.depositor_gst || '',
        commodity_id: data.commodity_id || '',
        bill_no: data.bill_no || '',
        claim_month: data.claim_month || '',
        financial_year: data.financial_year || '',
        taxable_amount: data.taxable_amount || ''
      });
    } catch (err) {
      showToast('Failed to load bill details. It might not exist.', 'error');
      navigate('/manager/warehouse-bills');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/billing/${id}`, formData);
      showToast('Edit request submitted successfully. It is now pending admin approval.', 'success');
      navigate('/manager/warehouse-bills');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to submit edit request', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="submit-claim-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p>Loading bill details...</p>
      </div>
    );
  }

  return (
    <div className="submit-claim-page">
      <div className="page-header">
        <button className="text-btn" onClick={() => navigate('/manager/warehouse-bills')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ArrowLeft size={18} />
          Back to Claim List
        </button>
        <h1>Edit Claim (Bill) #{id}</h1>
        <p>Propose changes to this bill. Changes require admin approval.</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-row">
            <div className="form-group">
              <label>Depositor Name <span className="text-danger">*</span></label>
              <input 
                required 
                type="text" 
                name="depositor_name"
                value={formData.depositor_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Depositor GST</label>
              <input 
                type="text" 
                name="depositor_gst"
                value={formData.depositor_gst}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Commodity <span className="text-danger">*</span></label>
              <select 
                required 
                name="commodity_id"
                value={formData.commodity_id}
                onChange={handleInputChange}
              >
                <option value="">Select a commodity</option>
                {commodities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Bill No <span className="text-danger">*</span></label>
              <input 
                required 
                type="text" 
                name="bill_no"
                value={formData.bill_no}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Claim Month (Auto-detected)<span className="text-danger">*</span></label>
              <input 
                required 
                type="number" 
                name="claim_month"
                readOnly
                value={formData.claim_month}
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group">
              <label>Financial Year <span className="text-danger">*</span></label>
              <select 
                required 
                name="financial_year"
                value={formData.financial_year}
                onChange={handleInputChange}
              >
                <option value="">Select Financial Year</option>
                {financialYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Taxable Amount (₹) <span className="text-danger">*</span></label>
              <input 
                required 
                type="number" 
                step="0.01"
                name="taxable_amount"
                value={formData.taxable_amount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Edit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClaim;
