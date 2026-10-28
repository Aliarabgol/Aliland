import express from 'express';
import { one } from '../db.js';
import {
  createSession,
  destroySession,
  currentUser,
  verifyPassword,
  throttleLogin,
  resetLoginThrottle,
} from '../auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const ip = req.ip || 'unknown';
  if (!throttleLogin(ip)) {
    return res.status(429).json({ error: 'too_many_attempts' });
  }
  if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' });

  const user = await one('select * from users where lower(email) = lower($1)', [
    String(email).trim(),
  ]);
  if (!user || !verifyPassword(String(password), user.password_hash)) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }
  resetLoginThrottle(ip);
  await createSession(res, user.id);
  res.json({
    user: { id: user.id, email: user.email, displayName: user.display_name, role: user.role },
  });
});

router.post('/logout', async (req, res) => {
  await destroySession(req, res);
  res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  const user = await currentUser(req);
  res.json({ user });
});

export default router;
