// controllers/adminController.js
// Basic admin functions: list users, stats.

const { listUsers } = require('../models/userModel');
const { execute } = require('../config/db');

async function users(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 20);
    const rows = await listUsers(page, pageSize);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function stats(req, res, next) {
  try {
    // Example: total users, total expenses amount, total budgets amount, savings total
    const [usersCount, expSum, budSum, savSum] = await Promise.all([
      execute(`SELECT COUNT(*) as CNT FROM app_users`, {}),
      execute(`SELECT NVL(SUM(amount),0) as AMT FROM expenses`, {}),
      execute(`SELECT NVL(SUM(amount),0) as AMT FROM budgets`, {}),
      execute(`SELECT NVL(SUM(current_amount),0) as AMT FROM savings`, {})
    ]);

    res.json({
      users: usersCount.rows[0].CNT,
      expensesTotal: expSum.rows[0].AMT,
      budgetsTotal: budSum.rows[0].AMT,
      savingsTotal: savSum.rows[0].AMT
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { users, stats };