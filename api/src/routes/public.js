import express from 'express';
import { many, one, query, logActivity } from '../db.js';
import { currentUser } from '../auth.js';

const router = express.Router();

const BODY = ['sedan', 'hatchback', 'suv', 'crossover'];
const CATS = ['domestic', 'imported', 'assembled'];

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

router.get('/health', async (_req, res) => {
  try {
    await query('select 1');
    res.json({ ok: true, db: 'up' });
  } catch (err) {
    res.status(503).json({ ok: false, db: 'down', error: err.message });
  }
});

/* ——————————————————————————— site content ——————————————————————————— */

router.get('/site', async (_req, res) => {
  const [settings, sections, faqs, services] = await Promise.all([
    many('select key, value from site_settings'),
    many('select * from site_sections order by sort_weight, id'),
    many("select * from faqs where status = 'published' order by sort_weight, id"),
    many("select slug, number, title_fa, title_en, kicker_fa, kicker_en, tone from services where status = 'published' order by sort_weight"),
  ]);
  res.json({
    settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
    sections: sections.filter((s) => s.visible),
    allSections: sections,
    faqs,
    services,
  });
});

router.get('/auth/config', (req, res) => {
  res.json({ demoCredentials: !process.env.ADMIN_PASSWORD });
});

router.get('/auth/me', async (req, res) => {
  const user = await currentUser(req);
  res.json({ user });
});

/* ——————————————————————————— vehicles ——————————————————————————— */

const SORTS = {
  newest: 'year_gregorian desc, sort_weight asc',
  oldest: 'year_gregorian asc, sort_weight asc',
  price_asc: 'price_demo asc nulls last',
  price_desc: 'price_demo desc nulls last',
  mileage_asc: 'mileage_km asc',
  featured: 'featured desc, sort_weight asc',
};

router.get('/vehicles/facets', async (_req, res) => {
  const [makes, ranges] = await Promise.all([
    many(
      `select make_slug, category, min(make_fa) as make_fa, min(make_en) as make_en, count(*)::int as count
         from vehicles where status = 'published' group by make_slug, category order by count desc`,
    ),
    one(
      `select min(price_demo) as min_price, max(price_demo) as max_price,
              min(year_gregorian) as min_year, max(year_gregorian) as max_year,
              max(mileage_km) as max_mileage, count(*)::int as total
         from vehicles where status = 'published'`,
    ),
  ]);
  const counts = await many(
    `select category, body_style, fuel, transmission, count(*)::int as n
       from vehicles where status = 'published' group by 1,2,3,4`,
  );
  res.json({ makes, ranges, counts, bodyStyles: BODY, categories: CATS });
});

router.get('/vehicles', async (req, res) => {
  const q = req.query;
  const where = ["status = 'published'"];
  const params = [];
  const add = (sql, value) => {
    params.push(value);
    where.push(sql.replace('?', `$${params.length}`));
  };

  if (q.slugs) {
    const slugs = String(q.slugs).split(',').filter(Boolean).slice(0, 3);
    if (!slugs.length) return res.json({ items: [], total: 0, page: 1, pages: 0 });
    params.push(slugs);
    where.push(`slug = any($${params.length})`);
  }
  if (q.category && CATS.includes(q.category)) add('category = ?', q.category);
  if (q.body && BODY.includes(q.body)) add('body_style = ?', q.body);
  if (q.fuel) add('fuel = ?', q.fuel);
  if (q.transmission) add('transmission = ?', q.transmission);
  if (q.condition) add('condition = ?', q.condition);
  if (q.band) add('price_band = ?', q.band);
  if (q.make) add('make_slug = ?', q.make);
  if (q.featured === 'true') where.push('featured = true');
  if (num(q.yearMin)) add('year_gregorian >= ?', num(q.yearMin));
  if (num(q.yearMax)) add('year_gregorian <= ?', num(q.yearMax));
  if (num(q.priceMin)) add('price_demo >= ?', num(q.priceMin));
  if (num(q.priceMax)) add('price_demo <= ?', num(q.priceMax));
  if (num(q.mileageMax)) add('mileage_km <= ?', num(q.mileageMax));
  if (q.q) {
    params.push(`%${String(q.q).trim()}%`);
    where.push(
      `(make_fa ilike $${params.length} or model_fa ilike $${params.length} or make_en ilike $${params.length} or model_en ilike $${params.length} or trim_fa ilike $${params.length})`,
    );
  }

  const perPage = Math.min(Math.max(num(q.perPage) || 9, 1), 48);
  const page = Math.max(num(q.page) || 1, 1);
  const order = SORTS[q.sort] || SORTS.newest;

  if (q.slugs) {
    const items = await many(`select * from vehicles where ${where.join(' and ')}`, params);
    return res.json({ items, total: items.length, page: 1, pages: 1 });
  }

  const countRow = await one(
    `select count(*)::int as total from vehicles where ${where.join(' and ')}`,
    params,
  );
  const total = countRow.total;

  const items = await many(
    `select * from vehicles where ${where.join(' and ')} order by ${order} limit $${params.length + 1} offset $${params.length + 2}`,
    [...params, perPage, (page - 1) * perPage],
  );

  res.json({ items, total, page, pages: Math.ceil(total / perPage), perPage });
});

router.get('/vehicles/:slug', async (req, res) => {
  const vehicle = await one(
    "select * from vehicles where slug = $1 and status = 'published'",
    [req.params.slug],
  );
  if (!vehicle) return res.status(404).json({ error: 'not_found' });
  const related = await many(
    `select * from vehicles
      where status = 'published' and id <> $1 and category = $2
      order by abs(price_demo - coalesce($3, price_demo)) asc, sort_weight asc limit 3`,
    [vehicle.id, vehicle.category, vehicle.price_demo],
  );
  res.json({ vehicle, related });
});

/* ——————————————————————————— journal & services ——————————————————————————— */

router.get('/articles', async (req, res) => {
  const where = ["status = 'published'"];
  const params = [];
  if (req.query.category) {
    params.push(req.query.category);
    where.push(`category = $${params.length}`);
  }
  const items = await many(
    `select id, slug, title_fa, title_en, excerpt_fa, excerpt_en, category, cover_tone,
            read_minutes, featured, published_at
       from articles where ${where.join(' and ')} order by published_at desc`,
    params,
  );
  res.json({ items });
});

router.get('/articles/:slug', async (req, res) => {
  const article = await one("select * from articles where slug = $1 and status = 'published'", [
    req.params.slug,
  ]);
  if (!article) return res.status(404).json({ error: 'not_found' });
  const related = await many(
    `select slug, title_fa, title_en, category, read_minutes from articles
      where status = 'published' and id <> $1 order by (category = $2) desc, published_at desc limit 3`,
    [article.id, article.category],
  );
  res.json({ article, related });
});

router.get('/services', async (_req, res) => {
  const items = await many("select * from services where status = 'published' order by sort_weight");
  res.json({ items });
});

router.get('/services/:slug', async (req, res) => {
  const service = await one("select * from services where slug = $1 and status = 'published'", [
    req.params.slug,
  ]);
  if (!service) return res.status(404).json({ error: 'not_found' });
  const related = await many(
    "select slug, number, title_fa, title_en, kicker_fa, kicker_en, tone from services where status = 'published' and slug <> $1 order by sort_weight limit 3",
    [req.params.slug],
  );
  res.json({ service, related });
});

/* ——————————————————————————— demo submissions ——————————————————————————— */
// Simulated only: rows are stored for the admin demo and flagged synthetic.
// No email, SMS or third-party delivery happens anywhere in this build.

router.post('/inquiries', async (req, res) => {
  const { kind = 'contact', name, contact, message, vehicleSlug } = req.body || {};
  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ error: 'name_required' });
  }
  const row = await one(
    `insert into inquiries (kind, name, contact, message, vehicle_slug, synthetic)
     values ($1,$2,$3,$4,$5,true) returning id, created_at`,
    [String(kind).slice(0, 40), String(name).slice(0, 120), String(contact || '').slice(0, 160),
      String(message || '').slice(0, 2000), vehicleSlug || null],
  );
  await logActivity('visitor', 'submitted', 'inquiry', `${kind} (simulated)`);
  res.status(201).json({ ok: true, simulated: true, id: row.id });
});

router.post('/partner-applications', async (req, res) => {
  const b = req.body || {};
  if (!b.applicantType || !b.name) {
    return res.status(400).json({ error: 'applicant_type_and_name_required' });
  }
  const row = await one(
    `insert into partner_applications
      (applicant_type, name, company, city, specialization, experience, service_area,
       partnership_model, description, portfolio_url, contact_method, notes, synthetic)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true) returning id`,
    [
      String(b.applicantType).slice(0, 40),
      String(b.name).slice(0, 120),
      String(b.company || '').slice(0, 160),
      String(b.city || '').slice(0, 80),
      String(b.specialization || '').slice(0, 160),
      String(b.experience || '').slice(0, 80),
      String(b.serviceArea || '').slice(0, 160),
      String(b.partnershipModel || '').slice(0, 80),
      String(b.description || '').slice(0, 2000),
      String(b.portfolioUrl || '').slice(0, 300),
      String(b.contactMethod || '').slice(0, 40),
      String(b.notes || '').slice(0, 1000),
    ],
  );
  await logActivity('visitor', 'submitted', 'partner_application', `${b.applicantType} (simulated)`);
  res.status(201).json({ ok: true, simulated: true, id: row.id });
});

export default router;
