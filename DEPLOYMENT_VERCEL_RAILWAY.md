# 🚀 Deployment Guide - Vercel (Frontend) + Railway (Backend)

**Date**: Octubre 21, 2025  
**Version**: 1.0.0  
**Strategy**: Separated deployment (Frontend in Vercel, Backend in Railway)

---

## 📋 Prerequisites

### Required Accounts
- ✅ **Vercel Account** - [vercel.com/signup](https://vercel.com/signup) (Free tier available)
- ✅ **Railway Account** - [railway.app](https://railway.app) (Free $5 credit/month)
- ✅ **Neon PostgreSQL** - [neon.tech](https://neon.tech) (Free tier available)
- ✅ **GitHub Account** - Your repo is already there! ✅

### Required CLI Tools
```bash
# Install Vercel CLI
npm install -g vercel

# Install Railway CLI
npm install -g @railway/cli

# Verify installations
vercel --version
railway --version
```

---

## 🎯 Deployment Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (React)          Backend (NestJS)                │
│  ↓                          ↓                               │
│  Vercel                     Railway                         │
│  • Static hosting           • Node.js hosting               │
│  • Global CDN               • PostgreSQL (Neon)             │
│  • Auto HTTPS               • Redis (Railway Plugin)        │
│  • Free tier                • Auto scaling                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Part 1: Backend Deployment (Railway)

### Step 1: Login to Railway

```bash
# Login via browser
railway login

# Link to your GitHub account when prompted
```

### Step 2: Create New Project

```bash
cd backend

# Initialize Railway project
railway init

# Follow prompts:
# - Select "Empty Project"
# - Name it: "guests-app-backend"
```

### Step 3: Add PostgreSQL Database (Neon)

**Option A: Use Neon (Recommended - Free tier)**

1. Go to [neon.tech](https://neon.tech)
2. Create new project: "guests-app-db"
3. Copy connection string
4. It will look like:
   ```
   postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

**Option B: Use Railway PostgreSQL Plugin**

```bash
# In Railway dashboard
railway add --plugin postgresql

# Or via CLI
railway plugin add postgresql
```

### Step 4: Add Redis

**Important**: Since you have Redis running locally in Docker, you need to migrate to Railway's Redis.

```bash
# Add Redis plugin in Railway
railway add --plugin redis

# Or in Railway dashboard:
# Click "New" → "Plugin" → "Redis"
```

Railway will automatically provide:
- `REDIS_URL` environment variable
- `REDIS_PRIVATE_URL` for internal communication

### Step 5: Configure Environment Variables

```bash
# Set environment variables in Railway
railway variables set NODE_ENV=production
railway variables set PORT=3000

# Database (from Neon)
railway variables set DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Redis (automatically set by Railway plugin, but verify)
railway variables

# CORS - We'll update this after deploying frontend
railway variables set FRONTEND_URL="https://localhost:5173"
```

**Or use Railway Dashboard**:
1. Go to your project in Railway dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add all variables from `.env.production.example`

### Step 6: Update CORS Configuration

Check that your `backend/src/main.ts` has dynamic CORS:

```typescript
// This should already be there from our production prep
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});
```

### Step 7: Run Database Migrations

```bash
# Connect to Railway
railway link

# Run migrations
railway run npx prisma migrate deploy

# Optional: Seed database
railway run npm run seed
```

### Step 8: Deploy Backend

```bash
# Deploy to Railway
railway up

# Or if you prefer CI/CD from GitHub:
# - Connect your GitHub repo in Railway dashboard
# - Select the backend directory
# - Railway will auto-deploy on push
```

### Step 9: Get Backend URL

```bash
# Generate public domain
railway domain

# You'll get something like:
# https://guests-app-backend-production.up.railway.app
```

**Copy this URL!** You'll need it for the frontend.

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Update Environment Variable

Before deploying, update the API URL:

```bash
cd frontend

# Create .env.production file
echo "VITE_API_URL=https://your-backend-url.railway.app/api/v1" > .env.production

# Replace 'your-backend-url.railway.app' with your actual Railway URL
```

### Step 2: Test Build Locally

```bash
# Build with production env
npm run build

# Verify it works
npm run preview
```

### Step 3: Deploy to Vercel

**Option A: Via CLI (Recommended)**

```bash
# Login to Vercel
vercel login

# Deploy (from frontend directory)
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? guests-app-frontend
# - Directory? ./
# - Override settings? No

# This creates a preview deployment
# For production:
vercel --prod
```

**Option B: Via GitHub Integration (Easier)**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api/v1`
5. Click "Deploy"

### Step 4: Configure Custom Domain (Optional)

```bash
# Via CLI
vercel domains add yourdomain.com

# Or in Vercel dashboard:
# Project Settings → Domains → Add Domain
```

### Step 5: Get Frontend URL

After deployment, Vercel gives you:
- Production URL: `https://guests-app-frontend.vercel.app`
- Preview URLs for each commit

**Copy this URL!** You need to update the backend CORS.

---

## 🔄 Part 3: Connect Frontend & Backend

### Step 1: Update Backend CORS

```bash
# Update Railway environment variable
railway variables set FRONTEND_URL="https://guests-app-frontend.vercel.app"

# Redeploy backend
railway up
```

### Step 2: Verify Connection

1. Open your Vercel frontend URL
2. Open browser DevTools (F12)
3. Go to Network tab
4. Try to fetch guests
5. Check that requests go to Railway backend
6. Verify no CORS errors

### Step 3: Test All Features

- ✅ Create guest
- ✅ Edit guest
- ✅ Delete guest
- ✅ Search and filter
- ✅ Export CSV
- ✅ Export PDF
- ✅ Dark mode
- ✅ Mobile responsive

---

## 📊 Part 4: Redis Migration (Docker → Railway)

Since you currently have Redis running locally in Docker, here's how to migrate:

### Step 1: Verify Railway Redis

```bash
# Check Redis variables in Railway
railway variables | Select-String -Pattern "REDIS"

# You should see:
# REDIS_URL=redis://default:password@host:port
# REDIS_PRIVATE_URL=redis://default:password@private-host:port
```

### Step 2: Update Backend Code (If Needed)

Check `backend/src/app.module.ts` - it should already use `process.env.REDIS_URL`:

```typescript
CacheModule.register({
  isGlobal: true,
  store: redisStore,
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  // ...
}),
```

### Step 3: Stop Local Redis

```bash
# Stop local Docker Redis (when ready)
cd backend
docker-compose down

# Or just stop Redis
docker stop redis
```

### Step 4: Test Railway Redis

```bash
# Deploy with Railway Redis
railway up

# Check logs
railway logs

# Verify Redis is working
# Look for "Redis connected" in logs
```

---

## 🔍 Part 5: Verification & Testing

### Frontend Checks

```bash
# Open Vercel URL in browser
# Check browser console for errors
# Verify all these work:

✅ Homepage loads
✅ Can fetch guests list
✅ Can create new guest
✅ Can edit guest
✅ Can delete guest
✅ Search works
✅ Filters work
✅ Export CSV works
✅ Export PDF works
✅ Dark mode toggle works
✅ Mobile responsive works
✅ No CORS errors in console
```

### Backend Checks

```bash
# Check Railway logs
railway logs

# Verify:
✅ App started successfully
✅ Database connected
✅ Redis connected
✅ No errors in logs
✅ API responding to requests
```

### Performance Checks

```bash
# Test API response time
curl -w "@curl-format.txt" -o /dev/null -s https://your-backend.railway.app/api/v1/guests

# Check Redis cache
# Create a guest, then fetch it multiple times
# Second fetch should be faster (cached)
```

---

## 🚨 Troubleshooting

### Issue: CORS Error

**Symptom**: Browser console shows CORS error

**Solution**:
```bash
# Verify FRONTEND_URL in Railway
railway variables | Select-String -Pattern "FRONTEND_URL"

# Update if needed
railway variables set FRONTEND_URL="https://your-app.vercel.app"

# Redeploy
railway up
```

### Issue: Database Connection Failed

**Symptom**: "Cannot connect to database" in Railway logs

**Solution**:
```bash
# Check DATABASE_URL
railway variables | Select-String -Pattern "DATABASE_URL"

# Verify it includes ?sslmode=require
# Example: postgresql://user:pass@host/db?sslmode=require

# Update if needed
railway variables set DATABASE_URL="your-connection-string?sslmode=require"
```

### Issue: Redis Connection Failed

**Symptom**: "Redis connection error" in logs

**Solution**:
```bash
# Check Redis plugin is added
railway plugins

# Verify REDIS_URL is set
railway variables | Select-String -Pattern "REDIS"

# If not set, add Redis plugin
railway add --plugin redis

# Redeploy
railway up
```

### Issue: Build Failed on Vercel

**Symptom**: Vercel build fails

**Solution**:
1. Check Vercel build logs
2. Verify `package.json` has correct build script
3. Ensure all dependencies are in `dependencies`, not `devDependencies`
4. Try local build: `npm run build`

### Issue: Environment Variable Not Working

**Symptom**: Frontend can't reach backend

**Solution**:
```bash
# Vercel: Check environment variables
# Go to Vercel dashboard → Project → Settings → Environment Variables
# Ensure VITE_API_URL is set for Production

# Redeploy
vercel --prod
```

---

## 💰 Cost Breakdown

### Free Tier Limits

**Vercel (Free)**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ⚠️ Serverless Functions: 100 GB-hours

**Railway (Free)**:
- ✅ $5 free credit/month
- ✅ ~500 hours runtime (for small apps)
- ⚠️ After free credit, pay-as-you-go

**Neon PostgreSQL (Free)**:
- ✅ 1 project
- ✅ 10 branches
- ✅ 3 GB storage
- ✅ Unlimited queries

**Total Monthly Cost**: **$0** (within free tiers) 🎉

### Upgrade Path (If Needed)

If you exceed free tier:
- **Vercel Pro**: $20/month (100x more bandwidth)
- **Railway**: ~$5-20/month depending on usage
- **Neon Scale**: $19/month (100 GB storage)

---

## 🔄 CI/CD Setup (Automatic Deployments)

### Vercel Auto-Deploy

Already configured! Every push to `main` triggers deployment.

To configure:
1. Vercel dashboard → Project → Settings → Git
2. **Production Branch**: `main`
3. **Deploy Hooks**: Enabled

### Railway Auto-Deploy

```bash
# Link GitHub repo in Railway dashboard
# Settings → GitHub → Connect Repository
# Select: Solideomyers/guests-app
# Path: backend/
# Branch: main

# Now every push to main auto-deploys!
```

---

## 📱 Post-Deployment Checklist

After deployment, verify:

### Security
- [ ] HTTPS enabled (automatic on Vercel & Railway)
- [ ] CORS configured correctly
- [ ] Environment variables secured
- [ ] No API keys in client code
- [ ] Helmet headers active (check with browser DevTools)

### Performance
- [ ] Redis caching working
- [ ] Response times < 500ms
- [ ] Bundle size reasonable (~206KB)
- [ ] Images optimized
- [ ] CDN delivering assets

### Functionality
- [ ] All CRUD operations work
- [ ] Search and filters work
- [ ] Exports (CSV/PDF) work
- [ ] Dark mode persists
- [ ] Mobile responsive
- [ ] Error handling works

### Monitoring
- [ ] Setup error tracking (Sentry recommended)
- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Check Railway metrics
- [ ] Check Vercel analytics

---

## 🎯 Quick Deploy Commands

```bash
# === BACKEND (Railway) ===
cd backend
railway login
railway init
railway add --plugin postgresql  # Or use Neon
railway add --plugin redis
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="your-neon-url"
railway variables set FRONTEND_URL="https://pending"
railway run npx prisma migrate deploy
railway up
railway domain

# === FRONTEND (Vercel) ===
cd frontend
echo "VITE_API_URL=https://your-railway-url.railway.app/api/v1" > .env.production
vercel login
vercel --prod

# === UPDATE BACKEND CORS ===
cd backend
railway variables set FRONTEND_URL="https://your-vercel-url.vercel.app"
railway up
```

---

## 📞 Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Neon Docs](https://neon.tech/docs)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Railway Discord](https://discord.gg/railway)

### Monitoring Tools
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **UptimeRobot**: Uptime monitoring
- **Vercel Analytics**: Built-in analytics

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Frontend loads at `https://your-app.vercel.app`
2. ✅ Backend responds at `https://your-backend.railway.app/api/v1/guests`
3. ✅ No CORS errors in browser console
4. ✅ Database operations work (create, read, update, delete)
5. ✅ Redis caching works (check Railway logs)
6. ✅ Exports work (CSV & PDF)
7. ✅ Mobile responsive
8. ✅ HTTPS enabled (automatic)
9. ✅ All 393 tests passed before deployment
10. ✅ No errors in production logs

---

**Created**: Octubre 21, 2025  
**Version**: 1.0.0  
**Status**: Ready for deployment  
**Estimated Time**: 30-45 minutes for first deployment

🚀 **Let's deploy!**
