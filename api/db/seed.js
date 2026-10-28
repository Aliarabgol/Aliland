import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db.js';
import { hashPassword } from '../src/auth.js';
import { vehiclesWithGallery } from './data/vehicles.js';
import { articles } from './data/articles.js';
import { services } from './data/services.js';
import { faqs, siteSections, settings, mediaAssets, syntheticApplications } from './data/content.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export async function seed() {
  const { rows: existing } = await pool.query('select count(*)::int as n from vehicles');
  if (existing[0].n > 0) {
    console.log('[seed] data present, skipping');
    return;
  }

  console.log('[seed] inserting demo content');

  for (const v of vehiclesWithGallery) {
    await pool.query(
      `insert into vehicles
        (slug, make_fa, make_en, model_fa, model_en, trim_fa, trim_en, make_slug, category,
         body_style, year_gregorian, year_shamsi, engine_fa, engine_en, fuel, transmission,
         mileage_km, color_fa, color_en, color_hex, interior_fa, interior_en, condition,
         body_condition, price_demo, price_band, available, status, featured, specs, features,
         gallery, note_fa, note_en, tone, accent, sort_weight)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
               $23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37)
       on conflict (slug) do nothing`,
      [
        v.slug, v.make_fa, v.make_en, v.model_fa, v.model_en, v.trim_fa, v.trim_en, v.make_slug,
        v.category, v.body_style, v.year_gregorian, v.year_shamsi, v.engine_fa, v.engine_en,
        v.fuel, v.transmission, v.mileage_km, v.color_fa, v.color_en, v.color_hex, v.interior_fa,
        v.interior_en, v.condition, v.body_condition, v.price_demo, v.price_band,
        v.available ?? true, v.status, v.featured ?? false, JSON.stringify(v.specs),
        JSON.stringify(v.features), JSON.stringify(v.gallery), v.note_fa, v.note_en, v.tone,
        v.accent, v.sort_weight,
      ],
    );
  }

  let day = 0;
  for (const a of articles) {
    await pool.query(
      `insert into articles
        (slug, title_fa, title_en, excerpt_fa, excerpt_en, body_fa, body_en, category,
         cover_tone, read_minutes, status, featured, published_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'published',$11, now() - ($12 || ' days')::interval)
       on conflict (slug) do nothing`,
      [
        a.slug, a.title_fa, a.title_en, a.excerpt_fa, a.excerpt_en, a.body_fa, a.body_en,
        a.category, a.cover_tone, a.read_minutes, a.featured, String(++day * 4),
      ],
    );
  }

  for (const s of services) {
    await pool.query(
      `insert into services
        (slug, number, title_fa, title_en, kicker_fa, kicker_en, intro_fa, intro_en, problem_fa,
         problem_en, value_fa, value_en, steps, faq, tone, cta_href, status, sort_weight)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'published',$17)
       on conflict (slug) do nothing`,
      [
        s.slug, s.number, s.title_fa, s.title_en, s.kicker_fa, s.kicker_en, s.intro_fa, s.intro_en,
        s.problem_fa, s.problem_en, s.value_fa, s.value_en, JSON.stringify(s.steps),
        JSON.stringify(s.faq), s.tone, s.cta_href, s.sort_weight,
      ],
    );
  }

  for (const q of faqs) {
    await pool.query(
      `insert into faqs (question_fa, question_en, answer_fa, answer_en, "group", status, sort_weight)
       values ($1,$2,$3,$4,$5,'published',$6)`,
      [q.question_fa, q.question_en, q.answer_fa, q.answer_en, q.group, q.sort_weight],
    );
  }

  for (const sec of siteSections) {
    await pool.query(
      `insert into site_sections
        (key, label, title_fa, title_en, subtitle_fa, subtitle_en, cta_label_fa, cta_label_en,
         cta_href, visible, sort_weight)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       on conflict (key) do nothing`,
      [
        sec.key, sec.label, sec.title_fa, sec.title_en, sec.subtitle_fa, sec.subtitle_en,
        sec.cta_label_fa, sec.cta_label_en, sec.cta_href, sec.visible, sec.sort_weight,
      ],
    );
  }

  for (const s of settings) {
    await pool.query(
      `insert into site_settings (key, value) values ($1,$2)
       on conflict (key) do update set value = excluded.value`,
      [s.key, JSON.stringify(s.value)],
    );
  }

  for (const m of mediaAssets) {
    await pool.query(
      'insert into media_assets (name, description, url, kind, attribution) values ($1,$2,$3,$4,$5)',
      [m.name, m.description, m.url, m.kind, m.attribution],
    );
  }

  for (const a of syntheticApplications) {
    await pool.query(
      `insert into partner_applications
        (applicant_type, name, company, city, specialization, experience, service_area,
         partnership_model, description, portfolio_url, contact_method, notes, synthetic)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true)`,
      [
        a.applicant_type, a.name, a.company, a.city, a.specialization, a.experience,
        a.service_area, a.partnership_model, a.description, a.portfolio_url,
        a.contact_method, a.notes,
      ],
    );
  }

  await pool.query(
    `insert into activity_log (actor, action, entity, detail)
     values ('seed', 'seeded', 'demo', 'Synthetic AliLand portfolio content')`,
  );

  console.log('[seed] done');
}

export async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@aliland.demo').toLowerCase().trim();
  // The password comes from the owner's secret (ADMIN_PASSWORD). Only when that is
  // absent does the documented demo account exist — the login screen says so, and it
  // is meant for this portfolio preview, not for any production deployment.
  const password = process.env.ADMIN_PASSWORD || 'AliLandDemo!2026';
  const hash = hashPassword(password);
  const { rows } = await pool.query('select id from users where email = $1', [email]);
  if (rows.length === 0) {
    await pool.query(
      "insert into users (email, password_hash, display_name, role) values ($1,$2,'AliLand Admin','admin')",
      [email, hash],
    );
    console.log(`[seed] admin user created: ${email}`);
  } else if (process.env.ADMIN_PASSWORD) {
    await pool.query('update users set password_hash = $2, role = $3 where email = $1', [
      email,
      hash,
      'admin',
    ]);
    console.log('[seed] admin password synced from ADMIN_PASSWORD');
  }
}

export async function migrate() {
  const schema = await fs.readFile(path.join(here, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('[migrate] schema applied');
  await ensureAdmin();
  await seed();
}
