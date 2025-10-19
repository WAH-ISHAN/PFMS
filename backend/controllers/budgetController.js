// controllers/budgetController.js

const { createBudget, getBudgetsByUser, updateBudget, deleteBudget } = require('../models/budgetModel');

async function listBudgets(req, res, next) {
  try {
    const rows = await getBudgetsByUser(req.user.id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function addBudget(req, res, next) {
  try {
    const { category, amount } = req.body;
    await createBudget({ userId: req.user.id, category, amount });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function editBudget(req, res, next) {
  try {
    const { id } = req.params;
    const { category, amount } = req.body;
    await updateBudget({ id: Number(id), userId: req.user.id, category, amount });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeBudget(req, res, next) {
  try {
    const { id } = req.params;
    await deleteBudget({ id: Number(id), userId: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listBudgets, addBudget, editBudget, removeBudget };