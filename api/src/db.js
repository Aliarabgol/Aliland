import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://aliland:aliland_dev_only@db:5432/aliland',
  max: 8,
});

export function query(text, params) {
  return pool.query(text, params);
}

export async function one(text, params) {
  const { rows } = await pool.query(text, params);
  return rows[0] || null;
}

export async function many(text, params) {
  const { rows } = await pool.query(text, params);
  return rows;
}

export async function logActivity(actor, action, entity, detail) {
  try {
    await pool.query(
      'insert into activity_log (actor, action, entity, detail) values ($1,$2,$3,$4)',
      [actor, action, entity, detail || null],
    );
  } catch {
    // activity logging must never break a request
  }
}
