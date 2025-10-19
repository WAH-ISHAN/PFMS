// controllers/expenseController.js

const { createExpense, getExpensesByUser, updateExpense, deleteExpense } = require('../models/expenseModel');

// GET /expenses
async function listExpenses(req, res, next) {
  try {
    const rows = await getExpensesByUser(req.user.id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// POST /expenses
async function addExpense(req, res, next) {
  try {
    const { category, amount, expense_date } = req.body;
    await createExpense({
      userId: req.user.id,
      category,
      amount,
      expenseDate: expense_date || new Date()
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// PUT /expenses/:id
async function editExpense(req, res, next) {
  try {
    const { id } = req.params;
    const { category, amount, expense_date } = req.body;
    await updateExpense({
      id: Number(id),
      userId: req.user.id,
      category,
      amount,
      expenseDate: expense_date || new Date()
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// DELETE /expenses/:id
async function removeExpense(req, res, next) {
  try {
    const { id } = req.params;
    await deleteExpense({ id: Number(id), userId: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listExpenses, addExpense, editExpense, removeExpense };