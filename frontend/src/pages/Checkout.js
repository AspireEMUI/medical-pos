import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiMinus, FiX } from 'react-icons/fi';

const API_BASE = 'http://localhost:5000/api';

const Checkout = () => {
  const [medicines, setMedicines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medRes, custRes] = await Promise.all([
        axios.get(`${API_BASE}/medicines`),
        axios.get(`${API_BASE}/customers`)
      ]);
      setMedicines(medRes.data);
      setCustomers(custRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (medicine) => {
    if (medicine.quantity <= 0) {
      setError('This medicine is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.medicine_id === medicine.id);

    if (existingItem) {
      if (existingItem.quantity < medicine.quantity) {
        setCart(cart.map(item =>
          item.medicine_id === medicine.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unit_price }
            : item
        ));
      } else {
        setError('Cannot add more than available stock');
      }
    } else {
      setCart([...cart, {
        medicine_id: medicine.id,
        medicine_name: medicine.name,
        quantity: 1,
        unit_price: medicine.price,
        total: medicine.price,
        available_stock: medicine.quantity
      }]);
    }
    setError(null);
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.medicine_id !== medicineId));
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }

    const item = cart.find(i => i.medicine_id === medicineId);
    if (newQuantity > item.available_stock) {
      setError('Cannot exceed available stock');
      return;
    }

    setCart(cart.map(item =>
      item.medicine_id === medicineId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.unit_price }
        : item
    ));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    return subtotal - discount + tax;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      const items = cart.map(item => ({
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total
      }));

      const response = await axios.post(`${API_BASE}/sales`, {
        customer_id: selectedCustomer || null,
        items,
        discount: parseFloat(discount),
        tax: parseFloat(tax),
        payment_method: paymentMethod
      });

      setSuccess(`Sale completed! Bill ID: ${response.data.id}`);
      setCart([]);
      setDiscount(0);
      setTax(0);
      setSelectedCustomer('');
      setError(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to complete checkout');
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}><p>Loading...</p></div>;

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const total = calculateTotal();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Checkout</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px' }}>
        {/* Left side - Medicine selection */}
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Select Medicines</h2>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {filteredMedicines.map(medicine => (
                <div
                  key={medicine.id}
                  style={{
                    border: '1px solid #bdc3c7',
                    borderRadius: '4px',
                    padding: '15px',
                    backgroundColor: medicine.quantity > 0 ? 'white' : '#ecf0f1'
                  }}
                >
                  <h4>{medicine.name}</h4>
                  <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '5px 0' }}>
                    {medicine.category} | SKU: {medicine.sku || 'N/A'}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '10px 0' }}>
                    ₹{medicine.price}
                  </p>
                  <p style={{ fontSize: '12px', color: medicine.quantity <= 10 ? '#e74c3c' : '#27ae60', marginBottom: '10px' }}>
                    Stock: {medicine.quantity}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(medicine)}
                    disabled={medicine.quantity <= 0}
                    style={{ width: '100%' }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Cart and checkout */}
        <div>
          <div className="cart-container" style={{ position: 'sticky', top: '20px' }}>
            <h2>Shopping Cart ({cart.length})</h2>

            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>Cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.medicine_id} className="cart-item" style={{ display: 'block', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong>{item.medicine_name}</strong>
                      <button className="btn btn-danger" onClick={() => removeFromCart(item.medicine_id)} style={{ padding: '5px 10px' }}>
                        <FiX />
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span>₹{item.unit_price}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => updateQuantity(item.medicine_id, item.quantity - 1)}
                          style={{ padding: '5px 10px' }}
                        >
                          <FiMinus />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.medicine_id, parseInt(e.target.value))}
                          style={{ width: '50px', textAlign: 'center', padding: '5px' }}
                        />
                        <button
                          className="btn btn-secondary"
                          onClick={() => updateQuantity(item.medicine_id, item.quantity + 1)}
                          style={{ padding: '5px 10px' }}
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold', paddingTop: '10px', borderTop: '1px solid #ecf0f1' }}>
                      ₹{item.total.toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <label>Discount:</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      style={{ width: '80px', padding: '5px' }}
                      step="0.01"
                    />
                  </div>
                  <div className="summary-row">
                    <label>Tax (GST):</label>
                    <input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                      style={{ width: '80px', padding: '5px' }}
                      step="0.01"
                    />
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Customer (Optional)</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                  >
                    <option value="">Walk-in Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="digital">Digital Wallet</option>
                  </select>
                </div>

                <button className="btn btn-success" onClick={handleCheckout} style={{ width: '100%', padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                  Complete Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
