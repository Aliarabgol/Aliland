import { pool } from '../src/db.js';
import { migrate } from './seed.js';

migrate()
  .then(async () => {
    await pool.end();
    console.log('[migrate] complete');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('[migrate] failed:', err.message);
    try {
      await pool.end();
    } catch {}
    process.exit(1);
  });
