// server.js
// Bootstraps the Express app and starts the HTTP server.

require('dotenv').config(); // Load .env before anything else
const fs = require('fs');
const path = require('path');
const app = require('./app');
const { initPool } = require('./config/db');

const PORT = process.env.PORT || 4000;

// Ensure data directory exists for exports/backups
const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

(async () => {
  try {
    // Initialize Oracle connection pool ahead of time for performance
    await initPool();
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();