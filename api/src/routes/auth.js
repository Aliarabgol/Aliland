import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { q } from '../db.js';
import { setSession, clearSession, requireAuth } from '../auth.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(422).json({ error: 'ایمیل و گذرواژه را وارد کنید.' });

  const { rows } = await q('SELECT * FROM staff WHERE email = $1 AND is_active = true', [email]);
  const staff = rows[0];
  const ok = staff ? await bcrypt.compare(password, staff.password_hash) : false;
  if (!ok) return res.status(401).json({ error: 'ایمیل یا گذرواژه اشتباه است.' });

  setSession(res, staff);
  res.json({ user: { id: staff.id, name: staff.name, email: staff.email, role: staff.role } });
});

authRouter.post('/logout', (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
