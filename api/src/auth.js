import crypto from 'node:crypto';
import { one, query } from './db.js';

const SESSION_COOKIE = 'aliland_session';
const SESSION_DAYS = 7;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password, stored) {
  try {
    const [algo, salt, hash] = String(stored).split('$');
    if (algo !== 'scrypt' || !salt || !hash) return false;
    const candidate = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return (
      candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected)
    );
  } catch {
    return false;
  }
}

export function parseCookies(header = '') {
  return header.split(';').reduce((acc, part) => {
    const i = part.indexOf('=');
    if (i > 0) acc[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    return acc;
  }, {});
}

export async function createSession(res, userId) {
  const id = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await query('insert into sessions (id, user_id, expires_at) values ($1,$2,$3)', [
    id,
    userId,
    expires,
  ]);
  res.cookie(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // the preview proxy terminates TLS; sameSite=lax keeps this a normal cookie
    path: '/',
    maxAge: SESSION_DAYS * 864e5,
  });
}

export async function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (token) await query('delete from sessions where id = $1', [token]);
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}

export async function currentUser(req) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  const row = await one(
    `select u.id, u.email, u.display_name, u.role, s.expires_at
       from sessions s join users u on u.id = s.user_id
      where s.id = $1`,
    [token],
  );
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    await query('delete from sessions where id = $1', [token]);
    return null;
  }
  return { id: row.id, email: row.email, displayName: row.display_name, role: row.role };
}

/** Backend-enforced gate. The UI hiding buttons is not the control — this is. */
export function requireAdmin(req, res, next) {
  currentUser(req)
    .then((user) => {
      if (!user) return res.status(401).json({ error: 'unauthenticated' });
      if (user.role !== 'admin' && user.role !== 'editor') {
        return res.status(403).json({ error: 'forbidden' });
      }
      req.user = user;
      next();
    })
    .catch(next);
}

// Simple in-memory throttle so the demo login cannot be brute forced from one IP.
const attempts = new Map();
export function throttleLogin(ip) {
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, first: now };
  if (now - entry.first > 10 * 60 * 1000) {
    entry.count = 0;
    entry.first = now;
  }
  entry.count += 1;
  attempts.set(ip, entry);
  return entry.count <= 12;
}
export function resetLoginThrottle(ip) {
  attempts.delete(ip);
}
