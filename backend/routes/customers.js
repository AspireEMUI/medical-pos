const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get all customers
router.get('/', (req, res) => {
  db.all('SELECT * FROM customers ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get customer by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(row);
  });
});

// Add new customer
router.post('/', (req, res) => {
  const { name, phone, email, address } = req.body;
  const id = uuidv4();

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  db.run(
    `INSERT INTO customers (id, name, phone, email, address)
     VALUES (?, ?, ?, ?, ?)`,
    [id, name, phone, email, address],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, message: 'Customer added successfully' });
    }
  );
});

// Update customer
router.put('/:id', (req, res) => {
  const { name, phone, email, address } = req.body;

  db.run(
    `UPDATE customers SET name = ?, phone = ?, email = ?, address = ?
     WHERE id = ?`,
    [name, phone, email, address, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json({ message: 'Customer updated successfully' });
    }
  );
});

// Delete customer
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM customers WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

module.exports = router;
