# OzLaundry MVP

Monorepo Laundry Subscription MVP with static React frontend + external API backend + Supabase/Postgres.

## Repo tree

```text
.
├── .env.example
├── .github/workflows/deploy-pages.yml
├── Dockerfile.api
├── docker-compose.yml
├── render.yaml
├── apps
│   ├── api
│   │   ├── prisma
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── src
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   ├── lib
│   │   │   ├── middleware
│   │   │   ├── routes
│   │   │   └── socket
│   │   └── tests
│   └── web
│       └── src
├── packages/shared/src
├── tests/playwright/smoke.spec.ts
└── playwright.config.ts
```

## Local setup

1. `pnpm install`
2. `docker compose up -d`
3. `cp .env.example .env` and adjust variables.
4. `pnpm --filter api prisma:generate`
5. `pnpm --filter api prisma:migrate`
6. `pnpm --filter api prisma:seed`
7. `pnpm dev`

Web runs on `http://localhost:5173`, API on `http://localhost:4000`.

## Auth model

- Email/password register + login.
- JWT is set in `httpOnly` cookie (`auth_token`) for same-site deployments.
- Token fallback is also returned in JSON and accepted as `Authorization: Bearer <token>` for cross-domain GitHub Pages demos.

## Features delivered

- Routes: `/`, `/learn-more`, `/pricing`, `/login`, `/register`, `/dashboard`, `/orders/:id`, `/admin/orders`, `/admin/features`
- Order lifecycle stages + status logs
- Socket.io realtime updates to `user:<id>` rooms
- QR payload signing + admin scan endpoint
- Feature flags persisted in DB + admin toggles
- Stripe checkout stub behind `FEATURE_PAYMENTS`
- `/health` endpoint with DB connectivity
- Modules registry files in web/api for easy future feature wiring

## Deploy frontend to GitHub Pages

1. Push to `main`.
2. In repo settings, enable **Pages** with GitHub Actions source.
3. Ensure workflow `.github/workflows/deploy-pages.yml` exists.
4. Workflow builds web app with `BASE=/<repo-name>/` and deploys `apps/web/dist`.
5. Set web envs as repository variables if needed:
   - `VITE_API_BASE_URL=https://your-api-domain`
   - `VITE_SOCKET_URL=https://your-api-domain`

## Deploy backend

### Option A: Render with Docker

1. Create new Web Service from repo.
2. Select `render.yaml` or configure manually:
   - Dockerfile: `Dockerfile.api`
   - Port: `4000`
3. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `QR_HMAC_SECRET`, optional Stripe keys.
4. Use Supabase Postgres URL in `DATABASE_URL`.
5. Run migrations once from a shell/job: `pnpm --filter api prisma:migrate`.

### Option B: Railway/Fly

- Deploy using `Dockerfile.api`.
- Configure same env vars.
- Point to Supabase Postgres.

## Troubleshooting

### GitHub Pages base path issues

- Ensure `BrowserRouter` uses `basename={import.meta.env.BASE_URL}`.
- Build with `BASE=/<repo-name>/`.

### 404 on refresh (SPA)

- GitHub Pages does not natively rewrite all routes; use SPA fallback strategy (copy `index.html` to `404.html`) if needed.

### CORS errors

- Add both origins to `CORS_ORIGINS`, e.g. `http://localhost:5173,https://<user>.github.io`.

### Cookie not set across domains

- Cross-domain demos should use Bearer token fallback from login/register response.

## Smoke test

- `pnpm test:smoke` runs Playwright flow for home -> learn more -> get started -> register -> dashboard -> create order.
