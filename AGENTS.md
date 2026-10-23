# AGENTS.md

## What runs here (Base44 sandbox)

This repository contains **two unrelated projects**:

1. `app/`, `gradle/`, `build.gradle.kts`, `settings.gradle.kts` — the original **native Android** app
   (`AstroNiyat` / `آسترونیت`, Kotlin + Jetpack Compose + Room + Gemini). It is untouched and is **not**
   part of the sandbox preview.
2. `web/` + `api/` — a **Persian RTL car-showroom web app** added for the Base44 request. This is what
   `docker-compose.base44.yml` runs.

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web (Vite dev server, live reload): host port **3000** → container `5173`
- API (Express): host port **8000** → container `8000`; web proxies `/api` → `http://api:8000`
- Postgres 16 with a named volume `showroom_db`

The API creates the schema and seeds demo data **idempotently** on boot (`api/src/seed.js`). It never
deletes or overwrites existing rows.

### Demo staff accounts (development seed)

| role | email | password |
| --- | --- | --- |
| admin | `admin@showroom.local` | `admin1234` |
| sales | `sales@showroom.local` | `sales1234` |

Change these before any real use. The seed only inserts them when the email is missing.

## Things that are not obvious

- **No Base44 SDK / Entities.** This is an imported repo, so the spec's "Base44 Entities / Backend
  Functions / internal auth" are implemented as an equivalent Node + Postgres backend in `api/`.
  Data persistence, auth and access rules live there.
- **Vite host allowlist.** `web/vite.config.js` sets `server.allowedHosts = true` only when
  `BASE44_PREVIEW_MODE === "1"`; unset/other values keep Vite's normal host check.
- **API env precedence.** `env_file` lists `.env.base44-defaults` first and `/run/base44/app.env` last,
  so platform secrets override the committed placeholders. `DATABASE_URL` is local infra and stays in
  Compose `environment`.
- **Guest photo uploads are disabled on purpose** (spec allows deferring when private upload is not
  guaranteed). The sell wizard records the description and the dealership collects photos during the
  secure follow-up call.
- **Demo data is labelled.** Every seeded vehicle has `is_demo = true`; cards show a «نمونه» badge and
  placeholders instead of real photos.

## Verify

```bash
curl -fsS http://localhost:3000/ >/dev/null && echo web-ok
curl -fsS http://localhost:3000/api/health && echo api-ok
docker compose -f docker-compose.base44.yml ps
```

Seed data check: `/api/vehicles?pageSize=12` returns **10** public records (9 available + 1 reserved).
Sold and withdrawn are excluded from inventory by default, and the 2 internal test records (`draft`,
`pending_review`) never appear (their detail routes return 404).

Tests: there is no automated test suite for the web app yet; verification is done against the running
stack (health endpoints + preview flows).
