// config/db.js
// Oracle DB pool and helper execute function.

const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // Return rows as JS objects

let pool;

/**
 * Initialize a singleton Oracle connection pool.
 */
async function initPool() {
  if (pool) return pool;
  pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    poolMin: 1,
    poolMax: 8,
    poolIncrement: 1
  });
  console.log('Oracle pool created');
  return pool;
}

/**
 * Execute a SQL statement with named binds and options.
 * Automatically opens/closes a connection and commits non-SELECT statements.
 */
async function execute(sql, binds = {}, options = {}) {
  const connection = await pool.getConnection();
  try {
    const result = await connection.execute(sql, binds, {
      autoCommit: options.autoCommit ?? true,
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    return result;
  } catch (err) {
    // For DML we might have to rollback
    try { await connection.rollback(); } catch (_) {}
    throw err;
  } finally {
    try { await connection.close(); } catch (_) {}
  }
}

module.exports = { initPool, execute, oracledb };