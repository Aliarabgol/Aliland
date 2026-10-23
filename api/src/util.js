export const toEnDigits = (value) =>
  String(value ?? '')
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));

export function normalizeFa(value) {
  return String(value ?? '')
    .replace(/ي/g, 'ی')
    .replace(/ى/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200c\u200f\u200e]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Canonical Iranian mobile: +989XXXXXXXXX, or null when invalid. */
export function normalizePhone(input) {
  let s = toEnDigits(input).trim().replace(/[\s\-()]/g, '');
  if (!s) return null;
  if (s.startsWith('+98')) s = '0' + s.slice(3);
  else if (s.startsWith('0098')) s = '0' + s.slice(4);
  else if (s.startsWith('98') && s.length === 12) s = '0' + s.slice(2);
  else if (s.startsWith('9') && s.length === 10) s = '0' + s;
  if (!/^09\d{9}$/.test(s)) return null;
  return '+98' + s.slice(1);
}

export function toInt(input) {
  if (input === null || input === undefined || input === '') return null;
  const n = Number(toEnDigits(input).replace(/,/g, '').trim());
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export function randomCode(prefix = 'CS') {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${n}`;
}

export function jsonError(res, status, message, extra = {}) {
  return res.status(status).json({ error: message, ...extra });
}

/** Very small in-memory rate limiter: N submissions per phone+ip per window. */
export function createRateLimiter({ limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const hits = new Map();
  return function check(key) {
    const now = Date.now();
    const bucket = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (bucket.length >= limit) {
      hits.set(key, bucket);
      return { ok: false, retryAfterMs: windowMs - (now - bucket[0]) };
    }
    bucket.push(now);
    hits.set(key, bucket);
    if (hits.size > 5000) hits.clear();
    return { ok: true };
  };
}
