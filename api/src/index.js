import express from 'express';
import cookieParser from 'cookie-parser';
import { attachUser } from './auth.js';
import { seed } from './seed.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { publicRouter } from './routes/public.js';

// Express 4 does not forward rejected promises from async handlers; log instead of crashing.
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err?.message || err);
});

const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());
app.use(attachUser);

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api', publicRouter);

app.use((_req, res) => res.status(404).json({ error: 'مسیر پیدا نشد.' }));
app.use((err, _req, res, _next) => {
  console.error('[api]', err.message);
  res.status(500).json({ error: 'خطای داخلی سرور.' });
});

const PORT = Number(process.env.PORT || 8000);

async function start() {
  // Retry until Postgres is ready, then create the schema and seed demo data once.
  for (let i = 0; i < 30; i += 1) {
    try {
      await seed();
      break;
    } catch (err) {
      console.log(`[boot] waiting for db (${i + 1}/30): ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`[api] listening on ${PORT}`));
}

start();
