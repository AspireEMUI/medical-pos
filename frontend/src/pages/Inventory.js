import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const API_BASE = 'http://localhost:5000/api';

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    expiry_date: '',
    sku: '',
    manufacturer: '',
    batch_number: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/medicines`);
      setMedicines(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch medicines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/medicines/${editingId}`, formData);
      } else {
        await axios.post(`${API_BASE}/medicines`, formData);
      }
      fetchMedicines();
      resetForm();
      setError(null);
    } catch (err) {
      setError('Failed to save medicine');
      console.error(err);
    }
  };

  const handleEdit = (medicine) => {
    setFormData(medicine);
    setEditingId(medicine.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await axios.delete(`${API_BASE}/medicines/${id}`);
        fetchMedicines();
        setError(null);
      } catch (err) {
        setError('Failed to delete medicine');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      expiry_date: '',
      sku: '',
      manufacturer: '',
      batch_number: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  if (loading) return <div style={{ padding: '20px' }}><p>Loading...</p></div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Inventory Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus style={{ marginRight: '5px' }} /> Add Medicine
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Manufacturer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(medicine => (
              <tr key={medicine.id}>
                <td>{medicine.name}</td>
                <td>{medicine.category}</td>
                <td>{medicine.sku || '-'}</td>
                <td>₹{medicine.price}</td>
                <td style={{ color: medicine.quantity <= 10 ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                  {medicine.quantity}
                </td>
                <td>{medicine.expiry_date ? new Date(medicine.expiry_date).toLocaleDateString() : '-'}</td>
                <td>{medicine.manufacturer || '-'}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(medicine)} style={{ marginRight: '5px' }}>
                    <FiEdit2 />
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(medicine.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Medicine Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Manufacturer</label>
                <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Batch Number</label>
                <input type="text" name="batch_number" value={formData.batch_number} onChange={handleInputChange} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-success">Save</button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
