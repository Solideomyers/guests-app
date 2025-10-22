# 🚀 Deployment Guide: Vercel + Render

**Frontend**: Vercel (Static Hosting - FREE)  
**Backend**: Render (Node.js - FREE tier available)  
**Database**: Neon PostgreSQL (FREE tier - recommended) or Render PostgreSQL  
**Cache**: Upstash Redis (FREE tier) or Redis Cloud

---

## 📋 Table of Contents

1. [Quick Overview](#-quick-overview)
2. [Prerequisites](#-prerequisites)
3. [Backend Deployment (Render)](#-part-1-backend-deployment-render)
4. [Redis Setup (Upstash)](#-part-2-redis-setup-upstash)
5. [Frontend Deployment (Vercel)](#-part-3-frontend-deployment-vercel)
6. [Final Configuration](#-part-4-final-configuration)
7. [Troubleshooting](#-troubleshooting)

---

## 🎯 Quick Overview

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  PRODUCTION SETUP                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Vercel)          Backend (Render)            │
│  ┌──────────────┐          ┌──────────────┐            │
│  │ React + Vite │◄────────►│  NestJS API  │            │
│  │ Static Files │  HTTPS   │  Port: 10000 │            │
│  └──────────────┘          └──────┬───────┘            │
│                                    │                     │
│                           ┌────────┴────────┐           │
│                           │  PostgreSQL DB  │           │
│                           │  (Neon - FREE)  │           │
│                           └─────────────────┘           │
│                                    │                     │
│                           ┌────────┴────────┐           │
│                           │  Redis Cache    │           │
│                           │  (Upstash-FREE) │           │
│                           └─────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

### Cost Breakdown

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **Vercel** | Free | $0/month | 100GB bandwidth, unlimited deployments |
| **Render** | Free | $0/month | 750 hours/month, sleeps after 15min inactivity |
| **Neon** | Free | $0/month | 0.5GB storage, 3 projects |
| **Upstash Redis** | Free | $0/month | 10K commands/day |
| **TOTAL** | - | **$0/month** ✅ | Good for development/small apps |

**Note**: Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30-60s to wake up.

---

## 🔧 Prerequisites

### 1. Create Accounts

- ✅ [Vercel Account](https://vercel.com/signup)
- ✅ [Render Account](https://render.com/register)
- ✅ [Neon Account](https://neon.tech) (Recommended for DB)
- ✅ [Upstash Account](https://upstash.com) (For Redis)

### 2. Install CLIs

```powershell
# Vercel CLI
npm install -g vercel

# Render CLI (optional)
npm install -g render

# Verify
vercel --version
```

---

## 📦 Part 1: Backend Deployment (Render)

### Step 1: Prepare Database (Neon PostgreSQL)

**Why Neon?** It's always-on (doesn't sleep) and has a generous free tier.

1. Go to [https://neon.tech](https://neon.tech)
2. Create new project: "guest-manager-db"
3. Copy connection string:
   ```
   postgres://user:password@host/database?sslmode=require
   ```

**Save this URL** - You'll need it for Render! 📋

### Step 2: Setup Redis (Upstash)

1. Go to [https://upstash.com](https://upstash.com)
2. Create new database: "guest-manager-cache"
3. Copy connection details:
   ```
   Host: <hostname>.upstash.io
   Port: 6379
   Password: <password>
   ```

**Save these details** - You'll need them for Render! 📋

### Step 3: Deploy to Render

**Option A: Via Render Dashboard (Recommended)**

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Solideomyers/guests-app`
4. Configure:

   **Basic Settings:**
   - Name: `guest-manager-backend`
   - Region: `Oregon (US West)` (or closest to you)
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm ci --include=dev && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
   - Instance Type: `Free`

5. Click **"Advanced"** and add environment variables:

   ```bash
   NODE_ENV=production
   PORT=10000
   API_PREFIX=api
   API_VERSION=v1
   DATABASE_URL=<paste-your-neon-url>
   REDIS_HOST=<upstash-hostname>.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=<upstash-password>
   FRONTEND_URL=https://temporary-value.com
   ```

   **Note**: We'll update `FRONTEND_URL` after deploying to Vercel.

6. Click **"Create Web Service"**

7. Wait for deployment (~5 minutes for first deploy)

**Option B: Via render.yaml (Infrastructure as Code)**

```powershell
# Already configured in backend/render.yaml
# Just connect GitHub repo and Render will auto-detect the config
```

### Step 4: Run Database Migrations

Once backend is deployed:

1. Go to your service in Render dashboard
2. Click **"Shell"** tab
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. (Optional) Seed database:
   ```bash
   npm run seed
   ```

### Step 5: Get Backend URL

Your backend URL will be:
```
https://guest-manager-backend.onrender.com
```

**Copy this URL** - You'll need it for Vercel! 📋

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Update Environment Variable

Create `frontend/.env.production`:

```env
VITE_API_URL=https://guest-manager-backend.onrender.com/api/v1
```

### Step 2: Deploy to Vercel

```powershell
# Login
vercel login

# Navigate to project root
cd D:\fmyers.dev\guests-app

# Deploy
vercel

# Answer prompts:
# → Set up and deploy? Y
# → Scope? [your-account]
# → Link to existing? N
# → Project name? event-guest-manager
# → Directory? ./frontend
# → Override? N
```

### Step 3: Set Environment Variable in Vercel

**Method 1: Via CLI**
```powershell
vercel env add VITE_API_URL production
# Paste: https://guest-manager-backend.onrender.com/api/v1
```

**Method 2: Via Dashboard**
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select project → Settings → Environment Variables
3. Add:
   - Name: `VITE_API_URL`
   - Value: `https://guest-manager-backend.onrender.com/api/v1`
   - Environment: `Production`

### Step 4: Deploy to Production

```powershell
vercel --prod
```

### Step 5: Get Frontend URL

Vercel will provide:
```
https://event-guest-manager.vercel.app
```

**Copy this URL** - We need to update the backend! 📋

---

## 🔄 Part 3: Connect Frontend & Backend

### Update CORS in Render

1. Go to Render Dashboard → Your service
2. Go to **Environment** tab
3. Update `FRONTEND_URL`:
   ```
   https://event-guest-manager.vercel.app
   ```

4. Click **"Save Changes"**
5. Service will auto-redeploy (~2 minutes)

---

## ✅ Verification Checklist

### Backend (Render)

- [ ] Service shows "Live" status
- [ ] Logs show "Server started in production mode"
- [ ] Database connected (check logs)
- [ ] Redis connected (check logs)
- [ ] Health check passing

**Test API**:
```powershell
curl https://guest-manager-backend.onrender.com/api/v1/guests
```

### Frontend (Vercel)

- [ ] Deployment successful
- [ ] App loads without errors
- [ ] API calls work (check Network tab)
- [ ] Can create/edit/delete guests
- [ ] Export to CSV/PDF works
- [ ] Dark mode works

**Test App**: Visit `https://event-guest-manager.vercel.app`

---

## 🚨 Important: Render Free Tier Limitations

### Sleep Behavior

⚠️ **Render free tier sleeps after 15 minutes of inactivity**

**What this means**:
- First request after sleep: ~30-60 seconds to wake up
- Subsequent requests: Normal speed
- Sleep resets with any activity

**Solutions**:

1. **Accept it** (Free tier)
2. **Upgrade to paid** ($7/month - stays awake)
3. **Use a keep-alive service**:
   - [Uptime Robot](https://uptimerobot.com) (FREE)
   - Ping your backend every 10 minutes
   - Prevents sleep

**Setup Uptime Robot**:
1. Create account at [uptimerobot.com](https://uptimerobot.com)
2. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://guest-manager-backend.onrender.com/api/v1/guests`
   - Interval: 10 minutes
3. Done! Backend won't sleep anymore ✅

---

## 🛠️ Troubleshooting

### Issue: "Service Unavailable" (503)

**Cause**: Render service is sleeping or starting up

**Solution**: Wait 30-60 seconds and refresh

### Issue: CORS Errors

**Symptom**: Browser console shows CORS policy error

**Solution**:
```powershell
# Verify FRONTEND_URL in Render
# Should be: https://event-guest-manager.vercel.app
# NOT: http:// or with trailing slash
```

### Issue: Database Connection Failed

**Check Neon URL**:
```powershell
# Must include ?sslmode=require
postgresql://user:pass@host/db?sslmode=require
```

**Test connection in Render Shell**:
```bash
npx prisma db push
```

### Issue: Redis Connection Failed

**Check Upstash credentials in Render**:
```bash
REDIS_HOST=<hostname>.upstash.io  # No http:// or https://
REDIS_PORT=6379
REDIS_PASSWORD=<password>
```

### Issue: Build Fails on Render

**Check logs in Render Dashboard**

**Common fixes**:
```powershell
# Ensure package.json has all dependencies
# Ensure backend/package.json exists
# Check Node version compatibility
```

### Issue: Frontend Shows "Network Error"

**Check `VITE_API_URL` in Vercel**:
```powershell
vercel env ls

# Should be:
# VITE_API_URL=https://guest-manager-backend.onrender.com/api/v1
```

**Must include `/api/v1` at the end!**

---

## 📊 Monitoring

### Render Logs

**Real-time logs**:
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. View live stream

**Common log messages**:
```
✅ Server started in production mode on port 10000
✅ Redis client connected successfully
✅ Prisma client initialized
❌ Database connection failed
❌ CORS origin not allowed
```

### Vercel Logs

**View logs**:
1. Go to Vercel Dashboard
2. Select project
3. Click "Deployments"
4. Click on a deployment
5. View function logs

---

## 🎯 Optimization Tips

### 1. Speed Up Cold Starts (Render)

**Keep service awake**:
- Use Uptime Robot (free)
- Upgrade to paid plan ($7/month)

### 2. Optimize Bundle Size (Vercel)

Already optimized:
- ✅ Code splitting enabled
- ✅ Lazy loading components
- ✅ Gzip compression
- ✅ Cache headers configured

### 3. Database Performance

**Neon**:
- Uses connection pooling by default
- Very fast for free tier

**Prisma**:
- Already optimized with proper queries
- Connection pooling configured

### 4. Redis Caching

**Upstash**:
- 10K commands/day on free tier
- Sufficient for small apps

**If you hit limits**:
- Upgrade to paid ($0.2 per 100K commands)
- Or increase cache TTL to reduce requests

---

## 🔐 Security Checklist

### Render (Backend)

- [x] **Helmet enabled** - Security headers
- [x] **Rate limiting active** - DDoS protection
- [x] **CORS configured** - Only Vercel allowed
- [x] **Environment variables secured** - Not in code
- [x] **Database SSL enabled** - Encrypted connections
- [ ] **Custom domain HTTPS** - Optional

### Vercel (Frontend)

- [x] **HTTPS enforced** - Automatic
- [x] **Security headers** - Configured in `vercel.json`
- [x] **No API keys exposed** - All in backend
- [x] **CSP headers** - Content Security Policy
- [ ] **Custom domain** - Optional

---

## 💰 Upgrade Paths

### When to upgrade?

**Render** ($7/month):
- App is slow to wake up
- Need 24/7 availability
- Growing user base

**Neon** ($19/month):
- Need more storage (>0.5GB)
- Need more database connections
- Need better performance

**Upstash** ($0.2/100K):
- Exceed 10K Redis commands/day
- Need higher throughput

---

## 🚀 Quick Deploy Script

Save as `deploy-render-vercel.ps1`:

```powershell
Write-Host "🚀 Deploying to Production..." -ForegroundColor Green

# Frontend to Vercel
Write-Host "🎨 Deploying Frontend to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "Frontend: https://event-guest-manager.vercel.app"
Write-Host "Backend: https://guest-manager-backend.onrender.com"
```

**Note**: Render auto-deploys on git push, so no manual deployment needed!

---

## 📚 Additional Resources

### Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Upstash Docs](https://upstash.com/docs)

### Support
- **Project Issues**: [GitHub Issues](https://github.com/Solideomyers/guests-app/issues)
- **Render Support**: [Render Community](https://community.render.com)
- **Vercel Support**: [Vercel Discord](https://vercel.com/discord)

---

## 🎊 Summary

You now have a **production-ready app** deployed entirely on free tiers! 🎉

**What you achieved**:
- ✅ Frontend on Vercel (fast, reliable, free)
- ✅ Backend on Render (Node.js, free tier)
- ✅ Database on Neon (PostgreSQL, always-on)
- ✅ Cache on Upstash (Redis, free tier)
- ✅ All connected and secured with CORS
- ✅ HTTPS enabled everywhere
- ✅ Monitoring and logs available

**Total Cost**: **$0/month** (100% free!) 🎁

**Next Steps**:
1. Test thoroughly in production
2. Setup Uptime Robot to prevent sleep
3. Monitor logs for any issues
4. Consider custom domain
5. Share with users! 🚀

---

**Happy Deploying!** 🎉

*Last Updated: Octubre 22, 2025*
