# OzLaundry MVP

Subscription laundry service with realtime tracking, QR scanning, and admin dashboard.
Runs entirely client-side using browser localStorage — no backend required for demo.

## Demo credentials

- **Customer:** `user@ozlaundry.local` / `Customer123!`
- **Admin:** `admin@ozlaundry.local` / `Admin123!`

## Repo structure

```text
.
├── apps/
│   ├── web/          # Vite + React + TypeScript SPA
│   └── api/          # Express backend (optional, not needed for demo)
├── packages/shared/  # Zod schemas shared between web & api
├── docs/             # Built SPA output (served by GitHub Pages)
└── tests/playwright/ # E2E smoke tests
```

## Routes

| Path | Description | Access |
|------|-------------|--------|
| `/` | Landing page with "Learn more" and "Get started" buttons | Public |
| `/learn-more` | Service description | Public |
| `/pricing` | Demo pricing tiers | Public |
| `/login` | Login form (pre-filled with demo credentials) | Public |
| `/register` | Registration form | Public |
| `/dashboard` | User orders list + create order | Customer |
| `/orders/:id` | Order detail + QR code | Customer |
| `/admin/orders` | All orders + stage management + QR scan | Admin |
| `/admin/features` | Feature flag toggles | Admin |

## Local development

```bash
pnpm install
pnpm --filter web dev
```

Web runs on `http://localhost:5173`. No backend or environment variables needed — demo mode activates automatically.

## Deploying to GitHub Pages (No Actions)

This project uses **branch deploy from `/docs`**. No GitHub Actions required.

### 1. Build the site

```bash
REPO_NAME=OzLaundry pnpm build:pages
```

Replace `OzLaundry` with your actual repository name.

This outputs the built SPA into the `/docs` folder at the repository root, copies `index.html` to `404.html` for SPA routing, and creates `.nojekyll` to prevent Jekyll processing.

### 2. Commit the `/docs` folder

```bash
git add docs/
git commit -m "Build site for GitHub Pages"
git push
```

### 3. Configure GitHub Pages

1. Go to your repository on GitHub.
2. Navigate to **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set **Branch** to `main` and **Folder** to `/docs`.
5. Click **Save**.

### 4. Access your site

Your site will be available at:

```
https://<username>.github.io/<repo-name>/
```

One push to `main` updates the live site.

## Troubleshooting

### GitHub Pages shows README instead of the app

The **Folder** setting under Settings > Pages is set to `/ (root)` instead of `/docs`. Change it to `/docs` and save.

### Blank page loads

The `REPO_NAME` was not set (or set incorrectly) during the build. The `<base>` tag in `index.html` must match your repository name. Rebuild:

```bash
REPO_NAME=your-repo-name pnpm build:pages
```

### 404 on page refresh

Ensure `docs/404.html` exists. The post-build script copies `index.html` to `404.html` automatically. If missing, re-run the build.

### Routes don't work / broken links

`BrowserRouter` uses `basename={import.meta.env.BASE_URL}` which Vite sets from the `base` config. Ensure `REPO_NAME` matches during build.

## Zero-backend demo mode

When no `VITE_API_BASE_URL` environment variable is set, the frontend runs in **Demo Mode**:

- All data is stored in browser `localStorage`.
- Auth (login/register/logout) works with local data.
- Orders can be created, listed, and have their stage updated.
- Feature flags are toggleable and persisted locally.
- Realtime updates are simulated via `CustomEvent` dispatches.
- A green "Demo Mode" banner is shown at the top of every page.

No environment variables, no database, no backend service required.

## Connecting a real backend (optional)

Set these environment variables before building:

```bash
VITE_API_BASE_URL=https://your-api.example.com
VITE_SOCKET_URL=https://your-api.example.com
```

The frontend will switch from localStorage demo mode to real HTTP/WebSocket calls.

## Verification checklist

After deploying, confirm:

- [ ] `docs/index.html` exists in the repo
- [ ] `docs/404.html` exists in the repo
- [ ] `docs/.nojekyll` exists in the repo
- [ ] Settings > Pages points to `main` branch, `/docs` folder
- [ ] Live site shows the app UI (not README)
- [ ] Page refresh on `/login` or `/dashboard` works (no 404)
- [ ] "Learn more" button navigates to `/learn-more`
- [ ] "Get started" button navigates to `/login`
