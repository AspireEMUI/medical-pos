const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const medicineRoutes = require('./routes/medicines');
const customerRoutes = require('./routes/customers');
const saleRoutes = require('./routes/sales');

// Use routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', saleRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Medical POS Backend running on http://localhost:${PORT}`);
});

module.exports = app;
