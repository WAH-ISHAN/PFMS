// controllers/userController.js
// Profile, export data, backup

const { getUserById } = require('../models/userModel');
const { getExpensesByUser } = require('../models/expenseModel');
const { getBudgetsByUser } = require('../models/budgetModel');
const { getSavingsByUser } = require('../models/savingModel');
const { buildUserExport } = require('../utils/exportExcel');
const { createBackupZip } = require('../utils/backupData');
const path = require('path');
const fs = require('fs');

async function profile(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    res.json({
      id: user.ID || user.id,
      name: user.NAME || user.name,
      email: user.EMAIL || user.email,
      role: user.ROLE || user.role,
      created_at: user.CREATED_AT || user.created_at
    });
  } catch (err) {
    next(err);
  }
}

// GET /user/export
async function exportData(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    const [expenses, budgets, savings] = await Promise.all([
      getExpensesByUser(req.user.id),
      getBudgetsByUser(req.user.id),
      getSavingsByUser(req.user.id)
    ]);

    const buffer = await buildUserExport({ expenses, budgets, savings, user: {
      id: user.ID || user.id,
      name: user.NAME || user.name,
      email: user.EMAIL || user.email,
      role: user.ROLE || user.role
    }});

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="export-${(user.EMAIL||user.email)}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

// GET /user/backup
async function backup(req, res, next) {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const zipPath = await createBackupZip({ userId: req.user.id, admin: isAdmin });
    res.download(zipPath, (err) => {
      if (!err) {
        // Optional: cleanup after sending
        try { fs.unlinkSync(zipPath); } catch (_) {}
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { profile, exportData, backup };