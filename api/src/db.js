import pg from 'pg';

// BIGINT / NUMERIC come back as numbers so JSON payloads are clean on the client.
pg.types.setTypeParser(20, (v) => (v === null ? null : Number(v)));
pg.types.setTypeParser(1700, (v) => (v === null ? null : Number(v)));

export const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://showroom:showroom@db:5432/showroom',
  max: 10,
});

export const q = (text, params) => pool.query(text, params);

export async function ensureSchema() {
  const { readFile } = await import('node:fs/promises');
  const url = new URL('./schema.sql', import.meta.url);
  const sql = await readFile(url, 'utf8');
  await pool.query(sql);
}
