import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, Plus, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';

const WarehouseBills = ({ isManager }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    district: '',
    status: ''
  });

  // Modals state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount_passed: '',
    payment_mode: 'NEFT',
    instrument_no: '',
    payment_date: '',
    advice_no: '',
    advice_date: '',
    remarks: ''
  });

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    fetchBills();
  }, [isManager, filters]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      if (isManager) {
        const response = await api.get('/billing/my');
        setBills(response.data.data || response.data);
      } else {
        const queryParams = new URLSearchParams();
        if (filters.district) queryParams.append('district', filters.district);
        if (filters.status) queryParams.append('status', filters.status);
        const url = `/billing${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await api.get(url);
        setBills(response.data.data || response.data);
      }
    } catch (err) {
      console.error('Failed to fetch bills', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openApproveModal = (id) => {
    setSelectedBillId(id);
    setPaymentData({
      amount_passed: '',
      payment_mode: '',
      instrument_no: '',
      payment_date: '',
      advice_no: '',
      advice_date: '',
      remarks: ''
    });
    setPaymentModalOpen(true);
  };

  const handleApproveAndPay = async (e) => {
    e.preventDefault();
    try {
      // First approve the bill
      await api.patch(`/billing/approve/${selectedBillId}`);
      
      // Then record payment
      await api.post(`/billing/payment/${selectedBillId}`, {
        ...paymentData,
        amount_passed: parseFloat(paymentData.amount_passed)
      });

      showToast('Bill approved and payment recorded successfully', 'success');
      setPaymentModalOpen(false);
      fetchBills();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to process approval and payment', 'error');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this bill?')) {
      try {
        await api.patch(`/billing/reject/${id}`);
        showToast('Bill rejected successfully', 'success');
        fetchBills();
      } catch (err) {
        showToast(err.response?.data?.error || 'Failed to reject bill', 'error');
      }
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await api.get(`/billing/${id}`);
      setSelectedDetails(response.data.data || response.data);
      setDetailsModalOpen(true);
    } catch (err) {
      showToast('Failed to fetch bill details', 'error');
    }
  };
  return (
    <div className="claims-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{isManager ? 'All Claims' : 'All Warehouse Bills'}</h1>
          <p>{isManager ? 'Manage and track claim status' : 'Review, approve, and process payments for bills'}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isManager && (
            <>
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
                Import Claims
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/manager/warehouse-bills/submit')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} />
                Add New Claim
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card table-card">
        {!isManager && (
          <div className="card-header" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="input-with-icon" style={{ width: '250px' }}>
              <Filter size={18} className="input-icon" />
              <input 
                type="text" 
                name="district"
                placeholder="Filter by District..." 
                value={filters.district}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group" style={{ width: '200px', marginBottom: 0 }}>
              <select name="status" value={filters.status} onChange={handleFilterChange} style={{ height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', width: '100%' }}>
                <option value="">All Statuses</option>
                <option value="PENDING_APPROVAL">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="table-container">
          <table className="claim-table">
            <thead>
              {isManager ? (
                <tr>
                  <th>DISTRICT</th>
                  <th>BRANCH</th>
                  <th>WAREHOUSE</th>
                  <th>COMMODITY</th>
                  <th>TOTAL AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              ) : (
                <tr>
                  <th>Bill ID</th>
                  <th>Warehouse</th>
                  <th>District</th>
                  <th>Depositor</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={isManager ? 7 : 7} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : bills.length === 0 ? (
                <tr><td colSpan={isManager ? 7 : 7} style={{ textAlign: 'center', padding: '40px' }}>No claims found</td></tr>
              ) : bills.map((bill) => (
                <tr key={bill.id}>
                  {isManager ? (
                    <>
                      <td>{bill.district_name || '-'}</td>
                      <td>{bill.branch_name || '-'}</td>
                      <td>{bill.warehouse_name || '-'}</td>
                      <td>{bill.commodity_name || bill.commodity || '-'}</td>
                      <td>₹{bill.total_amount}</td>
                      <td>
                        <span className={`badge badge-${bill.status?.toLowerCase().replace('_', '-')}`}>
                          {bill.status === 'PENDING_APPROVAL' ? 'Pending' : 
                           bill.status === 'APPROVED' ? 'Approved' : 
                           bill.status === 'PAID' ? 'Paid' : 
                           bill.status === 'REJECTED' ? 'Rejected' : bill.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="icon-btn"
              title="View Details"
              onClick={() => navigate(`${isManager ? '/manager' : '/admin'}/bills/${bill.id}`)}
            >
              <Eye size={18} />
            </button>
                          {bill.status === 'PENDING_APPROVAL' && (
                            <button 
                              className="text-btn-blue" 
                              style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                              onClick={() => navigate(`/manager/warehouse-bills/edit/${bill.id}`)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="fw-500">{bill.id}</td>
                      <td>{bill.warehouse_name}</td>
                      <td>{bill.district_name}</td>
                      <td>{bill.depositor_name}</td>
                      <td>₹{bill.total_amount}</td>
                      <td>
                        <span className={`badge badge-${bill.status?.toLowerCase().replace('_', '-')}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="icon-btn"
                            title="View Details"
                            onClick={() => navigate(`${isManager ? '/manager' : '/admin'}/bills/${bill.id}`)}
                          >
                            <Eye size={18} />
                          </button>
                          {bill.status === 'PENDING_APPROVAL' && (
                            <>
                              <button 
                                className="icon-btn" 
                                style={{ color: '#10b981' }} 
                                title="Approve & Pay"
                                onClick={() => openApproveModal(bill.id)}
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                className="icon-btn text-danger" 
                                title="Reject"
                                onClick={() => handleReject(bill.id)}
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {paymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Approve & Generate Payment</h2>
              <button onClick={() => setPaymentModalOpen(false)} className="close-btn"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleApproveAndPay}>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount Passed <span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={paymentData.amount_passed}
                    onChange={(e) => setPaymentData({...paymentData, amount_passed: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Mode <span className="text-danger">*</span></label>
                  <select 
                    required 
                    value={paymentData.payment_mode}
                    onChange={(e) => setPaymentData({...paymentData, payment_mode: e.target.value})}
                  >
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                    <option value="IMPS">IMPS</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Instrument No <span className="text-danger">*</span></label>
                  <input 
                    required 
                    value={paymentData.instrument_no}
                    onChange={(e) => setPaymentData({...paymentData, instrument_no: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Date <span className="text-danger">*</span></label>
                  <input 
                    type="date"
                    required 
                    value={paymentData.payment_date}
                    onChange={(e) => setPaymentData({...paymentData, payment_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Advice No</label>
                  <input 
                    value={paymentData.advice_no}
                    onChange={(e) => setPaymentData({...paymentData, advice_no: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Advice Date</label>
                  <input 
                    type="date"
                    value={paymentData.advice_date}
                    onChange={(e) => setPaymentData({...paymentData, advice_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Remarks</label>
                <textarea 
                  rows="3"
                  value={paymentData.remarks}
                  onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPaymentModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {detailsModalOpen && selectedDetails && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Bill Details #{selectedDetails.id}</h2>
              <button onClick={() => setDetailsModalOpen(false)} className="close-btn"><X size={24} /></button>
            </div>
            
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Warehouse Info</h4>
                  <p><strong>Name:</strong> {selectedDetails.warehouse_name}</p>
                  <p><strong>Status:</strong> <span className={`badge badge-${selectedDetails.status?.toLowerCase().replace('_', '-')}`}>{selectedDetails.status}</span></p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Depositor Info</h4>
                  <p><strong>Name:</strong> {selectedDetails.depositor_name}</p>
                  <p><strong>GST:</strong> {selectedDetails.depositor_gst}</p>
                  <p><strong>Bill No:</strong> {selectedDetails.bill_no}</p>
                </div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Financial Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Taxable Amount</p>
                    <p style={{ fontWeight: '500' }}>₹{selectedDetails.taxable_amount}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CGST (9%)</p>
                    <p style={{ fontWeight: '500' }}>₹{selectedDetails.cgst}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>SGST (9%)</p>
                    <p style={{ fontWeight: '500' }}>₹{selectedDetails.sgst}</p>
                  </div>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600' }}>Total Amount</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>₹{selectedDetails.total_amount}</span>
                </div>
              </div>

              {selectedDetails.status === 'PAID' && (
                <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '8px', border: '1px solid #10b981' }}>
                  <h4 style={{ color: '#047857', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Payment Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: '#065f46' }}>
                    <p><strong>Amount Passed:</strong> ₹{selectedDetails.amount_passed}</p>
                    <p><strong>Mode:</strong> {selectedDetails.payment_mode}</p>
                    <p><strong>Instrument No:</strong> {selectedDetails.instrument_no}</p>
                    <p><strong>Payment Date:</strong> {selectedDetails.payment_date ? new Date(selectedDetails.payment_date).toLocaleDateString() : 'N/A'}</p>
                    {selectedDetails.remarks && <p style={{ gridColumn: 'span 2' }}><strong>Remarks:</strong> {selectedDetails.remarks}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDetailsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WarehouseBills;
