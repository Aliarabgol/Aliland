# AliLand — working notes

Portfolio concept for an Iranian car dealership. Monorepo: `api/` (Express + Postgres),
`web/` (React + Vite). Persian RTL is the primary locale, English LTR secondary; both
come from `web/src/lib/dict.js`.

## Running it

Everything runs from source through `docker-compose.base44.yml` (bind mounts + dev
servers) — never build or run a production image for the preview.

```bash
docker compose -f docker-compose.base44.yml up -d --build
docker compose -f docker-compose.base44.yml ps        # all three should be healthy
docker compose -f docker-compose.base44.yml logs -f api
```

- `web` — Vite dev server on host port **3000** (the preview entry point).
- `api` — Express on host port **4000**. The web app talks to it through the Vite
  proxy (`API_PROXY_TARGET`), single-origin, so the session cookie stays same-origin.
- `db` — Postgres 16. `api` runs `db/migrate.js` on every start and the seed is
  idempotent, so a fresh volume comes up populated with synthetic demo data.

Schema and seed live in `api/db/`; `node --watch` reloads the API on edits, Vite HMR
covers the frontend, so most changes need no restart.

## Admin / secrets

- `AUTH_SECRET` signs session cookies. Present as a platform secret.
- `ADMIN_PASSWORD` is **optional**: `api/db/seed.js` falls back to a built-in demo
  password and `GET /api/public/auth/config` reports `demoCredentials: true`, which the
  login screen uses to label itself as a demo account. Set the secret before any real
  use; the seed then re-syncs the admin password on the next API start.
- Placeholders belong in `.env.base44-defaults` (committed, listed first in compose).
  `/run/base44/app.env` is listed last so dashboard values always win.

## Verifying

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/         # 200
curl -s http://localhost:4000/api/health                                # {"ok":true...}
curl -s http://localhost:4000/api/public/vehicles | head -c 200         # seeded inventory
docker compose -f docker-compose.base44.yml exec -T api node -e "..."   # ad-hoc checks
```

No test runner is configured; check behaviour against the running stack. Sign in at
`/admin` to exercise the dashboard. All vehicle, price and service data is synthetic —
keep it that way.
