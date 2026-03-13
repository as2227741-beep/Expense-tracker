const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Get all expenses for user
router.get('/', (req, res) => {
  const { month, year, type, category } = req.query;
  let query = 'SELECT * FROM expenses WHERE user_id = ?';
  const params = [req.userId];

  if (month && year) {
    query += ` AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`;
    params.push(String(month).padStart(2, '0'), year);
  }
  if (type) { query += ' AND type = ?'; params.push(type); }
  if (category) { query += ' AND category = ?'; params.push(category); }

  query += ' ORDER BY date DESC, created_at DESC';
  const expenses = db.prepare(query).all(...params);
  res.json(expenses);
});

// Get summary stats
router.get('/summary', (req, res) => {
  const { month, year } = req.query;
  let dateFilter = '';
  const params = [req.userId];

  if (month && year) {
    dateFilter = `AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`;
    params.push(String(month).padStart(2, '0'), year);
  }

  const income = db.prepare(
    `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = ? AND type = 'income' ${dateFilter}`
  ).get(...params).total;

  const expense = db.prepare(
    `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = ? AND type = 'expense' ${dateFilter}`
  ).get(...params).total;

  const byCategory = db.prepare(
    `SELECT category, type, SUM(amount) as total FROM expenses WHERE user_id = ? ${dateFilter} GROUP BY category, type`
  ).all(...params);

  res.json({ income, expense, balance: income - expense, byCategory });
});

// Create expense
router.post('/', (req, res) => {
  const { title, amount, type, category, note, date } = req.body;
  if (!title || !amount || !type || !category || !date)
    return res.status(400).json({ error: 'Missing required fields' });

  const result = db.prepare(
    'INSERT INTO expenses (user_id, title, amount, type, category, note, date) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(req.userId, title, parseFloat(amount), type, category, note || '', date);

  const expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(expense);
});

// Update expense
router.put('/:id', (req, res) => {
  const { title, amount, type, category, note, date } = req.body;
  const expense = db.prepare('SELECT * FROM expenses WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });

  db.prepare(
    'UPDATE expenses SET title=?, amount=?, type=?, category=?, note=?, date=? WHERE id=?'
  ).run(title, parseFloat(amount), type, category, note || '', date, req.params.id);

  const updated = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Delete expense
router.delete('/:id', (req, res) => {
  const expense = db.prepare('SELECT * FROM expenses WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });

  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
