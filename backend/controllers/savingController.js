// controllers/savingController.js

const { createSaving, getSavingsByUser, updateSaving, deleteSaving } = require('../models/savingModel');

async function listSavings(req, res, next) {
  try {
    const rows = await getSavingsByUser(req.user.id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function addSaving(req, res, next) {
  try {
    const { goal_name, target_amount, current_amount } = req.body;
    await createSaving({
      userId: req.user.id,
      goalName: goal_name,
      targetAmount: target_amount,
      currentAmount: current_amount || 0
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function editSaving(req, res, next) {
  try {
    const { id } = req.params;
    const { goal_name, target_amount, current_amount } = req.body;
    await updateSaving({
      id: Number(id),
      userId: req.user.id,
      goalName: goal_name,
      targetAmount: target_amount,
      currentAmount: current_amount
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeSaving(req, res, next) {
  try {
    const { id } = req.params;
    await deleteSaving({ id: Number(id), userId: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listSavings, addSaving, editSaving, removeSaving };