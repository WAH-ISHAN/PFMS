// models/passwordResetModel.js

const { execute } = require('../config/db');

async function createPasswordReset({ userId, otpCode, expiresAt }) {
  await execute(
    `INSERT INTO password_resets (user_id, otp_code, expires_at)
     VALUES (:user_id, :otp_code, :expires_at)`,
    { user_id: userId, otp_code: otpCode, expires_at: expiresAt }
  );
}

async function findValidReset({ userId, otpCode }) {
  const res = await execute(
    `SELECT id, user_id, otp_code, expires_at, used
     FROM password_resets
     WHERE user_id = :user_id AND otp_code = :otp_code
       AND used = 0 AND expires_at > SYSTIMESTAMP
     ORDER BY created_at DESC FETCH NEXT 1 ROWS ONLY`,
    { user_id: userId, otp_code: otpCode }
  );
  return res.rows[0] || null;
}

async function markResetUsed(id) {
  await execute(`UPDATE password_resets SET used = 1 WHERE id = :id`, { id });
}

module.exports = { createPasswordReset, findValidReset, markResetUsed };