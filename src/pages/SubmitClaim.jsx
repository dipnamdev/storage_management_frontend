import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const SubmitClaim = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
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

  // Aligning with POST /billing/add requirements
  const [formData, setFormData] = useState({
    depositor_name: '',
    depositor_gst: '',
    commodity_id: '',
    bill_no: '',
    claim_month: (new Date().getMonth() + 1),
    financial_year: '',
    taxable_amount: '',
    inbound_time: '',
    outbound_time: ''
  });

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const response = await api.get('/commodity');
      setCommodities(response.data.data || response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/billing/add', formData);
      showToast('Bill submitted successfully', 'success');
      navigate('/manager/warehouse-bills');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to submit bill', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-claim-page">
      <div className="page-header">
        <button className="text-btn" onClick={() => navigate('/manager/warehouse-bills')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ArrowLeft size={18} />
          Back to Claim List
        </button>
        <h1>Submit New Bill</h1>
        <p>Record a new warehouse bill to generate a claim request</p>
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
                  <option key={c.commodity_id} value={c.commodity_id}>{c.name} ({c.financial_year})</option>
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
            <div className="form-group">
              <label>SGST(9%) <span className="text-danger">*</span></label>
              <input 
                readOnly
                type="number" 
                step="0.01"
                name="SGST"
                value={(formData.taxable_amount*9)/100}
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group">
              <label>CGST(9%) <span className="text-danger">*</span></label>
              <input 
                readOnly
                type="number" 
                step="0.01"
                name="CGST"
                value={(formData.taxable_amount*9)/100}
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group">
              <label>Total Amount (Taxable Amount + SGST + CGST) <span className="text-danger">*</span></label>
              <input 
                readOnly
                type="number" 
                step="0.01"
                name="total_amount"
                value={  Number(formData.taxable_amount) +
               (Number(formData.taxable_amount) * 18) / 100}
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Inbound Date <span className="text-danger">*</span></label>
              <input 
                required 
                type="date" 
                name="inbound_time"
                value={formData.inbound_time}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Outbound Date</label>
              <input 
                type="date" 
                name="outbound_time"
                value={formData.outbound_time}
                onChange={handleInputChange}
              />
            </div>
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
