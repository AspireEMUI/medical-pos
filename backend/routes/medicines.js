const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get all medicines
router.get('/', (req, res) => {
  db.all('SELECT * FROM medicines ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get medicine by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM medicines WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Medicine not found' });
      return;
    }
    res.json(row);
  });
});

// Add new medicine
router.post('/', (req, res) => {
  const { name, category, price, quantity, expiry_date, sku, manufacturer, batch_number } = req.body;
  const id = uuidv4();

  if (!name || !category || !price) {
    res.status(400).json({ error: 'Name, category, and price are required' });
    return;
  }

  db.run(
    `INSERT INTO medicines (id, name, category, price, quantity, expiry_date, sku, manufacturer, batch_number)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, category, price, quantity || 0, expiry_date, sku, manufacturer, batch_number],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, message: 'Medicine added successfully' });
    }
  );
});

// Update medicine
router.put('/:id', (req, res) => {
  const { name, category, price, quantity, expiry_date, sku, manufacturer, batch_number } = req.body;

  db.run(
    `UPDATE medicines SET name = ?, category = ?, price = ?, quantity = ?, expiry_date = ?, sku = ?, manufacturer = ?, batch_number = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, category, price, quantity, expiry_date, sku, manufacturer, batch_number, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Medicine not found' });
        return;
      }
      res.json({ message: 'Medicine updated successfully' });
    }
  );
});

// Delete medicine
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM medicines WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Medicine not found' });
      return;
    }
    res.json({ message: 'Medicine deleted successfully' });
  });
});

// Get low stock medicines
router.get('/stock/low', (req, res) => {
  const threshold = req.query.threshold || 10;
  db.all('SELECT * FROM medicines WHERE quantity <= ? ORDER BY quantity', [threshold], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get expired medicines
router.get('/stock/expired', (req, res) => {
  db.all('SELECT * FROM medicines WHERE expiry_date < DATE("now") AND expiry_date IS NOT NULL', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
