require('dotenv').config();
const app = require('./app');
const { initDb } = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDb();
    console.log('[Database] Connected to SQLite successfully.');

    app.listen(PORT, () => {
      console.log(`[Server] API server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[Fatal Error] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
