// utils/backupData.js
// Creates a ZIP backup (JSON dump of tables). For admin or per-user backups.

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execute } = require('../config/db');

/**
 * Dump tables to JSON and zip them.
 * If userId provided => dump only that user's rows (expenses/budgets/savings).
 * If admin backup => dump all tables (including users).
 * Returns absolute path to the generated zip file.
 */
async function createBackupZip({ userId = null, admin = false }) {
  const dir = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const zipPath = path.join(dir, `backup-${admin ? 'admin' : 'user-' + userId}-${stamp}.zip`);

  // Query helpers
  const q = async (sql, binds) => (await execute(sql, binds)).rows || [];

  let data = {};

  if (admin) {
    data.app_users = await q(`SELECT id, name, email, role, google_id, created_at FROM app_users`, {});
    data.expenses = await q(`SELECT * FROM expenses`, {});
    data.budgets = await q(`SELECT * FROM budgets`, {});
    data.savings = await q(`SELECT * FROM savings`, {});
    data.blog_posts = await q(`SELECT * FROM blog_posts`, {});
    data.contact_messages = await q(`SELECT * FROM contact_messages`, {});
  } else {
    // Per-user backup
    data.expenses = await q(`SELECT * FROM expenses WHERE user_id = :uid`, { uid: userId });
    data.budgets = await q(`SELECT * FROM budgets WHERE user_id = :uid`, { uid: userId });
    data.savings = await q(`SELECT * FROM savings WHERE user_id = :uid`, { uid: userId });
  }

  // Create zip and append JSON files
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);

    Object.keys(data).forEach((key) => {
      archive.append(JSON.stringify(data[key], null, 2), { name: `${key}.json` });
    });

    archive.finalize();
  });

  return zipPath;
}

module.exports = { createBackupZip };