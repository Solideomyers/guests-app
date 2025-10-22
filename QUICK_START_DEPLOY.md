# 🚀 Quick Start: Deploy to Production

**Time Required**: ~15 minutes  
**Cost**: $0/month (100% FREE tiers)

---

## ⚡ Prerequisites

### Create Free Accounts
- ✅ [Vercel Account](https://vercel.com/signup)
- ✅ [Render Account](https://render.com/register)
- ✅ [Neon Account](https://neon.tech) (PostgreSQL)
- ✅ [Upstash Account](https://upstash.com) (Redis)

```powershell
# Install Vercel CLI (run once)
npm install -g vercel

# Verify installation
vercel --version
```

---

## 📦 Step-by-Step Deployment

### 1️⃣ Setup Database & Redis (5 min)

**Neon PostgreSQL (FREE - Always On)**:
1. Go to [https://neon.tech](https://neon.tech)
2. Create project: "guest-manager-db"
3. Copy connection string:
   ```
   postgres://user:pass@host/db?sslmode=require
   ```

**Upstash Redis (FREE - 10K commands/day)**:
1. Go to [https://upstash.com](https://upstash.com)
2. Create database: "guest-manager-cache"
3. Copy connection details (Host, Port, Password)

**Save these!** You'll need them for Render 📋

---

### 2️⃣ Backend to Render (5 min)

**Via Render Dashboard** (Easiest):

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub: `Solideomyers/guests-app`
4. Configure:
   - Name: `guest-manager-backend`
   - Region: `Oregon` (or closest)
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `npm ci --include=dev && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
   - Instance Type: **Free**

5. Add Environment Variables:
   ```bash
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<paste-neon-url>
   REDIS_HOST=<upstash-host>.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=<upstash-password>
   FRONTEND_URL=https://temp.com
   ```

6. Click **"Create Web Service"**
7. Wait ~5 minutes for first deploy

**Get Backend URL**:
```
https://guest-manager-backend.onrender.com
```

**Copy this URL** - You'll need it next! 📋

---

### 2️⃣ Frontend to Vercel (3 min)

```powershell
# Login
vercel login

# Navigate to project root (NOT frontend directory)
cd D:\fmyers.dev\guests-app

# Deploy
vercel

# Answer prompts:
# → Set up and deploy? Y
# → Which scope? [your-account]
# → Link to existing project? N
# → Project name? event-guest-manager
# → Directory? ./frontend
# → Override settings? N

# Set environment variable
vercel env add VITE_API_URL production
# → Paste: https://guest-manager-backend.onrender.com/api/v1

# Deploy to production
vercel --prod
```

**Copy the Vercel URL** - You'll need it for CORS! 📋  
Example: `https://event-guest-manager.vercel.app`

---

### 3️⃣ Connect Frontend & Backend (2 min)

**Update CORS in Render**:
1. Go to Render Dashboard → Your service
2. Click **"Environment"** tab
3. Update `FRONTEND_URL`: `https://event-guest-manager.vercel.app`
4. Click **"Save Changes"** (auto-redeploys)

---

## ✅ Verify Deployment

### Test Backend
```powershell
# Check health (may take 30-60s if sleeping)
curl https://guest-manager-backend.onrender.com/api/v1/guests
```

### Test Frontend
1. Open: `https://event-guest-manager.vercel.app`
2. Check browser console (F12) - should have no errors
3. Try creating a guest - should work!

### ⚠️ Note: Render Free Tier
Backend sleeps after 15min inactivity. First request after sleep takes ~30-60s to wake up.

**Solution**: Use [UptimeRobot](https://uptimerobot.com) (free) to ping every 10min and prevent sleep.

---

## 🎯 Quick Reference Commands

### Redeploy Frontend
```powershell
vercel --prod
```

### Redeploy Backend
Render auto-deploys on git push to `main` branch!

Or manually in Render Dashboard:
- Go to service → Click "Manual Deploy" → Deploy latest commit

### View Logs

**Render (Backend)**:
- Go to: https://dashboard.render.com
- Select service → Logs tab

**Vercel (Frontend)**:
- Go to: https://vercel.com/dashboard
- Select project → Deployments → View Logs

---

## 🛠️ Troubleshooting

### CORS Error?
1. Go to Render Dashboard → Your service → Environment
2. Update `FRONTEND_URL` to match your Vercel URL exactly
3. Save changes (auto-redeploys)

### API Not Working?
```powershell
# Check environment variable
vercel env ls

# Update if needed
vercel env rm VITE_API_URL production
vercel env add VITE_API_URL production
# → Paste: https://guest-manager-backend.onrender.com/api/v1

# Redeploy
vercel --prod
```

### Database Not Connected?
1. Check `DATABASE_URL` in Render dashboard
2. Must include `?sslmode=require` for Neon
3. Run migrations in Render Shell:
   ```bash
   npx prisma migrate deploy
   ```

### Backend Slow / 503 Error?
⚠️ **Render free tier sleeps after 15min inactivity**

Wait 30-60s for wake up, or setup UptimeRobot to prevent sleep.

---

## 📚 Full Documentation

For detailed guides, see:
- **[DEPLOYMENT_RENDER_VERCEL.md](DEPLOYMENT_RENDER_VERCEL.md)** - Complete Render deployment guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - All deployment options

---

## 🎉 You're Done!

Your app is now live! 🚀

**Share your URLs**:
- Frontend: `https://event-guest-manager.vercel.app`
- Backend API: `https://guest-manager-backend.onrender.com/api/v1`

**Cost**: **$0/month** (100% FREE!) 🎁

**Next Steps**:
1. ✅ Test all features in production
2. ✅ Setup [UptimeRobot](https://uptimerobot.com) to prevent backend sleep
3. ✅ Setup custom domain (optional)
4. ✅ Enable monitoring (Sentry, LogRocket)
5. ✅ Share with users!

---

**Need help?** Check [DEPLOYMENT_RENDER_VERCEL.md](DEPLOYMENT_RENDER_VERCEL.md) for detailed troubleshooting.
