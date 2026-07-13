import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    totalInventoryValue: 0,
    lowStockItems: 0,
    expiredItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [salesRes, medicinesRes] = await Promise.all([
        axios.get(`${API_BASE}/sales/report/daily`),
        axios.get(`${API_BASE}/medicines`)
      ]);

      const salesData = salesRes.data[0] || {};
      const medicines = medicinesRes.data || [];

      const lowStockCount = medicines.filter(m => m.quantity <= 10).length;
      const expiredCount = medicines.filter(m => m.expiry_date && new Date(m.expiry_date) < new Date()).length;
      const inventoryValue = medicines.reduce((sum, m) => sum + (m.price * m.quantity), 0);

      setStats({
        totalSales: salesData.total_sales || 0,
        totalTransactions: salesData.total_transactions || 0,
        totalInventoryValue: inventoryValue,
        lowStockItems: lowStockCount,
        expiredItems: expiredCount
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard"><p>Loading...</p></div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Medical Store POS</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Sales</h3>
          <div className="value">₹{stats.totalSales.toFixed(2)}</div>
          <div className="change">+{stats.totalTransactions} transactions</div>
        </div>

        <div className="stat-card">
          <h3>Total Transactions</h3>
          <div className="value">{stats.totalTransactions}</div>
          <div className="change">Today</div>
        </div>

        <div className="stat-card">
          <h3>Inventory Value</h3>
          <div className="value">₹{stats.totalInventoryValue.toFixed(2)}</div>
          <div className="change">Total stock value</div>
        </div>

        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <div className="value" style={{ color: '#e67e22' }}>{stats.lowStockItems}</div>
          <div className="change">Need reorder</div>
        </div>

        <div className="stat-card">
          <h3>Expired Items</h3>
          <div className="value" style={{ color: '#e74c3c' }}>{stats.expiredItems}</div>
          <div className="change">Remove from stock</div>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          <a href="/checkout" className="btn btn-primary">Start Checkout</a>
          <a href="/inventory" className="btn btn-secondary">View Inventory</a>
          <a href="/customers" className="btn btn-secondary">Manage Customers</a>
          <a href="/reports" className="btn btn-secondary">View Reports</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
