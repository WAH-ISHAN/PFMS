// models/userModel.js
// User model queries.

const { execute } = require('../config/db');

async function createUser({ name, email, passwordHash, role = 'USER', googleId = null }) {
  // Use RETURNING to capture generated ID
  const result = await execute(
    `INSERT INTO app_users (name, email, password_hash, role, google_id)
     VALUES (:name, :email, :password_hash, :role, :google_id)
     RETURNING id INTO :id`,
    {
      name,
      email,
      password_hash: passwordHash,
      role,
      google_id: googleId,
      id: { dir: require('../config/db').oracledb.BIND_OUT, type: require('../config/db').oracledb.NUMBER }
    },
    { autoCommit: true }
  );

  const id = result.outBinds.id[0];
  return { id, name, email, role, google_id: googleId };
}

async function getUserByEmail(email) {
  const res = await execute(
    `SELECT id, name, email, password_hash, role, google_id, created_at FROM app_users WHERE email = :email`,
    { email }
  );
  return res.rows[0] || null;
}

async function getUserById(id) {
  const res = await execute(
    `SELECT id, name, email, password_hash, role, google_id, created_at FROM app_users WHERE id = :id`,
    { id }
  );
  return res.rows[0] || null;
}

async function updateUserPassword(id, passwordHash) {
  await execute(
    `UPDATE app_users SET password_hash = :password_hash WHERE id = :id`,
    { id, password_hash: passwordHash }
  );
}

async function linkGoogleIdToUser(userId, googleId) {
  await execute(`UPDATE app_users SET google_id = :google_id WHERE id = :id`, { id: userId, google_id: googleId });
}

async function listUsers(page = 1, pageSize = 20) {
  // Simple pagination using OFFSET/FETCH
  const offset = (page - 1) * pageSize;
  const res = await execute(
    `SELECT id, name, email, role, created_at
     FROM app_users
     ORDER BY created_at DESC
     OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
    { offset, limit: pageSize }
  );
  return res.rows;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  linkGoogleIdToUser,
  listUsers
};