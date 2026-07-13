import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const Reports = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [topMedicines, setTopMedicines] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [selectedDate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [dailyRes, topRes] = await Promise.all([
        axios.get(`${API_BASE}/sales/report/daily?date=${selectedDate}`),
        axios.get(`${API_BASE}/sales/report/top-medicines`)
      ]);
      setDailyReport(dailyRes.data[0] || {});
      setTopMedicines(topRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}><p>Loading...</p></div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Reports & Analytics</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Date selector */}
      <div style={{ marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #bdc3c7' }}
        />
      </div>

      {/* Daily Report */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <div className="value">₹{(dailyReport.total_sales || 0).toFixed(2)}</div>
          <div className="change">for {selectedDate}</div>
        </div>

        <div className="stat-card">
          <h3>Total Transactions</h3>
          <div className="value">{dailyReport.total_transactions || 0}</div>
          <div className="change">Completed</div>
        </div>

        <div className="stat-card">
          <h3>Average Sale</h3>
          <div className="value">₹{(dailyReport.avg_sale || 0).toFixed(2)}</div>
          <div className="change">per transaction</div>
        </div>

        <div className="stat-card">
          <h3>Total Discount</h3>
          <div className="value">₹{(dailyReport.total_discount || 0).toFixed(2)}</div>
          <div className="change">Given to customers</div>
        </div>

        <div className="stat-card">
          <h3>Total Tax (GST)</h3>
          <div className="value">₹{(dailyReport.total_tax || 0).toFixed(2)}</div>
          <div className="change">Collected</div>
        </div>
      </div>

      {/* Top Selling Medicines */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Top Selling Medicines (All Time)</h2>
        <div className="table-container" style={{ marginTop: '15px' }}>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Medicine Name</th>
                <th>Quantity Sold</th>
                <th>Total Revenue</th>
                <th>Avg. Price per Unit</th>
              </tr>
            </thead>
            <tbody>
              {topMedicines.map((medicine, index) => (
                <tr key={medicine.id}>
                  <td style={{ fontWeight: 'bold' }}>#{index + 1}</td>
                  <td>{medicine.name}</td>
                  <td style={{ textAlign: 'center' }}>{medicine.total_quantity_sold}</td>
                  <td>₹{medicine.total_revenue.toFixed(2)}</td>
                  <td>₹{(medicine.total_revenue / medicine.total_quantity_sold).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Info */}
      <div style={{ marginTop: '30px', backgroundColor: '#ecf0f1', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
        <h3>Report Information</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Daily reports show sales data for the selected date</li>
          <li>Top medicines are ranked by total quantity sold (all-time)</li>
          <li>All amounts are in INR (₹)</li>
          <li>Discounts and taxes are tracked separately</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;
