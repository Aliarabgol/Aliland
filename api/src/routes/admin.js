import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { q } from '../db.js';
import { requireAuth, requireAdmin, audit } from '../auth.js';
import { normalizeFa, toInt, jsonError } from '../util.js';

export const adminRouter = Router();
adminRouter.use(requireAuth);

const searchOf = (v) =>
  normalizeFa([v.brand, v.model, v.trim, v.title, v.description, v.city, (v.verified_options || []).join(' ')].join(' ')).toLowerCase();

function slugify(input, fallback) {
  const base = String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || fallback;
}

const LIFECYCLES = new Set(['available', 'reserved', 'sold', 'withdrawn']);
const PUBLICATIONS = new Set(['draft', 'pending_review', 'published', 'archived']);

function vehicleFields(body, current = {}) {
  const pick = (k) => (body[k] !== undefined ? body[k] : current[k]);
  const v = {
    title: String(pick('title') ?? '').trim(),
    brand: String(pick('brand') ?? '').trim(),
    model: String(pick('model') ?? '').trim(),
    trim: String(pick('trim') ?? '').trim() || null,
    year_value: toInt(pick('year')),
    year_calendar: pick('yearCalendar') === 'gregorian' ? 'gregorian' : pick('yearCalendar') === 'jalali' ? 'jalali' : null,
    mileage_km: toInt(pick('mileageKm')),
    body_type: String(pick('bodyType') ?? '').trim() || null,
    fuel_type: String(pick('fuelType') ?? '').trim() || null,
    transmission: String(pick('transmission') ?? '').trim() || null,
    exterior_color: String(pick('exteriorColor') ?? '').trim() || null,
    interior_color: String(pick('interiorColor') ?? '').trim() || null,
    engine_cc: toInt(pick('engineCc')),
    drivetrain: String(pick('drivetrain') ?? '').trim() || null,
    city: String(pick('city') ?? '').trim() || null,
    public_viewing_location: String(pick('viewingLocation') ?? '').trim() || null,
    price_toman: toInt(pick('price')),
    price_mode: pick('priceMode') === 'on_request' ? 'on_request' : 'fixed',
    price_confirmed_at: pick('priceConfirmedAt') || null,
    description: String(pick('description') ?? '').trim() || null,
    verified_options: Array.isArray(pick('options')) ? pick('options') : current.verified_options || [],
    disclosed_defects: Array.isArray(pick('defects')) ? pick('defects') : current.disclosed_defects || [],
    cover_media_url: String(pick('cover') ?? '').trim() || null,
    featured: !!pick('featured'),
    lifecycle_status: LIFECYCLES.has(pick('lifecycle')) ? pick('lifecycle') : current.lifecycle_status || 'available',
    publication_status: PUBLICATIONS.has(pick('publication'))
      ? pick('publication')
      : current.publication_status || 'draft',
    seo_title: String(pick('seoTitle') ?? '').trim() || null,
    seo_description: String(pick('seoDescription') ?? '').trim() || null,
  };
  if (v.price_mode === 'on_request') v.price_toman = null;
  return v;
}

adminRouter.get('/stats', async (_req, res) => {
  const [byLifecycle, leads, newLeads, articles, staff] = await Promise.all([
    q('SELECT lifecycle_status, COUNT(*)::int AS n FROM vehicles GROUP BY lifecycle_status'),
    q('SELECT type, status, COUNT(*)::int AS n FROM leads GROUP BY type, status'),
    q("SELECT COUNT(*)::int AS n FROM leads WHERE status = 'new'"),
    q('SELECT COUNT(*)::int AS n FROM articles'),
    q('SELECT COUNT(*)::int AS n FROM staff WHERE is_active = true'),
  ]);
  const lifecycle = Object.fromEntries(byLifecycle.rows.map((r) => [r.lifecycle_status, r.n]));
  const leadTotals = { new: 0, byType: {} };
  for (const r of leads.rows) {
    leadTotals.byType[r.type] = (leadTotals.byType[r.type] || 0) + r.n;
    if (r.status === 'new') leadTotals.new += r.n;
  }
  res.json({
    vehicles: {
      available: lifecycle.available || 0,
      reserved: lifecycle.reserved || 0,
      sold: lifecycle.sold || 0,
      withdrawn: lifecycle.withdrawn || 0,
      draft: 0,
    },
    leads: { total: Object.values(leadTotals.byType).reduce((a, b) => a + b, 0), new: newLeads.rows[0].n, byType: leadTotals.byType },
    articles: articles.rows[0].n,
    staff: staff.rows[0].n,
  });
});

/* -------------------------------- vehicles -------------------------------- */

adminRouter.get('/vehicles', async (req, res) => {
  const clauses = [];
  const params = [];
  const add = (sql, value) => {
    params.push(value);
    clauses.push(sql.replace('?', `$${params.length}`));
  };
  if (req.query.publication) add('publication_status = ?', req.query.publication);
  if (req.query.lifecycle) add('lifecycle_status = ?', req.query.lifecycle);
  const term = String(req.query.q || '').trim();
  if (term) add('search_text LIKE ?', `%${normalizeFa(term).toLowerCase()}%`);
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await q(`SELECT * FROM vehicles ${where} ORDER BY updated_at DESC LIMIT 200`, params);
  res.json({ items: rows });
});

adminRouter.get('/vehicles/:id', async (req, res) => {
  const { rows } = await q('SELECT * FROM vehicles WHERE id = $1', [req.params.id]);
  if (!rows[0]) return jsonError(res, 404, 'خودرو پیدا نشد.');
  let privateRow = null;
  if (req.user.role === 'admin') {
    const p = await q('SELECT * FROM vehicle_private WHERE vehicle_id = $1', [req.params.id]);
    privateRow = p.rows[0] || null;
  }
  res.json({ vehicle: rows[0], private: privateRow });
});

adminRouter.post('/vehicles', async (req, res) => {
  const v = vehicleFields(req.body || {});
  if (!v.title || !v.brand || !v.model) return jsonError(res, 422, 'عنوان، برند و مدل لازم است.');
  const code = `CS-${Math.floor(1000 + Math.random() * 9000)}`;
  const slug = slugify(req.body?.slug || `${v.brand}-${v.model}-${v.year_value || ''}`, code);
  try {
    const { rows } = await q(
      `INSERT INTO vehicles (
        public_code, slug, title, brand, model, trim, year_value, year_calendar, mileage_km,
        body_type, fuel_type, transmission, exterior_color, interior_color, engine_cc, drivetrain,
        city, public_viewing_location, price_toman, price_mode, price_confirmed_at, description,
        verified_options, disclosed_defects, cover_media_url, search_text, featured, is_demo,
        lifecycle_status, publication_status, seo_title, seo_description
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
        $23,$24,$25,$26,$27,false,$28,$29,$30,$31)
      RETURNING *`,
      [
        code, slug, v.title, v.brand, v.model, v.trim, v.year_value, v.year_calendar, v.mileage_km,
        v.body_type, v.fuel_type, v.transmission, v.exterior_color, v.interior_color, v.engine_cc,
        v.drivetrain, v.city, v.public_viewing_location, v.price_toman, v.price_mode,
        v.price_confirmed_at, v.description, JSON.stringify(v.verified_options), JSON.stringify(v.disclosed_defects),
        v.cover_media_url, searchOf(v), v.featured, v.lifecycle_status, v.publication_status,
        v.seo_title, v.seo_description,
      ],
    );
    await audit(req.user.id, 'vehicle.create', 'vehicle', rows[0].id, { title: v.title });
    res.status(201).json({ vehicle: rows[0] });
  } catch (err) {
    console.error('[admin vehicle create]', err.message);
    jsonError(res, 400, 'ثبت خودرو انجام نشد. ممکن است شناسهٔ یکتا تکراری باشد.');
  }
});

adminRouter.put('/vehicles/:id', async (req, res) => {
  const current = await q('SELECT * FROM vehicles WHERE id = $1', [req.params.id]);
  if (!current.rows[0]) return jsonError(res, 404, 'خودرو پیدا نشد.');
  const v = vehicleFields(req.body || {}, current.rows[0]);
  if (!v.title || !v.brand || !v.model) return jsonError(res, 422, 'عنوان، برند و مدل لازم است.');
  try {
    const { rows } = await q(
      `UPDATE vehicles SET title=$1, brand=$2, model=$3, trim=$4, year_value=$5, year_calendar=$6,
        mileage_km=$7, body_type=$8, fuel_type=$9, transmission=$10, exterior_color=$11,
        interior_color=$12, engine_cc=$13, drivetrain=$14, city=$15, public_viewing_location=$16,
        price_toman=$17, price_mode=$18, price_confirmed_at=$19, description=$20, verified_options=$21,
        disclosed_defects=$22, cover_media_url=$23, search_text=$24, featured=$25,
        lifecycle_status=$26, publication_status=$27, seo_title=$28, seo_description=$29, updated_at=now()
       WHERE id=$30 RETURNING *`,
      [
        v.title, v.brand, v.model, v.trim, v.year_value, v.year_calendar, v.mileage_km, v.body_type,
        v.fuel_type, v.transmission, v.exterior_color, v.interior_color, v.engine_cc, v.drivetrain,
        v.city, v.public_viewing_location, v.price_toman, v.price_mode, v.price_confirmed_at,
        v.description, JSON.stringify(v.verified_options), JSON.stringify(v.disclosed_defects),
        v.cover_media_url, searchOf(v), v.featured, v.lifecycle_status, v.publication_status,
        v.seo_title, v.seo_description, req.params.id,
      ],
    );
    await audit(req.user.id, 'vehicle.update', 'vehicle', req.params.id, { title: v.title });
    res.json({ vehicle: rows[0] });
  } catch (err) {
    console.error('[admin vehicle update]', err.message);
    jsonError(res, 400, 'ویرایش خودرو انجام نشد.');
  }
});

adminRouter.patch('/vehicles/:id/status', async (req, res) => {
  const { lifecycle, publication } = req.body || {};
  const sets = [];
  const params = [];
  if (lifecycle) {
    if (!LIFECYCLES.has(lifecycle)) return jsonError(res, 422, 'وضعیت موجودی نامعتبر است.');
    params.push(lifecycle);
    sets.push(`lifecycle_status = $${params.length}`);
  }
  if (publication) {
    if (!PUBLICATIONS.has(publication)) return jsonError(res, 422, 'وضعیت انتشار نامعتبر است.');
    params.push(publication);
    sets.push(`publication_status = $${params.length}`);
  }
  if (!sets.length) return jsonError(res, 422, 'تغییری ارسال نشده است.');
  params.push(req.params.id);
  const { rows } = await q(
    `UPDATE vehicles SET ${sets.join(', ')}, updated_at = now() WHERE id = $${params.length} RETURNING *`,
    params,
  );
  if (!rows[0]) return jsonError(res, 404, 'خودرو پیدا نشد.');
  await audit(req.user.id, 'vehicle.status', 'vehicle', req.params.id, { lifecycle, publication });
  res.json({ vehicle: rows[0] });
});

adminRouter.put('/vehicles/:id/private', requireAdmin, async (req, res) => {
  const b = req.body || {};
  const existing = await q('SELECT vehicle_id FROM vehicles WHERE id = $1', [req.params.id]);
  if (!existing.rows[0]) return jsonError(res, 404, 'خودرو پیدا نشد.');
  await q(
    `INSERT INTO vehicle_private (vehicle_id, collaboration_type, owner_name, owner_phone,
       purchase_price, commission, internal_note, private_file_url, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now())
     ON CONFLICT (vehicle_id) DO UPDATE SET
       collaboration_type = EXCLUDED.collaboration_type,
       owner_name = EXCLUDED.owner_name,
       owner_phone = EXCLUDED.owner_phone,
       purchase_price = EXCLUDED.purchase_price,
       commission = EXCLUDED.commission,
       internal_note = EXCLUDED.internal_note,
       private_file_url = EXCLUDED.private_file_url,
       updated_at = now()`,
    [
      req.params.id, b.collaborationType || null, b.ownerName || null, b.ownerPhone || null,
      toInt(b.purchasePrice), toInt(b.commission), b.internalNote || null, b.privateFileUrl || null,
    ],
  );
  await audit(req.user.id, 'vehicle.private', 'vehicle', req.params.id);
  res.json({ ok: true });
});

adminRouter.delete('/vehicles/:id', async (req, res) => {
  const { rowCount } = await q('DELETE FROM vehicles WHERE id = $1', [req.params.id]);
  if (!rowCount) return jsonError(res, 404, 'خودرو پیدا نشد.');
  await audit(req.user.id, 'vehicle.delete', 'vehicle', req.params.id);
  res.json({ ok: true });
});

/* ---------------------------------- leads --------------------------------- */

function salesCanSee(user, lead) {
  return user.role === 'admin' || lead.assigned_to == null || lead.assigned_to === user.id;
}

adminRouter.get('/leads', async (req, res) => {
  const params = [];
  let where = 'WHERE 1=1';
  if (req.user.role !== 'admin') {
    params.push(req.user.id);
    where += ` AND (assigned_to = $${params.length} OR assigned_to IS NULL)`;
  }
  if (req.query.type) {
    params.push(req.query.type);
    where += ` AND type = $${params.length}`;
  }
  if (req.query.status) {
    params.push(req.query.status);
    where += ` AND status = $${params.length}`;
  }
  const { rows } = await q(`SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT 300`, params);
  res.json({ items: rows });
});

adminRouter.get('/leads/:id', async (req, res) => {
  const { rows } = await q('SELECT * FROM leads WHERE id = $1', [req.params.id]);
  const lead = rows[0];
  if (!lead) return jsonError(res, 404, 'درخواست پیدا نشد.');
  if (!salesCanSee(req.user, lead)) return jsonError(res, 403, 'این درخواست به کارشناس دیگری واگذار شده است.');
  res.json({ lead });
});

adminRouter.delete('/leads/:id', async (req, res) => {
  const { rows } = await q('SELECT * FROM leads WHERE id = $1', [req.params.id]);
  if (!rows[0]) return jsonError(res, 404, 'درخواست پیدا نشد.');
  if (!salesCanSee(req.user, rows[0])) return jsonError(res, 403, 'این درخواست به کارشناس دیگری واگذار شده است.');
  await q('DELETE FROM leads WHERE id = $1', [req.params.id]);
  await audit(req.user.id, 'lead.delete', 'lead', req.params.id);
  res.json({ ok: true });
});

adminRouter.patch('/leads/:id', async (req, res) => {
  const { rows } = await q('SELECT * FROM leads WHERE id = $1', [req.params.id]);
  const lead = rows[0];
  if (!lead) return jsonError(res, 404, 'درخواست پیدا نشد.');
  if (!salesCanSee(req.user, lead)) return jsonError(res, 403, 'این درخواست به کارشناس دیگری واگذار شده است.');

  const sets = [];
  const params = [];
  if (req.body?.status) {
    const allowed = ['new', 'contacted', 'scheduled', 'won', 'lost', 'closed'];
    if (!allowed.includes(req.body.status)) return jsonError(res, 422, 'وضعیت نامعتبر است.');
    params.push(req.body.status);
    sets.push(`status = $${params.length}`);
  }
  if (req.body?.assignedTo !== undefined) {
    if (req.user.role !== 'admin') return jsonError(res, 403, 'واگذاری فقط توسط مدیر انجام می‌شود.');
    params.push(req.body.assignedTo ? toInt(req.body.assignedTo) : null);
    sets.push(`assigned_to = $${params.length}`);
  }
  if (!sets.length) return jsonError(res, 422, 'تغییری ارسال نشده است.');
  params.push(req.params.id);
  const updated = await q(
    `UPDATE leads SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params,
  );
  await audit(req.user.id, 'lead.update', 'lead', req.params.id, { status: req.body.status, assignedTo: req.body.assignedTo });
  res.json({ lead: updated.rows[0] });
});

/* -------------------------------- settings -------------------------------- */

adminRouter.get('/settings', async (_req, res) => {
  const { rows } = await q('SELECT data, mode, updated_at FROM settings WHERE id = 1');
  res.json({ settings: rows[0]?.data || {}, mode: rows[0]?.mode || 'demo' });
});

adminRouter.put('/settings', requireAdmin, async (req, res) => {
  const data = req.body?.settings;
  if (!data || typeof data !== 'object') return jsonError(res, 422, 'تنظیمات نامعتبر است.');
  const mode = req.body?.mode === 'live' ? 'live' : 'demo';
  await q('UPDATE settings SET data = $1, mode = $2, updated_at = now() WHERE id = 1', [data, mode]);
  await audit(req.user.id, 'settings.update', 'settings', '1', { mode });
  res.json({ ok: true, mode });
});

/* -------------------------------- articles -------------------------------- */

adminRouter.get('/articles', async (_req, res) => {
  const { rows } = await q('SELECT * FROM articles ORDER BY published_at DESC NULLS LAST');
  res.json({ items: rows });
});

adminRouter.post('/articles', requireAdmin, async (req, res) => {
  const b = req.body || {};
  if (!b.title || !b.slug) return jsonError(res, 422, 'عنوان و slug لازم است.');
  const { rows } = await q(
    `INSERT INTO articles (slug, title, excerpt, body_md, is_published, published_at, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,true) ON CONFLICT (slug) DO NOTHING RETURNING *`,
    [b.slug, b.title, b.excerpt || null, b.body_md || null, !!b.isPublished, b.isPublished ? new Date() : null],
  );
  if (!rows[0]) return jsonError(res, 409, 'این slug قبلاً استفاده شده است.');
  res.status(201).json({ article: rows[0] });
});

adminRouter.put('/articles/:id', requireAdmin, async (req, res) => {
  const b = req.body || {};
  const { rows } = await q(
    `UPDATE articles SET title=COALESCE($1,title), excerpt=COALESCE($2,excerpt), body_md=COALESCE($3,body_md),
       is_published=COALESCE($4,is_published),
       published_at = CASE WHEN $4 = true AND published_at IS NULL THEN now() ELSE published_at END
     WHERE id=$5 RETURNING *`,
    [b.title ?? null, b.excerpt ?? null, b.body_md ?? null, b.isPublished ?? null, req.params.id],
  );
  if (!rows[0]) return jsonError(res, 404, 'مقاله پیدا نشد.');
  res.json({ article: rows[0] });
});

adminRouter.delete('/articles/:id', requireAdmin, async (req, res) => {
  await q('DELETE FROM articles WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

/* ---------------------------------- staff --------------------------------- */

adminRouter.get('/staff', requireAdmin, async (_req, res) => {
  const { rows } = await q('SELECT id, name, email, role, is_active, created_at FROM staff ORDER BY id');
  res.json({ items: rows });
});

adminRouter.post('/staff', requireAdmin, async (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.email || !b.password) return jsonError(res, 422, 'نام، ایمیل و گذرواژه لازم است.');
  if (String(b.password).length < 8) return jsonError(res, 422, 'گذرواژه حداقل ۸ نویسه باشد.');
  const hash = await bcrypt.hash(String(b.password), 10);
  try {
    const { rows } = await q(
      `INSERT INTO staff (name, email, password_hash, role)
       VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, is_active`,
      [b.name, String(b.email).toLowerCase(), hash, b.role === 'admin' ? 'admin' : 'sales'],
    );
    await audit(req.user.id, 'staff.create', 'staff', rows[0].id);
    res.status(201).json({ staff: rows[0] });
  } catch {
    jsonError(res, 409, 'این ایمیل قبلاً ثبت شده است.');
  }
});

adminRouter.patch('/staff/:id', requireAdmin, async (req, res) => {
  const sets = [];
  const params = [];
  if (req.body?.isActive !== undefined) {
    params.push(!!req.body.isActive);
    sets.push(`is_active = $${params.length}`);
  }
  if (req.body?.role) {
    params.push(req.body.role === 'admin' ? 'admin' : 'sales');
    sets.push(`role = $${params.length}`);
  }
  if (!sets.length) return jsonError(res, 422, 'تغییری ارسال نشده است.');
  params.push(req.params.id);
  const { rows } = await q(
    `UPDATE staff SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING id, name, email, role, is_active`,
    params,
  );
  if (!rows[0]) return jsonError(res, 404, 'کارمند پیدا نشد.');
  res.json({ staff: rows[0] });
});
