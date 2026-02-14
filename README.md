# OzLaundry - Modern Laundry Subscription Service

A production-ready laundry subscription web application with real-time tracking, QR code scanning, and comprehensive admin dashboard. Built with React, TypeScript, Tailwind CSS, Express, and Prisma.

## ✨ Features

- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔐 **Authentication**: Email/password auth with JWT tokens
- 📦 **Order Management**: Create, track, and manage laundry orders
- 🏷️ **QR Codes**: Generate and scan QR codes for order tracking
- 📊 **Admin Dashboard**: Manage orders and toggle feature flags
- 🔄 **Real-time Updates**: WebSocket notifications for order status changes
- 💾 **Demo Mode**: Fully functional demo using localStorage (no backend required)
- 🚀 **GitHub Pages Ready**: Automatic deployment with GitHub Actions
- 🐳 **Docker Ready**: Containerized backend for easy deployment

## 📋 Demo Credentials

- **Customer**: `user@ozlaundry.local` / `Customer123!`
- **Admin**: `admin@ozlaundry.local` / `Admin123!`

## 🏗️ Repository Structure

```text
.
├── apps/
│   ├── web/              # Vite + React + TypeScript + Tailwind
│   │   ├── src/
│   │   │   ├── pages/    # Page components
│   │   │   ├── components/ # Reusable UI components
│   │   │   └── lib/      # API client and utilities
│   │   └── scripts/      # Build scripts
│   └── api/              # Express + Prisma backend
│       ├── src/
│       │   ├── routes/   # API endpoints
│       │   ├── lib/      # Auth, QR, utilities
│       │   └── socket/   # WebSocket server
│       └── prisma/       # Database schema and migrations
├── packages/
│   └── shared/           # Zod schemas shared between web & api
├── tests/
│   └── playwright/       # E2E smoke tests
├── .github/
│   └── workflows/        # GitHub Actions for deployment
└── docs/                 # Built frontend (GitHub Pages)
```

## 🎯 Available Routes

| Path | Description | Access |
|------|-------------|--------|
| `/` | Landing page with hero and features | Public |
| `/learn-more` | Detailed service information | Public |
| `/pricing` | Pricing plans | Public |
| `/login` | Login form | Public |
| `/register` | Registration form | Public |
| `/dashboard` | User orders + create new order | Customer |
| `/orders/:id` | Order detail with QR code and timeline | Customer |
| `/admin/orders` | All orders + stage management + QR scan | Admin |
| `/admin/features` | Feature flag toggles | Admin |

---

## 🚀 Quick Start

### Local Development (Frontend Only - Demo Mode)

```bash
# Install dependencies
pnpm install

# Start the frontend (demo mode, no backend needed)
pnpm --filter web dev
```

Visit `http://localhost:5173` - The app runs in demo mode using localStorage.

### Local Development (Full Stack)

```bash
# 1. Start the database
docker compose up -d

# 2. Set up the backend
cd apps/api
cp ../../.env.example .env
# Edit .env and set DATABASE_URL if needed

# Run migrations and seed
pnpm prisma:migrate
pnpm prisma:seed

# 3. Start both backend and frontend
cd ../..
pnpm dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`

---

## 📦 Deployment

### Option 1: GitHub Pages (Frontend Only - Automatic)

This project includes a GitHub Actions workflow that automatically deploys the frontend to GitHub Pages on every push to `main`.

#### Setup:

1. **Enable GitHub Pages**:
   - Go to your repository **Settings > Pages**
   - Set **Source** to "GitHub Actions"
   - Save

2. **Push to main**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Access your site**:
   ```
   https://<username>.github.io/<repo-name>/
   ```

The workflow will:
- Install dependencies
- Build the frontend with the correct base path
- Generate `404.html` for SPA routing
- Deploy to GitHub Pages

### Option 2: GitHub Pages (Frontend Only - Manual)

If you prefer manual deployment or want to use the `/docs` folder approach:

```bash
# Build for GitHub Pages
REPO_NAME=OzLaundry pnpm build:pages

# Commit and push
git add docs/
git commit -m "Build for GitHub Pages"
git push

# Configure GitHub Pages
# Settings > Pages > Source: Deploy from branch
# Branch: main, Folder: /docs
```

### Option 3: Render (Backend Deployment)

Deploy the backend API to Render for a production environment.

#### Manual Setup:

1. **Create a new Web Service** on [Render](https://render.com)

2. **Connect your repository**

3. **Configure the service**:
   - **Name**: `ozlaundry-api`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile.api`
   - **Plan**: Choose your plan

4. **Set Environment Variables**:
   ```
   DATABASE_URL=<your-supabase-postgres-url>
   JWT_SECRET=<random-secret-key>
   QR_HMAC_SECRET=<another-random-secret>
   CORS_ORIGINS=https://<username>.github.io,https://<username>.github.io/<repo-name>
   NODE_ENV=production
   PORT=4000
   ```

5. **Deploy**

Your API will be available at: `https://ozlaundry-api.onrender.com`

#### Using render.yaml (Automatic):

The repository includes a `render.yaml` file for Infrastructure as Code deployment:

```bash
# Push to main, then connect via Render dashboard
# Render will auto-detect render.yaml and set up the service
```

### Option 4: Supabase (Database)

1. **Create a new project** on [Supabase](https://supabase.com)

2. **Get your connection string**:
   - Go to Project Settings > Database
   - Copy the connection string (URI)

3. **Update your backend `.env`**:
   ```
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

4. **Run migrations**:
   ```bash
   cd apps/api
   pnpm prisma:migrate
   pnpm prisma:seed
   ```

---

## 🔗 Connecting Frontend to Backend

To connect your GitHub Pages frontend to a live backend:

### Build with API Configuration

```bash
# In apps/web/.env or as environment variables
VITE_API_BASE_URL=https://your-api.onrender.com
VITE_SOCKET_URL=https://your-api.onrender.com

# Build
cd apps/web
pnpm build

# Or for GitHub Pages
REPO_NAME=OzLaundry pnpm build:pages
```

### Update CORS on Backend

Make sure your backend's `CORS_ORIGINS` includes your GitHub Pages URL:

```env
CORS_ORIGINS=http://localhost:5173,https://<username>.github.io,https://<username>.github.io/<repo-name>
```

---

## 🐳 Docker

### Backend Only

```bash
# Build
docker build -f Dockerfile.api -t ozlaundry-api .

# Run
docker run -p 4000:4000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=secret \
  -e CORS_ORIGINS=http://localhost:5173 \
  ozlaundry-api
```

### Full Stack (docker-compose)

```bash
# Start everything
docker compose up -d

# Stop
docker compose down
```

This starts:
- PostgreSQL database on port 5432
- (Add more services as needed)

---

## 🧪 Testing

### Run Playwright E2E Tests

```bash
# Install Playwright browsers (first time only)
pnpm exec playwright install

# Start the dev server
pnpm --filter web dev

# Run tests (in another terminal)
pnpm test:smoke
```

Tests include:
- Navigation flows
- User registration and login
- Order creation
- Admin order management
- Feature flag toggling
- QR code display

---

## 🔧 Environment Variables

### Frontend (`apps/web/.env`)

```env
# API Configuration (leave empty for demo mode)
VITE_API_BASE_URL=              # e.g., https://your-api.onrender.com
VITE_SOCKET_URL=                # e.g., https://your-api.onrender.com
VITE_DEMO_MODE=true             # Set to false to force API mode
```

### Backend (`apps/api/.env`)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ozlaundry

# Authentication
JWT_SECRET=change-me-in-production
QR_HMAC_SECRET=change-me-qr-secret

# CORS (comma-separated)
CORS_ORIGINS=http://localhost:5173,https://yourusername.github.io

# Optional
COOKIE_DOMAIN=                  # Leave empty for same-origin
PORT=4000
NODE_ENV=development

# Stripe (if payments enabled)
STRIPE_SECRET_KEY=
FEATURE_PAYMENTS=false
```

---

## 🛠️ Troubleshooting

### GitHub Pages

#### Blank Page

**Problem**: Page loads but shows blank screen.

**Solution**: The base path is incorrect. Rebuild with correct `REPO_NAME`:

```bash
REPO_NAME=<your-actual-repo-name> pnpm build:pages
git add docs/
git commit -m "Fix base path"
git push
```

#### 404 on Refresh

**Problem**: Direct navigation to routes like `/login` returns 404.

**Solution**: Ensure `docs/404.html` exists (should be created automatically by build script).

```bash
# Verify it exists
ls docs/404.html

# If missing, rebuild
pnpm build:pages
```

#### Routes Don't Work

**Problem**: Clicking links doesn't navigate.

**Solution**: Ensure `BrowserRouter` uses `basename={import.meta.env.BASE_URL}` (already configured in `main.tsx`).

### Backend / API

#### CORS Errors

**Problem**: Frontend shows CORS errors when calling API.

**Solution**: Add your GitHub Pages URL to `CORS_ORIGINS`:

```env
CORS_ORIGINS=http://localhost:5173,https://yourusername.github.io,https://yourusername.github.io/OzLaundry
```

#### Cookies Not Working

**Problem**: Authentication cookies not being set/sent.

**Solution**:
- If frontend and backend are on different domains, cookies won't work due to SameSite restrictions
- Use Bearer token authentication instead (already supported)
- OR deploy frontend and backend to same domain

#### Database Connection Fails

**Problem**: Backend can't connect to database.

**Solution**:
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
cd apps/api
pnpm prisma db pull
```

### Build Issues

#### pnpm Version Mismatch

**Problem**: Build fails with pnpm version error.

**Solution**: The project uses `packageManager` field in `package.json`. Install the correct version:

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

#### Tailwind Styles Not Applied

**Problem**: App loads but has no styling.

**Solution**: Ensure Tailwind dependencies are installed and CSS is imported:

```bash
cd apps/web
pnpm install
# Verify src/index.css is imported in src/main.tsx
```

---

## 📝 Scripts Reference

### Root Level

```bash
pnpm dev              # Start all packages in dev mode
pnpm build            # Build all packages
pnpm lint             # Type check all packages
pnpm test:smoke       # Run Playwright tests
pnpm build:pages      # Build frontend for GitHub Pages
```

### Frontend (`apps/web`)

```bash
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Build for production
pnpm build:pages      # Build for GitHub Pages
pnpm preview          # Preview production build
pnpm lint             # Type check
```

### Backend (`apps/api`)

```bash
pnpm dev              # Start dev server with hot reload
pnpm build            # Build TypeScript to JavaScript
pnpm start            # Start production server
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run database migrations
pnpm prisma:seed      # Seed database with demo data
pnpm test             # Run API tests
```

---

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT auth
- **Socket.IO** - WebSocket server
- **QRCode** - QR code generation

### Shared
- **Zod** - Schema validation
- **pnpm** - Package manager
- **Playwright** - E2E testing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Environment Variables](#-environment-variables) configuration
3. Open an issue on GitHub

---

## ✅ Deployment Checklist

### GitHub Pages (Frontend)

- [ ] GitHub Actions workflow is set up (`.github/workflows/deploy-pages.yml`)
- [ ] Repository Settings > Pages is configured to use GitHub Actions
- [ ] Build includes correct `REPO_NAME` environment variable
- [ ] `docs/404.html` exists for SPA routing
- [ ] `docs/.nojekyll` exists to prevent Jekyll processing
- [ ] Demo mode works when visiting the site
- [ ] All routes are accessible and navigation works
- [ ] Page refresh doesn't return 404

### Render (Backend)

- [ ] Supabase PostgreSQL database is created
- [ ] `DATABASE_URL` environment variable is set
- [ ] `JWT_SECRET` is set to a secure random value
- [ ] `QR_HMAC_SECRET` is set to a secure random value
- [ ] `CORS_ORIGINS` includes your GitHub Pages URL
- [ ] Database migrations have been run
- [ ] Database has been seeded with demo data
- [ ] Health endpoint returns 200 (`GET /health`)
- [ ] API endpoints are accessible

### Integration

- [ ] Frontend `VITE_API_BASE_URL` points to Render backend
- [ ] Frontend `VITE_SOCKET_URL` points to Render backend
- [ ] Frontend can successfully register/login
- [ ] Frontend can create and view orders
- [ ] Admin can update order stages
- [ ] Real-time updates work (WebSocket connection)
- [ ] CORS is properly configured (no browser errors)

---

**Built with ❤️ by the OzLaundry team**
