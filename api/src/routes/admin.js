import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import { many, one, query, logActivity } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = express.Router();
router.use(requireAdmin);

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/api/uploads';

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || `item-${Date.now()}`;

/* ——————————————————————————— overview ——————————————————————————— */

router.get('/overview', async (_req, res) => {
  const [vehicles, byCategory, articles, drafts, media, applications, activity, inquiries] =
    await Promise.all([
      one(`select count(*)::int as total,
                  count(*) filter (where status = 'published')::int as published,
                  count(*) filter (where status = 'draft')::int as drafts,
                  count(*) filter (where featured)::int as featured,
                  count(*) filter (where category = 'domestic')::int as domestic,
                  count(*) filter (where category = 'imported')::int as imported,
                  count(*) filter (where category = 'assembled')::int as assembled
             from vehicles`),
      many(`select category, count(*)::int as count from vehicles group by category`),
      one(`select count(*)::int as total, count(*) filter (where status = 'published')::int as published from articles`),
      one(`select count(*)::int as total from vehicles where status = 'draft'`),
      one('select count(*)::int as total from media_assets'),
      one('select count(*)::int as total from partner_applications where synthetic = true'),
      many('select * from activity_log order by created_at desc limit 8'),
      one('select count(*)::int as total from inquiries where synthetic = true'),
    ]);

  res.json({
    vehicles,
    byCategory,
    articles,
    pending: drafts.total,
    media,
    applications,
    inquiries,
    activity,
    services: await one('select count(*)::int as total from services'),
    sections: await one('select count(*)::int as total from site_sections'),
  });
});

/* ——————————————————————————— vehicles ——————————————————————————— */

const VEHICLE_FIELDS = [
  'make_fa', 'make_en', 'model_fa', 'model_en', 'trim_fa', 'trim_en', 'make_slug', 'category',
  'body_style', 'year_gregorian', 'year_shamsi', 'engine_fa', 'engine_en', 'fuel', 'transmission',
  'mileage_km', 'color_fa', 'color_en', 'color_hex', 'interior_fa', 'interior_en', 'condition',
  'body_condition', 'price_demo', 'price_band', 'available', 'status', 'featured', 'note_fa',
  'note_en', 'tone', 'accent',
];

const JSON_FIELDS = ['specs', 'features', 'gallery'];

router.get('/vehicles', async (req, res) => {
  const status = req.query.status;
  const items = await many(
    `select * from vehicles ${status ? 'where status = $1' : ''} order by sort_weight, id`,
    status ? [status] : [],
  );
  res.json({ items });
});

router.post('/vehicles', async (req, res) => {
  const body = req.body || {};
  if (!body.make_fa || !body.model_fa || !body.category) {
    return res.status(400).json({ error: 'make_model_category_required' });
  }
  const slug = body.slug ? slugify(body.slug) : slugify(`${body.model_en || body.model_fa}-${Date.now()}`);
  const cols = ['slug', ...VEHICLE_FIELDS];
  const values = [slug, ...VEHICLE_FIELDS.map((f) => body[f] ?? null)];
  const placeholders = cols.map((_, i) => `$${i + 1}`);
  const row = await one(
    `insert into vehicles (${cols.join(',')}) values (${placeholders.join(',')}) returning *`,
    values,
  );
  await logActivity(req.user.email, 'created', 'vehicle', row.slug);
  res.status(201).json({ vehicle: row });
});

router.patch('/vehicles/:id', async (req, res) => {
  const body = req.body || {};
  const sets = [];
  const params = [];
  for (const field of [...VEHICLE_FIELDS, ...JSON_FIELDS]) {
    if (!(field in body)) continue;
    params.push(JSON_FIELDS.includes(field) ? JSON.stringify(body[field]) : body[field]);
    sets.push(`${field} = $${params.length}`);
  }
  if (!sets.length) return res.status(400).json({ error: 'nothing_to_update' });
  params.push(req.params.id);
  const row = await one(
    `update vehicles set ${sets.join(', ')}, updated_at = now() where id = $${params.length} returning *`,
    params,
  );
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'updated', 'vehicle', row.slug);
  res.json({ vehicle: row });
});

router.delete('/vehicles/:id', async (req, res) => {
  const row = await one('delete from vehicles where id = $1 returning slug', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'deleted', 'vehicle', row.slug);
  res.json({ ok: true });
});

/* ——————————————————————————— articles ——————————————————————————— */

const ARTICLE_FIELDS = [
  'title_fa', 'title_en', 'excerpt_fa', 'excerpt_en', 'body_fa', 'body_en', 'category',
  'cover_tone', 'read_minutes', 'status', 'featured',
];

router.get('/articles', async (_req, res) => {
  const items = await many('select * from articles order by published_at desc');
  res.json({ items });
});

router.post('/articles', async (req, res) => {
  const body = req.body || {};
  if (!body.title_fa || !body.title_en) return res.status(400).json({ error: 'titles_required' });
  const slug = slugify(body.slug || body.title_en);
  const cols = ['slug', ...ARTICLE_FIELDS];
  const values = [slug, ...ARTICLE_FIELDS.map((f) => body[f] ?? null)];
  const row = await one(
    `insert into articles (${cols.join(',')}) values (${cols.map((_, i) => `$${i + 1}`).join(',')}) returning *`,
    values,
  );
  await logActivity(req.user.email, 'created', 'article', row.slug);
  res.status(201).json({ article: row });
});

router.patch('/articles/:id', async (req, res) => {
  const body = req.body || {};
  const sets = [];
  const params = [];
  for (const field of ARTICLE_FIELDS) {
    if (!(field in body)) continue;
    params.push(body[field]);
    sets.push(`${field} = $${params.length}`);
  }
  if (!sets.length) return res.status(400).json({ error: 'nothing_to_update' });
  params.push(req.params.id);
  const row = await one(
    `update articles set ${sets.join(', ')}, updated_at = now() where id = $${params.length} returning *`,
    params,
  );
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'updated', 'article', row.slug);
  res.json({ article: row });
});

router.delete('/articles/:id', async (req, res) => {
  const row = await one('delete from articles where id = $1 returning slug', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'deleted', 'article', row.slug);
  res.json({ ok: true });
});

/* ——————————————————————————— homepage sections ——————————————————————————— */

const SECTION_FIELDS = [
  'title_fa', 'title_en', 'subtitle_fa', 'subtitle_en', 'cta_label_fa', 'cta_label_en',
  'cta_href', 'visible', 'sort_weight',
];

router.get('/sections', async (_req, res) => {
  res.json({ items: await many('select * from site_sections order by sort_weight, id') });
});

router.patch('/sections/:id', async (req, res) => {
  const body = req.body || {};
  const sets = [];
  const params = [];
  for (const field of SECTION_FIELDS) {
    if (!(field in body)) continue;
    params.push(body[field]);
    sets.push(`${field} = $${params.length}`);
  }
  if (!sets.length) return res.status(400).json({ error: 'nothing_to_update' });
  params.push(req.params.id);
  const row = await one(
    `update site_sections set ${sets.join(', ')} where id = $${params.length} returning *`,
    params,
  );
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'updated', 'site_section', row.key);
  res.json({ section: row });
});

/* ——————————————————————————— services ——————————————————————————— */

const SERVICE_FIELDS = ['title_fa', 'title_en', 'kicker_fa', 'kicker_en', 'intro_fa', 'intro_en',
  'problem_fa', 'problem_en', 'value_fa', 'value_en', 'cta_href', 'tone', 'status', 'sort_weight'];

router.get('/services', async (_req, res) => {
  res.json({ items: await many('select * from services order by sort_weight') });
});

router.patch('/services/:id', async (req, res) => {
  const body = req.body || {};
  const sets = [];
  const params = [];
  for (const field of SERVICE_FIELDS) {
    if (!(field in body)) continue;
    params.push(body[field]);
    sets.push(`${field} = $${params.length}`);
  }
  if (!sets.length) return res.status(400).json({ error: 'nothing_to_update' });
  params.push(req.params.id);
  const row = await one(
    `update services set ${sets.join(', ')}, updated_at = now() where id = $${params.length} returning *`,
    params,
  );
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'updated', 'service', row.slug);
  res.json({ service: row });
});

/* ——————————————————————————— faqs ——————————————————————————— */

const FAQ_FIELDS = ['question_fa', 'question_en', 'answer_fa', 'answer_en', '"group"', 'status', 'sort_weight'];

router.get('/faqs', async (_req, res) => {
  res.json({ items: await many('select * from faqs order by sort_weight, id') });
});

router.post('/faqs', async (req, res) => {
  const body = req.body || {};
  if (!body.question_fa || !body.question_en) {
    return res.status(400).json({ error: 'questions_required' });
  }
  const row = await one(
    `insert into faqs (question_fa, question_en, answer_fa, answer_en, "group", status, sort_weight)
     values ($1,$2,$3,$4,$5,$6,$7) returning *`,
    [body.question_fa, body.question_en, body.answer_fa || '', body.answer_en || '',
      body.group || 'general', body.status || 'published', body.sort_weight || 0],
  );
  await logActivity(req.user.email, 'created', 'faq', String(row.id));
  res.status(201).json({ faq: row });
});

router.patch('/faqs/:id', async (req, res) => {
  const body = req.body || {};
  const sets = [];
  const params = [];
  for (const field of FAQ_FIELDS) {
    const key = field.replaceAll('"', '');
    if (!(key in body)) continue;
    params.push(body[key]);
    sets.push(`${field} = $${params.length}`);
  }
  if (!sets.length) return res.status(400).json({ error: 'nothing_to_update' });
  params.push(req.params.id);
  const row = await one(
    `update faqs set ${sets.join(', ')} where id = $${params.length} returning *`,
    params,
  );
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'updated', 'faq', String(row.id));
  res.json({ faq: row });
});

router.delete('/faqs/:id', async (req, res) => {
  const row = await one('delete from faqs where id = $1 returning id', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'deleted', 'faq', String(row.id));
  res.json({ ok: true });
});

/* ——————————————————————————— media ——————————————————————————— */

await fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(() => {});

const ALLOWED_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ALLOWED_TYPES.get(file.mimetype)}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    ALLOWED_TYPES.has(file.mimetype) ? cb(null, true) : cb(new Error('unsupported_file_type')),
});

router.get('/media', async (_req, res) => {
  res.json({ items: await many('select * from media_assets order by created_at desc') });
});

router.post('/media', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'file_too_large' : err.message;
      return res.status(400).json({ error: message });
    }
    if (!req.file) return res.status(400).json({ error: 'file_required' });
    const url = `/uploads/${req.file.filename}`;
    const row = await one(
      `insert into media_assets (name, description, url, kind, attribution)
       values ($1,$2,$3,'upload',$4) returning *`,
      [
        req.body.name || req.file.originalname,
        req.body.description || '',
        url,
        req.body.attribution || 'Uploaded by admin — confirm you hold the rights to this image.',
      ],
    );
    await logActivity(req.user.email, 'uploaded', 'media', row.name);
    res.status(201).json({ asset: row });
  });
});

router.delete('/media/:id', async (req, res) => {
  const row = await one('delete from media_assets where id = $1 returning *', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'not_found' });
  if (row.kind === 'upload' && row.url?.startsWith('/uploads/')) {
    await fs
      .unlink(path.join(UPLOAD_DIR, path.basename(row.url)))
      .catch(() => {});
  }
  await logActivity(req.user.email, 'deleted', 'media', row.name);
  res.json({ ok: true });
});

/* ——————————————————————————— demo submissions ——————————————————————————— */

router.get('/applications', async (_req, res) => {
  res.json({ items: await many('select * from partner_applications order by created_at desc') });
});

router.delete('/applications/:id', async (req, res) => {
  const row = await one('delete from partner_applications where id = $1 returning id', [
    req.params.id,
  ]);
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'deleted', 'partner_application', String(row.id));
  res.json({ ok: true });
});

router.get('/inquiries', async (_req, res) => {
  res.json({ items: await many('select * from inquiries order by created_at desc limit 50') });
});

router.delete('/inquiries/:id', async (req, res) => {
  const row = await one('delete from inquiries where id = $1 returning id', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'not_found' });
  await logActivity(req.user.email, 'deleted', 'inquiry', String(row.id));
  res.json({ ok: true });
});

router.get('/activity', async (_req, res) => {
  res.json({ items: await many('select * from activity_log order by created_at desc limit 40') });
});

// Used by the admin QA panel to prove a write really reached the database.
router.get('/ping-db', async (_req, res) => {
  const row = await query('select now() as now');
  res.json({ ok: true, now: row.rows[0].now });
});

export default router;
