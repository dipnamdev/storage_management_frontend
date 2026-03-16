import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import api from '../api';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/warehouse');
      setWarehouses(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch warehouses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await api.delete(`/warehouse/delete/${id}`);
        fetchWarehouses();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete warehouse');
      }
    }
  };

  const filteredWarehouses = warehouses.filter(wh => 
    wh.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.warehouse_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.district_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="warehouse-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Warehouses</h1>
          <p>Manage storage units and their managers</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/warehouses/add')}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add Warehouse
        </button>
      </div>

      <div className="card table-card">
        <div className="card-header">
          <div className="input-with-icon" style={{ width: '300px' }}>
            <Search size={18} className="input-icon" />
            <input 
              type="text" 
              placeholder="Search warehouses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Warehouse Name</th>
                <th>Number</th>
                <th>District</th>
                <th>Branch</th>
                <th>Manager</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : filteredWarehouses.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No warehouses found</td></tr>
              ) : filteredWarehouses.map((wh) => (
                <tr key={wh.id}>
                  <td className="fw-500">{wh.warehouse_name}</td>
                  <td>{wh.warehouse_number}</td>
                  <td>{wh.district_name}</td>
                  <td>{wh.branch_name}</td>
                  <td>{wh.manager_name || `${wh.manager_first_name} ${wh.manager_last_name}`}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="icon-btn" 
                        title="Edit" 
                        onClick={() => navigate(`/admin/warehouses/edit/${wh.id}`)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="icon-btn text-danger" 
                        title="Delete"
                        onClick={() => handleDelete(wh.id)}
                      >
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
    </div>
  );
};

export default Warehouses;
