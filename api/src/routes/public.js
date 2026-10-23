import { Router } from 'express';
import { q } from '../db.js';
import { validateLead } from '../validate.js';
import { normalizeFa, randomCode, jsonError, createRateLimiter, toInt } from '../util.js';

export const publicRouter = Router();

const limiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

const PUBLIC_VISIBLE = `publication_status = 'published'`;
const LIST_CLOSED = `lifecycle_status IN ('available','reserved')`;

function toPublicVehicle(row) {
  return {
    id: row.id,
    code: row.public_code,
    slug: row.slug,
    title: row.title,
    brand: row.brand,
    model: row.model,
    trim: row.trim,
    year: row.year_value,
    yearCalendar: row.year_calendar,
    mileageKm: row.mileage_km,
    bodyType: row.body_type,
    fuelType: row.fuel_type,
    transmission: row.transmission,
    exteriorColor: row.exterior_color,
    interiorColor: row.interior_color,
    engineCc: row.engine_cc,
    drivetrain: row.drivetrain,
    city: row.city,
    viewingLocation: row.public_viewing_location,
    price: row.price_toman,
    priceMode: row.price_mode,
    priceConfirmedAt: row.price_confirmed_at,
    description: row.description,
    options: row.verified_options || [],
    defects: row.disclosed_defects || [],
    cover: row.cover_media_url,
    featured: row.featured,
    isDemo: row.is_demo,
    lifecycle: row.lifecycle_status,
    hasInspection: !!row.has_inspection,
    createdAt: row.created_at,
  };
}

publicRouter.get('/health', async (_req, res) => {
  try {
    await q('SELECT 1');
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

publicRouter.get('/settings', async (_req, res) => {
  const { rows } = await q('SELECT data, mode, updated_at FROM settings WHERE id = 1');
  const row = rows[0] || { data: {}, mode: 'demo' };
  res.json({ settings: row.data, mode: row.mode, updatedAt: row.updated_at });
});

/* ------------------------------- inventory ------------------------------- */

function buildFilters(query) {
  const clauses = [PUBLIC_VISIBLE];
  const params = [];
  const add = (sql, value) => {
    params.push(value);
    clauses.push(sql.replace('?', `$${params.length}`));
  };
  const includeClosed = query.includeClosed === '1' || query.includeClosed === 'true';
  if (!includeClosed) clauses.push(LIST_CLOSED);
  if (query.featured === '1') clauses.push('featured = true');

  const text = (v) => (typeof v === 'string' ? v.trim() : '');
  if (text(query.brand)) add('brand = ?', text(query.brand));
  if (text(query.model)) add('model = ?', text(query.model));
  if (text(query.trim)) add('trim = ?', text(query.trim));
  if (text(query.city)) add('city = ?', text(query.city));
  if (text(query.bodyType)) add('body_type = ?', text(query.bodyType));
  if (text(query.transmission)) add('transmission = ?', text(query.transmission));
  if (text(query.fuelType)) add('fuel_type = ?', text(query.fuelType));
  if (text(query.color)) add('exterior_color = ?', text(query.color));

  const priceMin = toInt(query.priceMin);
  const priceMax = toInt(query.priceMax);
  if (priceMin != null) add('price_toman >= ?', priceMin);
  if (priceMax != null) add('price_toman <= ?', priceMax);

  const mileageMax = toInt(query.mileageMax);
  if (mileageMax != null) add('mileage_km <= ?', mileageMax);

  const yearFrom = toInt(query.yearFrom);
  const yearTo = toInt(query.yearTo);
  if (query.yearCalendar === 'jalali' || query.yearCalendar === 'gregorian') {
    add('year_calendar = ?', query.yearCalendar);
  }
  if (yearFrom != null) add('year_value >= ?', yearFrom);
  if (yearTo != null) add('year_value <= ?', yearTo);

  if (text(query.q)) add('search_text LIKE ?', `%${normalizeFa(query.q).toLowerCase()}%`);

  return { where: clauses.join(' AND '), params };
}

const SORTS = {
  newest: 'created_at DESC, id DESC',
  price_asc: 'price_toman ASC NULLS LAST, id ASC',
  price_desc: 'price_toman DESC NULLS LAST, id ASC',
  mileage_asc: 'mileage_km ASC NULLS LAST, id ASC',
  year_desc: 'year_value DESC NULLS LAST, id ASC',
};

publicRouter.get('/vehicles', async (req, res) => {
  const { where, params } = buildFilters(req.query);
  const sort = SORTS[req.query.sort] || SORTS.newest;
  const pageSize = Math.min(48, Math.max(1, toInt(req.query.pageSize) || 12));
  const page = Math.max(1, toInt(req.query.page) || 1);
  const offset = (page - 1) * pageSize;

  try {
    const countQ = await q(`SELECT COUNT(*)::int AS n FROM vehicles WHERE ${where}`, params);
    const total = countQ.rows[0].n;
    const dataQ = await q(
      `SELECT v.*, (i.vehicle_id IS NOT NULL) AS has_inspection
       FROM vehicles v
       LEFT JOIN inspection_reports i
         ON i.vehicle_id = v.id AND i.is_public = true AND i.approval_status = 'approved'
       WHERE ${where}
       ORDER BY ${sort}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageSize, offset],
    );
    res.json({
      items: dataQ.rows.map(toPublicVehicle),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error('[vehicles]', err.message);
    jsonError(res, 500, 'خطا در دریافت فهرست خودروها.');
  }
});

publicRouter.get('/vehicles/facets', async (_req, res) => {
  const base = `FROM vehicles WHERE ${PUBLIC_VISIBLE} AND ${LIST_CLOSED}`;
  try {
    const [tree, cities, bodies, fuels, transmissions, colors, range] = await Promise.all([
      q(`SELECT DISTINCT brand, model FROM vehicles WHERE ${PUBLIC_VISIBLE} AND ${LIST_CLOSED} ORDER BY brand, model`),
      q(`SELECT DISTINCT city ${base} ORDER BY city`),
      q(`SELECT DISTINCT body_type ${base} ORDER BY body_type`),
      q(`SELECT DISTINCT fuel_type ${base} ORDER BY fuel_type`),
      q(`SELECT DISTINCT transmission ${base} ORDER BY transmission`),
      q(`SELECT DISTINCT exterior_color ${base} ORDER BY exterior_color`),
      q(`SELECT MIN(price_toman) AS min, MAX(price_toman) AS max ${base}`),
    ]);
    const brands = {};
    for (const r of tree.rows) {
      if (!r.brand) continue;
      brands[r.brand] = brands[r.brand] || [];
      if (r.model && !brands[r.brand].includes(r.model)) brands[r.brand].push(r.model);
    }
    const col = (rows, key) => rows.map((r) => r[key]).filter(Boolean);
    res.json({
      brands,
      cities: col(cities.rows, 'city'),
      bodyTypes: col(bodies.rows, 'body_type'),
      fuelTypes: col(fuels.rows, 'fuel_type'),
      transmissions: col(transmissions.rows, 'transmission'),
      colors: col(colors.rows, 'exterior_color'),
      priceRange: { min: range.rows[0]?.min ?? null, max: range.rows[0]?.max ?? null },
    });
  } catch (err) {
    console.error('[facets]', err.message);
    jsonError(res, 500, 'خطا در دریافت فیلترها.');
  }
});

publicRouter.get('/vehicles/:slug', async (req, res) => {
  const { rows } = await q(
    `SELECT v.*, (i.vehicle_id IS NOT NULL) AS has_inspection
     FROM vehicles v
     LEFT JOIN inspection_reports i
       ON i.vehicle_id = v.id AND i.is_public = true AND i.approval_status = 'approved'
     WHERE v.slug = $1 AND v.publication_status = 'published'`,
    [req.params.slug],
  );
  if (!rows[0]) return jsonError(res, 404, 'این خودرو پیدا نشد یا منتشر نشده است.');
  const vehicle = toPublicVehicle(rows[0]);

  const media = await q(
    `SELECT url, kind, usage, alt_fa, sort_order FROM vehicle_media
     WHERE vehicle_id = $1 AND visibility = 'public' AND approval_status = 'approved'
     ORDER BY sort_order`,
    [rows[0].id],
  );
  const inspection = await q(
    `SELECT inspected_at, inspector_display_name, summary, body_parts, chassis, mechanical,
            equipment, tires, documents
     FROM inspection_reports
     WHERE vehicle_id = $1 AND is_public = true AND approval_status = 'approved'`,
    [rows[0].id],
  );

  res.json({
    vehicle,
    media: media.rows,
    inspection: inspection.rows[0] || null,
  });
});

publicRouter.get('/vehicles/:slug/similar', async (req, res) => {
  const base = await q('SELECT * FROM vehicles WHERE slug = $1', [req.params.slug]);
  const v = base.rows[0];
  if (!v) return res.json({ items: [] });
  const { rows } = await q(
    `SELECT v.*, (i.vehicle_id IS NOT NULL) AS has_inspection
     FROM vehicles v
     LEFT JOIN inspection_reports i ON i.vehicle_id = v.id AND i.is_public = true AND i.approval_status = 'approved'
     WHERE ${PUBLIC_VISIBLE} AND ${LIST_CLOSED} AND v.id <> $1
       AND (v.body_type = $2 OR v.brand = $3)
     ORDER BY v.featured DESC, v.created_at DESC
     LIMIT 3`,
    [v.id, v.body_type, v.brand],
  );
  res.json({ items: rows.map(toPublicVehicle) });
});

/* -------------------------------- articles -------------------------------- */

publicRouter.get('/articles', async (_req, res) => {
  const { rows } = await q(
    `SELECT slug, title, excerpt, cover_url, published_at FROM articles
     WHERE is_published = true ORDER BY published_at DESC`,
  );
  res.json({ items: rows });
});

publicRouter.get('/articles/:slug', async (req, res) => {
  const { rows } = await q(
    'SELECT slug, title, excerpt, body_md, cover_url, published_at FROM articles WHERE slug = $1 AND is_published = true',
    [req.params.slug],
  );
  if (!rows[0]) return jsonError(res, 404, 'این مقاله پیدا نشد.');
  res.json(rows[0]);
});

/* --------------------------------- leads --------------------------------- */

const LEAD_TYPES = new Set(['viewing', 'call', 'sell', 'request-car', 'contact']);

publicRouter.post('/leads/:type', async (req, res) => {
  const { type } = req.params;
  if (!LEAD_TYPES.has(type)) return jsonError(res, 404, 'نوع درخواست نامعتبر است.');
  const body = req.body || {};
  const { errors, data } = validateLead(type, body);
  if (Object.keys(errors).length) return jsonError(res, 422, 'اطلاعات فرم کامل نیست.', { fields: errors });

  const throttle = limiter(`${data.phone}|${req.ip}`);
  if (!throttle.ok) {
    return jsonError(res, 429, 'تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.', {
      retryAfterSeconds: Math.ceil(throttle.retryAfterMs / 1000),
    });
  }

  let vehicleId = null;
  if (data.vehicleId) {
    const { rows } = await q('SELECT id, lifecycle_status, publication_status FROM vehicles WHERE id = $1', [data.vehicleId]);
    const v = rows[0];
    if (!v || v.publication_status !== 'published') {
      return jsonError(res, 422, 'خودروی انتخاب‌شده معتبر نیست.', { fields: { vehicleId: 'خودرو معتبر نیست.' } });
    }
    if (type === 'viewing' && v.lifecycle_status !== 'available') {
      return jsonError(res, 409, 'این خودرو در حال حاضر برای بازدید جدید در دسترس نیست.', {
        fields: { vehicleId: 'این خودرو رزرو یا فروخته شده است.' },
      });
    }
    vehicleId = v.id;
  }

  const idempotencyKey =
    String(req.get('Idempotency-Key') || body.idempotencyKey || '').trim().slice(0, 100) || null;

  const publicCode = randomCode(type === 'sell' ? 'SL' : 'LD');
  const cols = ['public_code', 'type', 'vehicle_id', 'name', 'phone', 'message', 'preferred_date', 'preferred_slot', 'payload', 'idempotency_key', 'is_demo'];
  const values = [
    publicCode,
    type,
    vehicleId,
    data.name,
    data.phone,
    data.message || null,
    data.preferredDate || null,
    data.preferredSlot || null,
    data,
    idempotencyKey,
    true,
  ];

  try {
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(',');
    const insert = await q(
      `INSERT INTO leads (${cols.join(',')}) VALUES (${placeholders})
       ON CONFLICT (idempotency_key) DO NOTHING RETURNING public_code, id`,
      values,
    );
    if (insert.rows[0]) {
      return res.status(201).json({
        ok: true,
        publicCode: insert.rows[0].public_code,
        message:
          type === 'viewing'
            ? 'درخواستت ثبت شد؛ زمان بازدید پس از تماس تأیید می‌شود.'
            : 'درخواستت ثبت شد؛ به‌زودی با تو تماس می‌گیریم.',
      });
    }
    // Duplicate idempotency key: return the original receipt instead of a second lead.
    const existing = await q('SELECT public_code FROM leads WHERE idempotency_key = $1', [idempotencyKey]);
    return res.status(200).json({
      ok: true,
      duplicate: true,
      publicCode: existing.rows[0]?.public_code || publicCode,
      message: 'این درخواست قبلاً ثبت شده بود؛ نیازی به ارسال دوباره نیست.',
    });
  } catch (err) {
    console.error('[lead]', err.message);
    return jsonError(res, 500, 'ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.');
  }
});
