const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get all sales
router.get('/', (req, res) => {
  db.all(`
    SELECT s.*, c.name as customer_name
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.id
    ORDER BY s.created_at DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get sale by ID with items
router.get('/:id', (req, res) => {
  db.get(`
    SELECT s.*, c.name as customer_name
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.id
    WHERE s.id = ?
  `, [req.params.id], (err, sale) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!sale) {
      res.status(404).json({ error: 'Sale not found' });
      return;
    }

    // Get sale items
    db.all(`
      SELECT si.*, m.name as medicine_name
      FROM sale_items si
      JOIN medicines m ON si.medicine_id = m.id
      WHERE si.sale_id = ?
    `, [req.params.id], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ ...sale, items });
    });
  });
});

// Create new sale (checkout)
router.post('/', (req, res) => {
  const { customer_id, items, discount = 0, tax = 0, payment_method = 'cash' } = req.body;

  if (!items || items.length === 0) {
    res.status(400).json({ error: 'Cart is empty' });
    return;
  }

  const saleId = uuidv4();
  let total_amount = 0;

  // Calculate total
  items.forEach(item => {
    total_amount += item.total;
  });

  total_amount = total_amount - discount + tax;

  // Start transaction
  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Insert sale
    db.run(
      `INSERT INTO sales (id, customer_id, total_amount, discount, tax, payment_method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [saleId, customer_id, total_amount, discount, tax, payment_method],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          res.status(500).json({ error: err.message });
          return;
        }

        // Insert sale items and update inventory
        let itemsProcessed = 0;
        let hasError = false;

        items.forEach(item => {
          if (hasError) return;

          const itemId = uuidv4();

          // Insert sale item
          db.run(
            `INSERT INTO sale_items (id, sale_id, medicine_id, quantity, unit_price, total)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [itemId, saleId, item.medicine_id, item.quantity, item.unit_price, item.total],
            (err) => {
              if (err) {
                hasError = true;
                db.run('ROLLBACK');
                res.status(500).json({ error: err.message });
                return;
              }

              // Update medicine quantity
              db.run(
                `UPDATE medicines SET quantity = quantity - ? WHERE id = ?`,
                [item.quantity, item.medicine_id],
                (err) => {
                  if (err) {
                    hasError = true;
                    db.run('ROLLBACK');
                    res.status(500).json({ error: err.message });
                    return;
                  }

                  itemsProcessed++;

                  // If all items processed, commit
                  if (itemsProcessed === items.length) {
                    db.run('COMMIT', (err) => {
                      if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                      }
                      res.status(201).json({
                        id: saleId,
                        total_amount,
                        message: 'Sale completed successfully'
                      });
                    });
                  }
                }
              );
            }
          );
        });
      }
    );
  });
});

// Get sales report (by date range)
router.get('/report/daily', (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];

  db.all(`
    SELECT
      DATE(created_at) as date,
      COUNT(*) as total_transactions,
      SUM(total_amount) as total_sales,
      AVG(total_amount) as avg_sale,
      SUM(discount) as total_discount,
      SUM(tax) as total_tax
    FROM sales
    WHERE DATE(created_at) = ?
    GROUP BY DATE(created_at)
  `, [targetDate], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get monthly sales report
router.get('/report/monthly', (req, res) => {
  const { month, year } = req.query;
  const targetMonth = month || new Date().getMonth() + 1;
  const targetYear = year || new Date().getFullYear();

  db.all(`
    SELECT
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as total_transactions,
      SUM(total_amount) as total_sales,
      AVG(total_amount) as avg_sale,
      SUM(discount) as total_discount,
      SUM(tax) as total_tax
    FROM sales
    WHERE strftime('%m', created_at) = ? AND strftime('%Y', created_at) = ?
    GROUP BY strftime('%Y-%m', created_at)
  `, [String(targetMonth).padStart(2, '0'), String(targetYear)], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get top selling medicines
router.get('/report/top-medicines', (req, res) => {
  db.all(`
    SELECT
      m.id,
      m.name,
      SUM(si.quantity) as total_quantity_sold,
      SUM(si.total) as total_revenue
    FROM sale_items si
    JOIN medicines m ON si.medicine_id = m.id
    GROUP BY m.id, m.name
    ORDER BY total_quantity_sold DESC
    LIMIT 10
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
