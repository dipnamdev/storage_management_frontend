import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Claims = ({ isManager }) => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, [isManager]);

  const fetchClaims = async () => {
    try {
      // In a real app, use different endpoints:
      // Admin: /api/claim/all
      // Manager: /api/claim/my-claims
      // For now using mock to show the UI structure
      const mockClaims = [
        { id: 'CLM-001', warehouse: 'Main Station', commodity: 'Rice', qty: '500kg', status: 'Approved', date: '2024-03-10' },
        { id: 'CLM-002', warehouse: 'West Wing', commodity: 'Wheat', qty: '300kg', status: 'Pending', date: '2024-03-12' },
        { id: 'CLM-003', warehouse: 'North Store', commodity: 'Maize', qty: '450kg', status: 'Rejected', date: '2024-03-14' },
      ];
      setClaims(mockClaims);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handeAction = async (id, action) => {
    if (window.confirm(`Are you sure you want to ${action} this claim?`)) {
      try {
        await api.put(`/claim/${action}/${id}`);
        fetchClaims();
      } catch (err) {
        alert(`Failed to ${action} claim`);
      }
    }
  };

  return (
    <div className="claims-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{isManager ? 'My Claims' : 'All Claims'}</h1>
          <p>{isManager ? 'Track your submitted storage claims' : 'Review and manage warehouse claims'}</p>
        </div>
        {isManager && (
          <button className="btn btn-primary" onClick={() => navigate('/manager/claims/submit')}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            Submit New Claim
          </button>
        )}
      </div>

      <div className="card table-card">
        <div className="card-header">
          <div className="input-with-icon" style={{ width: '300px' }}>
            <Search size={18} className="input-icon" />
            <input type="text" placeholder="Search claims..." />
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                {!isManager && <th>Warehouse</th>}
                <th>Commodity</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : claims.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No claims found</td></tr>
              ) : claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="fw-500">{claim.id}</td>
                  {!isManager && <td>{claim.warehouse}</td>}
                  <td>{claim.commodity}</td>
                  <td>{claim.qty}</td>
                  <td>
                    <span className={`badge badge-${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>{claim.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" title="View Details"><Eye size={18} /></button>
                      {!isManager && claim.status === 'Pending' && (
                        <>
                          <button 
                            className="icon-btn" 
                            style={{ color: '#10b981' }} 
                            title="Approve"
                            onClick={() => handeAction(claim.id, 'approve')}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            className="icon-btn text-danger" 
                            title="Reject"
                            onClick={() => handeAction(claim.id, 'reject')}
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Claims;
