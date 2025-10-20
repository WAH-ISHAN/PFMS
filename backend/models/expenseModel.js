// models/expenseModel.js
// Fixed: bind expense_date safely as 'YYYY-MM-DD' and convert with TO_DATE in SQL.

const { execute } = require('../config/db');

// Normalize any incoming date (string/Date) into 'YYYY-MM-DD'
function toYMD(d) {
  if (!d) return null;
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  if (typeof d === 'string') return d.slice(0, 10);
  return null;
}

async function createExpense({ userId, category, amount, expenseDate }) {
  // Default to today if not provided
  const ymd = toYMD(expenseDate) || new Date().toISOString().slice(0, 10);
  await execute(
    `INSERT INTO expenses (user_id, category, amount, expense_date)
     VALUES (:user_id, :category, :amount, TO_DATE(:expense_date, 'YYYY-MM-DD'))`,
    { user_id: userId, category, amount, expense_date: ymd }
  );
}

async function getExpensesByUser(userId) {
  const res = await execute(
    `SELECT id, category, amount, expense_date, created_at
     FROM expenses
     WHERE user_id = :user_id
     ORDER BY expense_date DESC, created_at DESC`,
    { user_id: userId }
  );
  return res.rows;
}

async function updateExpense({ id, userId, category, amount, expenseDate }) {
  const ymd = toYMD(expenseDate) || new Date().toISOString().slice(0, 10);
  await execute(
    `UPDATE expenses
     SET category = :category,
         amount = :amount,
         expense_date = TO_DATE(:expense_date, 'YYYY-MM-DD')
     WHERE id = :id AND user_id = :user_id`,
    { id, user_id: userId, category, amount, expense_date: ymd }
  );
}

async function deleteExpense({ id, userId }) {
  await execute(
    `DELETE FROM expenses WHERE id = :id AND user_id = :user_id`,
    { id, user_id: userId }
  );
}

module.exports = {
  createExpense,
  getExpensesByUser,
  updateExpense,
  deleteExpense
};