import jwt from 'jsonwebtoken';
import { q } from './db.js';

const SECRET = process.env.AUTH_SECRET || 'dev-only-insecure-secret-change-me';
const COOKIE = 'showroom_session';
const MAX_AGE = 12 * 60 * 60 * 1000;

export function setSession(res, user) {
  const token = jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '12h' });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearSession(res) {
  res.clearCookie(COOKIE, { path: '/' });
}

export async function attachUser(req, _res, next) {
  const token = req.cookies?.[COOKIE];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, SECRET);
    const { rows } = await q(
      'SELECT id, name, email, role FROM staff WHERE id = $1 AND is_active = true',
      [payload.sub],
    );
    if (rows[0]) req.user = rows[0];
  } catch {
    /* invalid/expired token: stay anonymous */
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'برای این بخش باید وارد شوید.' });
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'این بخش مخصوص مدیر است.' });
  next();
}

export async function audit(staffId, action, entity, entityId, meta = {}) {
  try {
    await q(
      'INSERT INTO audit_logs (staff_id, action, entity, entity_id, meta) VALUES ($1,$2,$3,$4,$5)',
      [staffId || null, action, entity, String(entityId ?? ''), meta],
    );
  } catch {
    /* audit must never break the main action */
  }
}
