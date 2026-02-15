# OzLaundry Deployment Guide

This guide walks you through deploying the complete OzLaundry subscription platform, including frontend, backend, and database.

## Overview

The OzLaundry platform consists of:
- **Frontend**: React + Vite + Tailwind CSS (can be deployed to Vercel, Netlify, or GitHub Pages)
- **Backend**: Node.js + Express + Prisma (can be deployed to Render, Railway, or Heroku)
- **Database**: PostgreSQL (Supabase, Neon, or Railway)
- **Payments**: Stripe for subscription billing

## Quick Start (Free Hosting)

### Prerequisites

1. Node.js 18+ and pnpm installed
2. Git installed
3. Accounts on:
   - [Stripe](https://stripe.com) (for payments)
   - [Supabase](https://supabase.com) or [Neon](https://neon.tech) (for database)
   - [Render](https://render.com) or [Railway](https://railway.app) (for backend)
   - [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (for frontend)

---

## Step 1: Set Up Stripe

### 1.1 Create Stripe Account

1. Sign up at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Copy your **Secret Key** (starts with `sk_test_...`)

### 1.2 Create Subscription Products

In the Stripe Dashboard:

1. Go to **Products** > **Add Product**
2. Create three products:

#### Starter Plan
- Name: `Starter Plan`
- Description: `Up to 15 lbs per pickup, 2 pickups per month`
- Pricing: `$19.99 USD / month` (recurring)
- Copy the **Price ID** (starts with `price_...`)

#### Family Plan
- Name: `Family Plan`
- Description: `Up to 40 lbs per pickup, weekly pickups`
- Pricing: `$49.99 USD / month` (recurring)
- Copy the **Price ID**

#### Premium Plan
- Name: `Premium Plan`
- Description: `Unlimited weight, twice weekly pickups`
- Pricing: `$89.99 USD / month` (recurring)
- Copy the **Price ID**

### 1.3 Set Up Webhook

1. Go to **Developers** > **Webhooks**
2. Click **Add Endpoint**
3. Use URL: `https://your-api-url.onrender.com/api/webhooks/stripe` (you'll get this after deploying the backend)
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Signing Secret** (starts with `whsec_...`)

---

## Step 2: Set Up Database

### Option A: Supabase (Recommended)

1. Go to https://supabase.com and create a new project
2. Wait for the database to be provisioned (2-3 minutes)
3. Go to **Settings** > **Database**
4. Copy the **Connection String** (URI format)
   - Example: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

### Option B: Neon

1. Go to https://neon.tech and create a new project
2. Copy the connection string provided

### Option C: Railway

1. Go to https://railway.app
2. Create a new project
3. Add a PostgreSQL database
4. Copy the connection string from the database settings

---

## Step 3: Deploy Backend

### Option A: Render (Recommended - Free Tier)

1. Go to https://render.com and sign in
2. Click **New** > **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ozlaundry-api`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile.api`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   DATABASE_URL=<your-supabase-connection-string>
   JWT_SECRET=<generate-random-32-char-string>
   QR_HMAC_SECRET=<generate-random-32-char-string>
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_STARTER_PRICE_ID=price_...
   STRIPE_FAMILY_PRICE_ID=price_...
   STRIPE_PREMIUM_PRICE_ID=price_...
   CORS_ORIGINS=http://localhost:5173,https://your-frontend-url.vercel.app
   FEATURE_PAYMENTS=true
   NODE_ENV=production
   PORT=4000
   ```

6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. Copy your API URL (e.g., `https://ozlaundry-api.onrender.com`)

### Option B: Railway

1. Go to https://railway.app
2. Create a new project
3. Add your GitHub repository
4. Add environment variables (same as above)
5. Deploy

---

## Step 4: Run Database Migrations

After deploying the backend:

1. Install Railway or Render CLI (or use the web shell)

2. Connect to your deployed backend and run:
   ```bash
   cd apps/api
   npx prisma migrate deploy
   npx prisma db seed
   ```

   **Or via Render Web Shell:**
   - Go to your Render service
   - Click **Shell**
   - Run:
     ```bash
     cd apps/api
     npx prisma migrate deploy
     npx prisma db seed
     ```

3. This will:
   - Create all database tables
   - Seed demo data (admin and customer accounts)

---

## Step 5: Update Stripe Webhook URL

1. Go back to Stripe Dashboard > Webhooks
2. Edit the webhook endpoint
3. Update the URL to your deployed backend:
   ```
   https://your-api-url.onrender.com/api/webhooks/stripe
   ```

---

## Step 6: Deploy Frontend

### Option A: Vercel (Recommended)

1. Go to https://vercel.com and sign in
2. Click **New Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-api-url.onrender.com
   VITE_SOCKET_URL=https://your-api-url.onrender.com
   VITE_DEMO_MODE=false
   ```

6. Click **Deploy**
7. Wait for deployment (2-3 minutes)
8. Copy your frontend URL (e.g., `https://ozlaundry.vercel.app`)

### Option B: Netlify

1. Go to https://netlify.com and sign in
2. Click **Add New Site** > **Import an existing project**
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `apps/web`
   - **Build command**: `pnpm build`
   - **Publish directory**: `apps/web/dist`

5. Add Environment Variables (same as above)
6. Click **Deploy**

### Option C: GitHub Pages (Static Only)

**Note**: GitHub Pages can only host the frontend. You'll need a separate backend.

1. Update `package.json` in root:
   ```json
   "build:pages": "cd apps/web && VITE_APP_BASE=/your-repo-name/ pnpm build && cp dist/index.html dist/404.html && touch dist/.nojekyll"
   ```

2. Build:
   ```bash
   REPO_NAME=OzLaundry pnpm build:pages
   cp -r apps/web/dist docs/
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

3. Enable GitHub Pages:
   - Settings > Pages
   - Source: Deploy from branch
   - Branch: `main`, Folder: `/docs`

---

## Step 7: Update Backend CORS

1. Go to your backend deployment (Render/Railway)
2. Update the `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=http://localhost:5173,https://ozlaundry.vercel.app,https://www.ozlaundry.com.au
   ```

3. Restart the service

---

## Step 8: Test the Platform

1. Visit your frontend URL
2. Create a new account
3. Try subscribing to a plan (use Stripe test card: `4242 4242 4242 4242`)
4. Test all features:
   - Subscription management
   - Order creation
   - Complaint submission
   - Admin dashboard (login with admin account from seed data)

---

## Environment Variables Reference

### Frontend (apps/web)
```env
VITE_API_BASE_URL=https://your-api.onrender.com
VITE_SOCKET_URL=https://your-api.onrender.com
VITE_DEMO_MODE=false
```

### Backend (apps/api)
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your-secret-key-min-32-chars
QR_HMAC_SECRET=your-qr-secret-min-32-chars

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_FAMILY_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
FEATURE_PAYMENTS=true

# CORS
CORS_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app

# Server
PORT=4000
NODE_ENV=production
```

---

## Troubleshooting

### Stripe Checkout Not Working

- Check that all Stripe Price IDs are correct
- Verify `FEATURE_PAYMENTS=true` in backend env
- Check browser console for errors
- Ensure CORS is configured correctly

### Database Connection Failed

- Verify `DATABASE_URL` is correct
- Check that migrations have been run
- Ensure IP allowlist includes Render/Railway IPs (for Supabase)

### Webhook Not Receiving Events

- Verify webhook URL is correct
- Check webhook secret matches environment variable
- Test webhook using Stripe CLI: `stripe trigger checkout.session.completed`

### Frontend Can't Connect to Backend

- Check `VITE_API_BASE_URL` is correct
- Verify CORS origins include your frontend URL
- Check backend is running (visit `/health` endpoint)

---

## Recommended Free Tier Limits

- **Supabase**: 500MB database, 2GB bandwidth
- **Render**: 750 hours/month (free tier spins down after inactivity)
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Stripe**: Test mode is free, live mode charges 2.9% + $0.30 per transaction

---

## Going to Production

### Before Launch:

1. **Switch Stripe to Live Mode**:
   - Get live API keys
   - Create live products
   - Update environment variables

2. **Custom Domain**:
   - Add custom domain to Vercel/Netlify
   - Update CORS origins
   - Update Stripe webhook URL

3. **Security**:
   - Rotate all secrets
   - Enable rate limiting
   - Set up monitoring (Sentry, LogRocket)

4. **Backups**:
   - Enable automated database backups
   - Set up error tracking
   - Configure uptime monitoring

5. **Legal**:
   - Update contact information in legal pages
   - Add Google Analytics or privacy-friendly alternative
   - Set up cookie consent if required

---

## Support

For issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review environment variables
3. Check service logs (Render/Railway dashboard)
4. Open an issue on GitHub

---

## Cost Estimate (Paid Plans)

If you outgrow free tiers:

- **Database (Supabase Pro)**: $25/month
- **Backend (Render Standard)**: $7/month
- **Frontend (Vercel Pro)**: $20/month (optional)
- **Stripe**: 2.9% + $0.30 per transaction

**Total**: ~$52/month + transaction fees

---

**Built with ❤️ for OzLaundry - Geelong, Victoria**
