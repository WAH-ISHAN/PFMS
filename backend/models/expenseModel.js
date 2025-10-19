// models/expenseModel.js

const { execute } = require('../config/db');

async function createExpense({ userId, category, amount, expenseDate }) {
  await execute(
    `INSERT INTO expenses (user_id, category, amount, expense_date)
     VALUES (:user_id, :category, :amount, :expense_date)`,
    { user_id: userId, category, amount, expense_date: expenseDate }
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
  await execute(
    `UPDATE expenses
     SET category = :category, amount = :amount, expense_date = :expense_date
     WHERE id = :id AND user_id = :user_id`,
    { id, user_id: userId, category, amount, expense_date: expenseDate }
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