// models/savingModel.js

const { execute } = require('../config/db');

async function createSaving({ userId, goalName, targetAmount, currentAmount = 0 }) {
  await execute(
    `INSERT INTO savings (user_id, goal_name, target_amount, current_amount)
     VALUES (:user_id, :goal_name, :target_amount, :current_amount)`,
    { user_id: userId, goal_name: goalName, target_amount: targetAmount, current_amount: currentAmount }
  );
}

async function getSavingsByUser(userId) {
  const res = await execute(
    `SELECT id, goal_name, target_amount, current_amount, created_at
     FROM savings
     WHERE user_id = :user_id
     ORDER BY created_at DESC`,
    { user_id: userId }
  );
  return res.rows;
}

async function updateSaving({ id, userId, goalName, targetAmount, currentAmount }) {
  await execute(
    `UPDATE savings
     SET goal_name = :goal_name, target_amount = :target_amount, current_amount = :current_amount
     WHERE id = :id AND user_id = :user_id`,
    { id, user_id: userId, goal_name: goalName, target_amount: targetAmount, current_amount: currentAmount }
  );
}

async function deleteSaving({ id, userId }) {
  await execute(
    `DELETE FROM savings WHERE id = :id AND user_id = :user_id`,
    { id, user_id: userId }
  );
}

module.exports = {
  createSaving,
  getSavingsByUser,
  updateSaving,
  deleteSaving
};