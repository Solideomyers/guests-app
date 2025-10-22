# 🚀 Quick Start: Deploy to Production

**Time Required**: ~15 minutes  
**Cost**: $0-5/month (Free tiers available)

---

## ⚡ Prerequisites

```powershell
# Install CLIs (run once)
npm install -g vercel
npm install -g @railway/cli

# Verify installations
vercel --version
railway --version
```

---

## 📦 Step-by-Step Deployment

### 1️⃣ Backend to Railway (5 min)

```powershell
# Login
railway login

# Navigate to backend
cd backend

# Initialize Railway project
railway init
# → Select "Create new project"
# → Name: "guest-manager-backend"

# Add PostgreSQL database
railway add --database postgresql

# Add Redis cache
railway add --database redis

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3000

# Deploy!
railway up

# Get your backend URL
railway domain
```

**Copy the Railway URL** - You'll need it next! 📋  
Example: `https://guest-manager-backend-production.up.railway.app`

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
# → Paste: https://your-backend.railway.app/api/v1

# Deploy to production
vercel --prod
```

**Copy the Vercel URL** - You'll need it for CORS! 📋  
Example: `https://event-guest-manager.vercel.app`

---

### 3️⃣ Connect Frontend & Backend (2 min)

```powershell
# Update CORS in Railway backend
railway variables set FRONTEND_URL=https://event-guest-manager.vercel.app

# Redeploy backend to apply CORS
cd backend
railway up
```

---

## ✅ Verify Deployment

### Test Backend
```powershell
# Check health
curl https://your-backend.railway.app/api/v1/guests
```

### Test Frontend
1. Open: `https://your-app.vercel.app`
2. Check browser console (F12) - should have no errors
3. Try creating a guest - should work!

---

## 🎯 Quick Reference Commands

### Redeploy Backend
```powershell
cd backend
railway up
```

### Redeploy Frontend
```powershell
vercel --prod
```

### View Logs

**Railway (Backend)**:
```powershell
railway logs --tail
```

**Vercel (Frontend)**:
- Go to: https://vercel.com/dashboard
- Select project → Deployments → View Logs

---

## 🛠️ Troubleshooting

### CORS Error?
```powershell
# Update CORS with your Vercel URL
railway variables set FRONTEND_URL=https://your-app.vercel.app
cd backend
railway up
```

### API Not Working?
```powershell
# Check environment variable
vercel env ls

# Update if needed
vercel env rm VITE_API_URL production
vercel env add VITE_API_URL production
# → Paste: https://your-backend.railway.app/api/v1

# Redeploy
vercel --prod
```

### Database Not Connected?
```powershell
# Check Railway services
railway status

# Run migrations
railway run npx prisma migrate deploy
```

---

## 📚 Full Documentation

For detailed guides, see:
- **[DEPLOYMENT_VERCEL_RAILWAY.md](DEPLOYMENT_VERCEL_RAILWAY.md)** - Complete deployment guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - All deployment options

---

## 🎉 You're Done!

Your app is now live! 🚀

**Share your URLs**:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.railway.app/api/v1`

**Next Steps**:
1. ✅ Test all features in production
2. ✅ Setup custom domain (optional)
3. ✅ Enable monitoring (Sentry, LogRocket)
4. ✅ Share with users!

---

**Need help?** Check [DEPLOYMENT_VERCEL_RAILWAY.md](DEPLOYMENT_VERCEL_RAILWAY.md) for detailed troubleshooting.
