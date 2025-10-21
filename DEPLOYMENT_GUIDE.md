# 🚀 Deployment Guide - Guests App v1.0.0

Complete step-by-step guide for deploying the Event Guest Management Application to production.

---

## 📑 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Platform-Specific Guides](#platform-specific-guides)
   - [Option A: Vercel + Railway](#option-a-vercel-frontend--railway-backend)
   - [Option B: Vercel + Render](#option-b-vercel-frontend--render-backend)
   - [Option C: AWS (EC2)](#option-c-aws-ec2)
   - [Option D: DigitalOcean](#option-d-digitalocean)
   - [Option E: Docker](#option-e-docker)
3. [Database Setup (Neon PostgreSQL)](#database-setup-neon-postgresql)
4. [Redis Setup](#redis-setup)
5. [Environment Configuration](#environment-configuration)
6. [Build & Deploy](#build--deploy)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] **Neon** - https://neon.tech (PostgreSQL database)
- [ ] **Deployment Platform** (choose one):
  - Vercel - https://vercel.com
  - Railway - https://railway.app
  - Render - https://render.com
  - AWS - https://aws.amazon.com
  - DigitalOcean - https://digitalocean.com
- [ ] **Redis** (choose one):
  - Upstash Redis - https://upstash.com (Recommended - Free tier)
  - Redis Cloud - https://redis.com/try-free
  - Self-hosted Redis (if using EC2/DigitalOcean)
- [ ] **Domain** (optional but recommended)
- [ ] **Git Repository** - GitHub/GitLab/Bitbucket

### Local Prerequisites
```bash
# Verify versions
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0
git --version     # Any recent version
```

---

## Platform-Specific Guides

### Option A: Vercel (Frontend) + Railway (Backend)

**Best for**: Quick deployment, serverless, automatic scaling

#### Step 1: Deploy Backend to Railway

1. **Create Railway Account & Project**
   ```bash
   # Install Railway CLI (optional)
   npm install -g @railway/cli
   railway login
   ```

2. **Create New Project in Railway**
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your `guests-app` repository
   - Choose `backend` as the root directory

3. **Configure Backend Service**
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm run start:prod`
   - **Port**: 3000

4. **Add PostgreSQL (Neon)**
   - Don't add Railway PostgreSQL (we'll use Neon)
   - Go to Variables tab
   - Add `DATABASE_URL` with your Neon connection string

5. **Add Redis**
   - Click "New" → "Database" → "Add Redis"
   - Railway will auto-configure `REDIS_URL`
   - Or manually add:
     - `REDIS_HOST`
     - `REDIS_PORT`
     - `REDIS_PASSWORD`

6. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:pass@neon-hostname/db?sslmode=require
   REDIS_URL=redis://default:pass@redis-hostname:port
   CORS_ORIGIN=https://your-frontend.vercel.app
   API_PREFIX=api
   API_VERSION=v1
   CACHE_TTL=300
   CACHE_MAX_ITEMS=100
   ```

7. **Deploy**
   - Railway will auto-deploy
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

8. **Run Migrations**
   ```bash
   # In Railway dashboard, open Shell
   npx prisma migrate deploy
   ```

#### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account & Import Project**
   - Go to https://vercel.com/new
   - Import your `guests-app` repository
   - Vercel will auto-detect it's a monorepo

2. **Configure Frontend**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variable**
   ```env
   VITE_API_URL=https://your-backend.railway.app/api/v1
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Copy the generated URL (e.g., `https://your-app.vercel.app`)

5. **Update Backend CORS**
   - Go back to Railway backend
   - Update `CORS_ORIGIN` to your Vercel URL:
     ```env
     CORS_ORIGIN=https://your-app.vercel.app
     ```
   - Railway will auto-redeploy

6. **Configure Custom Domain (Optional)**
   - In Vercel: Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
   - Update `CORS_ORIGIN` in Railway backend

---

### Option B: Vercel (Frontend) + Render (Backend)

**Best for**: Simple deployment, generous free tier

#### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com/register

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select `guests-app` repo

3. **Configure Service**
   - **Name**: `guests-app-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     npm install && npm run build && npx prisma generate
     ```
   - **Start Command**: 
     ```bash
     npm run start:prod
     ```
   - **Plan**: Free or Starter (choose based on needs)

4. **Environment Variables**
   Add in Render dashboard:
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:pass@neon-hostname/db?sslmode=require
   REDIS_URL=redis://default:pass@redis-hostname:port
   CORS_ORIGIN=https://your-frontend.vercel.app
   API_PREFIX=api
   API_VERSION=v1
   ```

5. **Create Service**
   - Render will build and deploy
   - Copy the generated URL (e.g., `https://guests-app-backend.onrender.com`)

6. **Run Migrations**
   - In Render Dashboard → Shell
   ```bash
   npx prisma migrate deploy
   ```

#### Step 2: Deploy Frontend to Vercel

Follow the same steps as [Option A - Step 2](#step-2-deploy-frontend-to-vercel), but use your Render backend URL:
```env
VITE_API_URL=https://guests-app-backend.onrender.com/api/v1
```

---

### Option C: AWS (EC2)

**Best for**: Full control, enterprise needs, complex infrastructure

#### Prerequisites
- AWS Account
- Basic knowledge of EC2, Security Groups, SSH

#### Step 1: Launch EC2 Instance

1. **Create EC2 Instance**
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t3.small or larger
   - Storage: 20GB minimum
   - Security Group:
     - SSH (22) - Your IP
     - HTTP (80) - 0.0.0.0/0
     - HTTPS (443) - 0.0.0.0/0
     - Custom TCP (3000) - Your IP (for testing)

2. **Connect via SSH**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install Nginx
   sudo apt install -y nginx

   # Install PM2
   sudo npm install -g pm2

   # Install Git
   sudo apt install -y git

   # Install Redis (optional - or use cloud Redis)
   sudo apt install -y redis-server
   sudo systemctl enable redis-server
   sudo systemctl start redis-server
   ```

4. **Clone Repository**
   ```bash
   cd /home/ubuntu
   git clone https://github.com/Solideomyers/guests-app.git
   cd guests-app
   git checkout release/v1.0.0
   ```

#### Step 2: Setup Backend

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create Environment File**
   ```bash
   nano .env
   ```
   
   Add:
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:pass@neon-hostname/db?sslmode=require
   REDIS_HOST=localhost
   REDIS_PORT=6379
   CORS_ORIGIN=https://yourdomain.com
   API_PREFIX=api
   API_VERSION=v1
   ```

3. **Build & Migrate**
   ```bash
   npm run build
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Start with PM2**
   ```bash
   pm2 start dist/main.js --name guests-backend
   pm2 save
   pm2 startup
   ```

#### Step 3: Setup Frontend

1. **Install Frontend Dependencies**
   ```bash
   cd /home/ubuntu/guests-app/frontend
   npm install
   ```

2. **Create Environment File**
   ```bash
   nano .env
   ```
   
   Add:
   ```env
   VITE_API_URL=https://yourdomain.com/api/v1
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Copy Build to Nginx**
   ```bash
   sudo mkdir -p /var/www/guests-app
   sudo cp -r dist/* /var/www/guests-app/
   sudo chown -R www-data:www-data /var/www/guests-app
   ```

#### Step 4: Configure Nginx

1. **Create Nginx Config**
   ```bash
   sudo nano /etc/nginx/sites-available/guests-app
   ```

2. **Add Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       # Frontend
       location / {
           root /var/www/guests-app;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/guests-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

### Option D: DigitalOcean

**Best for**: Simple VPS, good docs, affordable

Similar to AWS EC2 but simpler:

1. **Create Droplet**
   - Image: Ubuntu 22.04
   - Plan: Basic ($6/month or higher)
   - Add SSH key
   - Enable monitoring

2. **Follow AWS Steps 2-4**
   - Setup is identical to EC2
   - DigitalOcean has simpler firewall (Cloud Firewalls)

3. **Optional: Use App Platform**
   - Similar to Render/Railway
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Configure build/start commands
   - Much simpler than manual VPS setup

---

### Option E: Docker

**Best for**: Containerization, consistency, Kubernetes

#### Step 1: Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Frontend Nginx Config** (`frontend/nginx.conf`):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Step 2: Docker Compose

**`docker-compose.prod.yml`**:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      CORS_ORIGIN: ${CORS_ORIGIN}
    depends_on:
      - redis
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      VITE_API_URL: ${VITE_API_URL}
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

#### Step 3: Deploy with Docker

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Run migrations
docker-compose -f docker-compose.prod.yml run backend npx prisma migrate deploy

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

---

## Database Setup (Neon PostgreSQL)

### Step 1: Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub or email
3. Verify email

### Step 2: Create Project
1. Click "Create Project"
2. **Name**: `guests-app-prod`
3. **Region**: Choose closest to your users
   - US East (Ohio) - `us-east-2`
   - US West (Oregon) - `us-west-2`
   - Europe (Frankfurt) - `eu-central-1`
   - Asia Pacific (Singapore) - `ap-southeast-1`
4. **PostgreSQL Version**: 15 or 16
5. Click "Create Project"

### Step 3: Get Connection String
1. In project dashboard, click "Connection Details"
2. Copy **Connection String**:
   ```
   postgresql://username:password@hostname.neon.tech/neondb?sslmode=require
   ```
3. Save this in your environment variables

### Step 4: Configure Database
1. **Connection Pooling** (Recommended for serverless):
   - In Neon dashboard → Settings → Connection Pooling
   - Enable pooling
   - Use pooled connection string for production

2. **Backups**:
   - Free tier: 7 days automatic backups
   - Paid tier: 30+ days configurable

3. **Monitoring**:
   - Enable monitoring in Neon dashboard
   - Set up alerts for:
     - Database size > 80% of limit
     - Connection count > 80% of limit
     - Slow queries

### Step 5: Run Migrations
```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://user:pass@neon-hostname/db?sslmode=require"

# Run migrations
npx prisma migrate deploy

# Verify
npx prisma db pull
```

---

## Redis Setup

### Option 1: Upstash Redis (Recommended - Serverless)

1. **Create Account**: https://upstash.com
2. **Create Database**:
   - Name: `guests-app-cache`
   - Region: Choose closest to your backend
   - Type: Regional (free tier)
3. **Get Connection Details**:
   ```env
   REDIS_URL=redis://default:password@endpoint.upstash.io:port
   ```
4. **Configure**:
   - Max Commands Per Second: 10,000 (free tier)
   - Max Request Size: 1 MB
   - TLS: Enabled by default

### Option 2: Redis Cloud

1. **Create Account**: https://redis.com/try-free
2. **Create Subscription**: Free 30MB
3. **Create Database**:
   - Name: `guests-app`
   - Choose region
4. **Get Connection String**:
   ```env
   REDIS_HOST=redis-hostname.redis.cloud
   REDIS_PORT=12345
   REDIS_PASSWORD=your-password
   ```

### Option 3: Self-Hosted Redis (EC2/DigitalOcean)

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Set password
requirepass your-strong-password

# Bind to localhost (or 0.0.0.0 if remote)
bind 127.0.0.1

# Enable persistence
appendonly yes

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Test connection
redis-cli -a your-strong-password ping
# Should return: PONG
```

---

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` (DO NOT COMMIT):

```env
# ==================================
# APPLICATION
# ==================================
NODE_ENV=production
PORT=3000

# ==================================
# DATABASE (Neon PostgreSQL)
# ==================================
DATABASE_URL="postgresql://user:pass@hostname.neon.tech/db?sslmode=require"

# ==================================
# REDIS CACHE
# ==================================
# Option 1: Full URL (Upstash, Railway)
REDIS_URL="redis://default:pass@hostname:port"

# Option 2: Individual values (Redis Cloud, Self-hosted)
REDIS_HOST=your-redis-host.com
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password

# ==================================
# CORS
# ==================================
CORS_ORIGIN=https://your-frontend-domain.com

# ==================================
# CACHE CONFIG
# ==================================
CACHE_TTL=300
CACHE_MAX_ITEMS=100

# ==================================
# API CONFIG
# ==================================
API_PREFIX=api
API_VERSION=v1

# ==================================
# LOGGING (Optional)
# ==================================
LOG_LEVEL=error
```

### Frontend Environment Variables

Create `frontend/.env` (DO NOT COMMIT):

```env
# ==================================
# API CONFIGURATION
# ==================================
VITE_API_URL=https://your-backend-domain.com/api/v1

# For Vercel, use:
# VITE_API_URL=https://your-app.railway.app/api/v1

# For custom domain:
# VITE_API_URL=https://api.yourdomain.com/v1
```

### Verification Checklist

- [ ] All required variables set
- [ ] No hardcoded secrets
- [ ] `.env` in `.gitignore`
- [ ] `.env.example` updated
- [ ] Production URLs (not localhost)
- [ ] SSL/TLS enabled (`https://`, `?sslmode=require`)
- [ ] CORS origin matches frontend domain

---

## Build & Deploy

### Local Build Test

Before deploying, test locally:

```bash
# Backend
cd backend
npm run build
# Should complete without errors
# Check dist/ folder created

# Frontend
cd frontend
npm run build
# Should complete without errors
# Check dist/ folder created
# Verify bundle size (<500KB main chunk)
```

### Deployment Commands

```bash
# 1. Ensure you're on release branch
git checkout release/v1.0.0

# 2. Run all tests
npm run test              # Backend tests
cd frontend && npm run test  # Frontend tests

# 3. Build both
npm run build

# 4. Commit any final changes
git add .
git commit -m "chore: prepare for production deployment v1.0.0"

# 5. Merge to main
git checkout main
git merge release/v1.0.0 --no-ff

# 6. Tag release
git tag -a v1.0.0 -m "Production Release v1.0.0"

# 7. Push to remote
git push origin main --tags

# 8. Deploy (platform-specific)
# Vercel/Railway/Render: Auto-deploy on push
# AWS/DigitalOcean: SSH and git pull
```

---

## Post-Deployment

### Immediate Verification (First 5 minutes)

```bash
# 1. Health Check
curl https://your-backend.com/api/v1/health
# Expected: 200 OK

# 2. Test Frontend
# Open https://your-frontend.com in browser
# Should load without errors

# 3. Test API from Frontend
# Try adding a guest
# Try filtering, searching
# Try exporting CSV/PDF

# 4. Check Logs
# Vercel: Dashboard → Functions → Logs
# Railway: Dashboard → Deployments → Logs
# AWS: ssh and `pm2 logs guests-backend`

# 5. Verify Database
# Check Neon dashboard for connections
# Should see active connections

# 6. Verify Redis
# Check Upstash/Redis Cloud dashboard
# Should see commands being executed
```

### First Hour Monitoring

- [ ] Monitor error rates (should be <0.1%)
- [ ] Monitor response times (<200ms avg)
- [ ] Check cache hit rates (>80%)
- [ ] Verify HTTPS working (no mixed content)
- [ ] Test all critical user flows
- [ ] Monitor server resources (CPU, memory)
- [ ] Check database connection pool

### First Day Monitoring

- [ ] Review error logs (any patterns?)
- [ ] Check performance metrics
- [ ] Monitor uptime (should be 100%)
- [ ] User feedback (any issues reported?)
- [ ] Security scan (no vulnerabilities)
- [ ] Backup verification (can restore?)

### Setup Ongoing Monitoring

1. **Uptime Monitoring** (UptimeRobot - Free):
   ```
   Monitor URL: https://your-backend.com/api/v1/health
   Check Interval: 5 minutes
   Alert: Email/SMS when down
   ```

2. **Error Tracking** (Sentry - Optional):
   ```bash
   # Install Sentry
   npm install @sentry/node @sentry/nestjs --save
   
   # Configure in main.ts
   import * as Sentry from '@sentry/nestjs';
   Sentry.init({ dsn: 'your-dsn' });
   ```

3. **Analytics** (Optional):
   - Google Analytics
   - Plausible Analytics
   - Posthog

---

## Troubleshooting

### Common Issues

#### 1. Backend not connecting to database

**Symptoms**: 500 errors, "Cannot connect to database"

**Solutions**:
```bash
# Verify connection string format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host.neon.tech/db?sslmode=require

# Test connection
npx prisma db pull

# Check Neon dashboard
# - Is database running?
# - Are there connection errors?
# - Is connection limit reached?

# Verify SSL mode
# Must include: ?sslmode=require
```

#### 2. Redis connection failed

**Symptoms**: Cache not working, slow responses

**Solutions**:
```bash
# Test Redis connection
redis-cli -h your-host -p 6379 -a password ping
# Should return: PONG

# Check Redis URL format
echo $REDIS_URL
# Should be: redis://default:pass@host:port

# Verify Redis is running
# Upstash: Check dashboard
# Self-hosted: sudo systemctl status redis-server
```

#### 3. CORS errors in browser

**Symptoms**: "No 'Access-Control-Allow-Origin' header"

**Solutions**:
```env
# Check CORS_ORIGIN matches frontend domain exactly
CORS_ORIGIN=https://your-exact-frontend-domain.com

# Verify no trailing slash
# ✅ Good: https://app.com
# ❌ Bad: https://app.com/

# Redeploy backend after changing CORS_ORIGIN
```

#### 4. Frontend API calls failing

**Symptoms**: Network errors, 404s

**Solutions**:
```env
# Verify VITE_API_URL includes /api/v1
VITE_API_URL=https://backend.com/api/v1

# Must match backend API_PREFIX and API_VERSION
# Backend: API_PREFIX=api, API_VERSION=v1
# Frontend: VITE_API_URL=https://backend.com/api/v1

# Test API directly
curl https://backend.com/api/v1/guests
```

#### 5. Migrations not applied

**Symptoms**: Database schema errors, missing tables

**Solutions**:
```bash
# Check migrations status
npx prisma migrate status

# Apply pending migrations
npx prisma migrate deploy

# If using platform CLI (Railway/Render)
railway run npx prisma migrate deploy
# or
render run npx prisma migrate deploy

# Verify schema
npx prisma db pull
npx prisma studio  # Visual check
```

#### 6. Build errors

**Symptoms**: "Build failed", TypeScript errors

**Solutions**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be >= 18

# Verify TypeScript
npx tsc --noEmit

# Check for missing dependencies
npm install

# Review build logs for specific errors
```

#### 7. Performance issues

**Symptoms**: Slow responses, timeouts

**Solutions**:
1. **Check Database**:
   - Add indexes to frequently queried columns
   - Verify query performance in Neon dashboard
   - Enable connection pooling

2. **Check Redis**:
   - Verify cache is working: check hit rates
   - Increase CACHE_TTL if appropriate
   - Check Redis memory usage

3. **Check Backend**:
   - Monitor CPU/Memory usage
   - Scale up instance size if needed
   - Enable compression in Nginx

4. **Check Frontend**:
   - Run Lighthouse audit
   - Optimize bundle size
   - Enable CDN for static assets

#### 8. SSL/HTTPS issues

**Symptoms**: "Not Secure" warning, mixed content

**Solutions**:
```bash
# Verify SSL certificate
curl -I https://yourdomain.com
# Should return: HTTP/2 200

# Check certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Force HTTPS redirect in Nginx
# Add to server block:
if ($scheme != "https") {
    return 301 https://$server_name$request_uri;
}

# Check for mixed content
# All resources must use https:// not http://
```

### Getting Help

1. **Check Logs**: Always start with logs
   - Backend: Platform dashboard or `pm2 logs`
   - Frontend: Browser console (F12)
   - Database: Neon dashboard → Query insights
   - Redis: Upstash dashboard → Logs

2. **Documentation**:
   - [README.md](README.md)
   - [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
   - [HTTPS_SECURITY.md](HTTPS_SECURITY.md)

3. **Community**:
   - GitHub Issues: https://github.com/Solideomyers/guests-app/issues
   - Stack Overflow
   - Platform-specific docs (Vercel, Railway, etc.)

---

## Rollback Procedure

If deployment fails or critical issues arise:

### Quick Rollback (Vercel/Railway/Render)

1. **Go to Deployments Dashboard**
2. **Find Previous Working Deployment**
3. **Click "Redeploy"** or "Rollback"
4. **Verify** working properly

### Git Rollback (AWS/DigitalOcean)

```bash
# SSH to server
ssh user@your-server

# Stop services
pm2 stop all

# Rollback git
cd /path/to/guests-app
git fetch --tags
git checkout v0.9.0  # Previous version

# Rebuild
cd backend
npm install
npm run build

cd ../frontend
npm install
npm run build

# Restart
pm2 restart all
pm2 save
```

### Database Rollback

```bash
# Only if migrations breaking
npx prisma migrate down --preview-feature

# Or restore from backup
# In Neon dashboard: Restore from backup
```

---

## Success Criteria

Deployment is successful when:

- ✅ All health checks passing
- ✅ Frontend loads without errors
- ✅ API responds within acceptable times (<200ms)
- ✅ Database connections stable
- ✅ Redis cache working (>80% hit rate)
- ✅ HTTPS working (green padlock)
- ✅ No errors in logs
- ✅ All critical user flows working
- ✅ Mobile responsive
- ✅ Monitoring active
- ✅ Backups configured

---

## Next Steps After Deployment

1. **Monitor for 24 hours** - Watch for any issues
2. **User Feedback** - Collect initial feedback
3. **Performance Optimization** - Based on real data
4. **Documentation** - Update with lessons learned
5. **Celebrate** 🎉 - You deployed to production!

---

**Need Help?** Open an issue on GitHub: https://github.com/Solideomyers/guests-app/issues

**Version**: 1.0.0  
**Last Updated**: October 21, 2025  
**Maintained by**: Solideomyers
