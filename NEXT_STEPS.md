# 🎯 Next Steps - Frontend Deployment

**Current Status**: ✅ Backend is LIVE in production  
**Backend URL**: https://guests-app.onrender.com  
**Next Task**: Deploy Frontend to Vercel

---

## ✅ What's Already Done

### Backend (Render)
- ✅ Deployed and running
- ✅ Database connected (Neon PostgreSQL)
- ✅ Redis cache connected (Upstash with TLS)
- ✅ All API endpoints working
- ✅ Health check passing
- ✅ Security headers enabled
- ✅ Rate limiting configured
- ✅ CORS configured (pending frontend URL)

### Documentation
- ✅ Deployment success documented
- ✅ Environment variables template updated
- ✅ Troubleshooting guide completed
- ✅ All issues and fixes documented

---

## 🚀 Next: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (if not installed)

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

This will open a browser for authentication.

### Step 3: Deploy Frontend

```powershell
# From project root
cd frontend
vercel --prod
```

**During deployment, answer prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No** (first time)
- Project name? → **guests-app** (or your preferred name)
- Directory? → **./frontend** or **./** (it will detect automatically)
- Override settings? → **No**

### Step 4: Set Environment Variable

After deployment, set the backend URL:

```powershell
vercel env add VITE_API_URL production
```

When prompted, enter:
```
https://guests-app.onrender.com/api/v1
```

### Step 5: Redeploy with Environment Variable

```powershell
vercel --prod
```

---

## 🔄 Update Backend with Frontend URL

Once Vercel deployment is complete, you'll get a URL like:
```
https://guests-app-yourname.vercel.app
```

### Update FRONTEND_URL in Render:

1. Go to https://dashboard.render.com
2. Select your service: **guest-manager-backend**
3. Go to **Environment** tab
4. Find `FRONTEND_URL` variable
5. Update the value to your Vercel URL
6. Click **Save**

Render will automatically redeploy (~2 minutes).

---

## 🧪 Testing the Full Stack

Once both are deployed:

### 1. Test Backend Health
```bash
curl https://guests-app.onrender.com/api/v1/guests
```

Expected: `200 OK` with empty array or guests data

### 2. Test Frontend
Open your Vercel URL in browser:
```
https://guests-app-yourname.vercel.app
```

Expected: 
- ✅ App loads without errors
- ✅ Can create a new guest
- ✅ Can view guests list
- ✅ Can edit/delete guests
- ✅ Can export to CSV/PDF
- ✅ Dark mode works
- ✅ Filters work
- ✅ No CORS errors in console

### 3. Test CORS
Open browser console (F12) and check for:
- ❌ No CORS errors
- ✅ API requests succeed
- ✅ Response data displays correctly

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error

**Symptom**: Console shows "Access-Control-Allow-Origin" error

**Solution**:
1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. No trailing slash in the URL
3. Wait for Render to redeploy after updating

### Issue: API Calls Fail

**Symptom**: Network errors, 404, or timeout

**Solution**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Ensure it ends with `/api/v1` (no trailing slash)
3. Verify backend is awake (free tier sleeps after 15min)
4. Check Render logs for errors

### Issue: Environment Variable Not Applied

**Symptom**: Old API URL still being used

**Solution**:
1. Run `vercel env pull` to verify variables
2. Redeploy: `vercel --prod`
3. Clear browser cache
4. Hard reload (Ctrl+Shift+R)

---

## 🎉 Success Criteria

Your deployment is successful when:

- [ ] Frontend loads at Vercel URL
- [ ] Backend responds at Render URL
- [ ] Can create, read, update, delete guests
- [ ] Exports (CSV/PDF) work
- [ ] Search and filters work
- [ ] Dark mode toggles properly
- [ ] No console errors
- [ ] No CORS errors
- [ ] Mobile responsive design works
- [ ] Performance is acceptable

---

## 🔧 Optional: Setup UptimeRobot

To prevent Render free tier from sleeping:

1. Go to https://uptimerobot.com
2. Create free account
3. Add New Monitor:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: **Guest Manager API**
   - URL: `https://guests-app.onrender.com/api/v1/guests`
   - Monitoring Interval: **10 minutes**
4. Save

This will ping your backend every 10 minutes, keeping it awake 24/7.

---

## 📊 Expected Performance

### Backend (Render Free Tier)
- **First Request (Cold Start)**: ~30 seconds
- **Subsequent Requests**: < 1 second
- **With UptimeRobot**: Always warm, < 1 second

### Frontend (Vercel)
- **Initial Load**: < 2 seconds
- **Page Navigation**: Instant (SPA)
- **API Calls**: < 1 second (after backend wakes)

### Database (Neon)
- **Queries**: < 100ms
- **Connections**: Always-on (no cold start)

---

## 🚀 Ready to Deploy?

Run these commands to get started:

```powershell
# Install Vercel CLI (if needed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod

# Set API URL
vercel env add VITE_API_URL production
# Enter: https://guests-app.onrender.com/api/v1

# Redeploy with environment variable
vercel --prod
```

---

## 📚 Reference Documentation

- [Complete Deployment Guide](./DEPLOYMENT_RENDER_VERCEL.md)
- [Deployment Success Summary](./DEPLOYMENT_SUCCESS.md)
- [Quick Start Guide](./QUICK_START_DEPLOY.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)

---

**Status**: ✅ Backend Live | ⏳ Frontend Pending  
**Next**: Deploy frontend with commands above
