// models/budgetModel.js

const { execute } = require('../config/db');

async function createBudget({ userId, category, amount }) {
  await execute(
    `INSERT INTO budgets (user_id, category, amount)
     VALUES (:user_id, :category, :amount)`,
    { user_id: userId, category, amount }
  );
}

async function getBudgetsByUser(userId) {
  const res = await execute(
    `SELECT id, category, amount, created_at
     FROM budgets
     WHERE user_id = :user_id
     ORDER BY created_at DESC`,
    { user_id: userId }
  );
  return res.rows;
}

async function updateBudget({ id, userId, category, amount }) {
  await execute(
    `UPDATE budgets SET category = :category, amount = :amount
     WHERE id = :id AND user_id = :user_id`,
    { id, user_id: userId, category, amount }
  );
}

async function deleteBudget({ id, userId }) {
  await execute(
    `DELETE FROM budgets WHERE id = :id AND user_id = :user_id`,
    { id, user_id: userId }
  );
}

module.exports = {
  createBudget,
  getBudgetsByUser,
  updateBudget,
  deleteBudget
};