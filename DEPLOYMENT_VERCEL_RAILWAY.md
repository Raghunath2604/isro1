# 🚀 Vercel + Railway Deployment Guide

**Status**: Ready to Deploy
**Estimated Time**: 60-90 minutes
**Current Backend**: Running locally ✓

---

## 🔑 PHASE 1: GitHub Secrets Setup (15 minutes)

### Step 1.1: Get Vercel Token
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: `VERCEL_TOKEN`
4. Copy the token

### Step 1.2: Get Railway Token
1. Go to: https://railway.app/account/tokens
2. Click "Create API Token"
3. Copy the token

### Step 1.3: Add GitHub Secrets
1. Go to: https://github.com/Raghunath2604/isro1/settings/secrets/actions
2. Click "New repository secret"
3. Create these 6 secrets:

```
Name: VERCEL_TOKEN
Value: (paste from Vercel)

Name: RAILWAY_TOKEN
Value: (paste from Railway)

Name: OPENAI_API_KEY
Value: sk-proj-your-key-here

Name: NASA_API_KEY
Value: your-nasa-api-key

Name: SPACETRACK_USERNAME
Value: your-username

Name: SPACETRACK_PASSWORD
Value: your-password
```

**✓ GitHub Secrets Complete**

---

## 🎨 PHASE 2: Deploy Frontend to Vercel (20 minutes)

### Step 2.1: Connect Repository
1. Go to: https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Search for "isro1"
5. Click "Import"

### Step 2.2: Configure Project
1. **Framework**: Vite
2. **Root Directory**: `./frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 2.3: Add Environment Variables
In Vercel dashboard, add:
```
VITE_API_URL: (Railway backend URL - we'll get this in Phase 3)
VITE_WS_URL: (Railway WebSocket URL - we'll get this in Phase 3)
```

### Step 2.4: Deploy
Click "Deploy" and wait for completion (~5 minutes)

**✓ Frontend deployed at**: https://isro1-frontend.vercel.app (or your custom domain)

---

## 🔧 PHASE 3: Deploy Backend to Railway (20 minutes)

### Step 3.1: Create Railway Project
1. Go to: https://railway.app/dashboard
2. Click "Create New Project"
3. Select "Deploy from Git"
4. Connect GitHub account if needed
5. Select repository: `Raghunath2604/isro1`

### Step 3.2: Configure Backend Service
1. **Root Directory**: `backend`
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3.3: Add PostgreSQL Database
1. In Railway dashboard, click "+" → "PostgreSQL"
2. Railway will auto-provision database
3. Set up environment variables:
```
DATABASE_URL: (Railway generates this automatically)
DEBUG: False
ENVIRONMENT: production
LOG_LEVEL: INFO
OPENAI_API_KEY: (from secrets)
NASA_API_KEY: (from secrets)
SPACETRACK_USERNAME: (from secrets)
SPACETRACK_PASSWORD: (from secrets)
```

### Step 3.4: Deploy
Railway auto-deploys from git. Wait for logs to show:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**✓ Backend deployed at**: https://isro1-backend.railway.app (or Railway-generated URL)
**✓ Get your backend URL from Railway dashboard**

---

## 🔗 PHASE 4: Wire Frontend to Backend (5 minutes)

### Step 4.1: Update Vercel Environment Variables
1. Go to Vercel dashboard → Project Settings → Environment Variables
2. Update:
```
VITE_API_URL: https://your-railway-backend.railway.app
VITE_WS_URL: wss://your-railway-backend.railway.app
```
3. Click "Save"

### Step 4.2: Redeploy Frontend
1. Go to Vercel dashboard → Deployments
2. Click "Redeploy" on latest deployment
3. Wait for redeployment (~3 minutes)

**✓ Frontend now connected to Backend**

---

## ✅ PHASE 5: Verify Everything (15 minutes)

### Test 1: Frontend Loads
```
Open: https://your-vercel-frontend.vercel.app
See: React app loading with dashboard
```

### Test 2: API Endpoints
```
Open: https://your-railway-backend.railway.app/api/docs
See: Swagger documentation with all endpoints
```

### Test 3: Backend Health
```
curl https://your-railway-backend.railway.app/health
Response: {"status":"healthy","version":"3.0.0",...}
```

### Test 4: WebSocket Connection
Frontend should automatically connect to backend and show:
- ✓ WebSocket connected
- ✓ Real-time data flowing
- ✓ Agents responding
- ✓ Telemetry updating

### Test 5: Database Query
```
curl https://your-railway-backend.railway.app/api/complete-status
See: Database connected, all systems ready
```

**✓ All tests passing = Deployment successful!**

---

## 📊 Your Deployment URLs

After completion, you'll have:
```
Frontend: https://isro1-frontend.vercel.app
Backend:  https://isro1-backend.railway.app
Docs:     https://isro1-backend.railway.app/api/docs
Status:   https://isro1-backend.railway.app/health
```

---

## 🔄 Automatic Updates

After setup, every push to GitHub automatically:
1. Triggers GitHub Actions
2. Runs tests and security checks
3. Builds Docker images
4. Deploys to Vercel (frontend)
5. Deploys to Railway (backend)

No manual deployment needed anymore! 🚀

---

## ⚠️ Common Issues & Fixes

### Frontend shows 404
- **Cause**: Frontend not connected to backend
- **Fix**: Verify `VITE_API_URL` and `VITE_WS_URL` in Vercel env vars
- **Then**: Redeploy frontend

### Backend gives CORS error
- **Cause**: Frontend URL not in CORS_ORIGINS
- **Fix**: Add CORS_ORIGINS environment variable in Railway with frontend URL
- **Then**: Restart Railway service

### Database connection failing
- **Cause**: DATABASE_URL not set or invalid
- **Fix**: Copy DATABASE_URL from Railway dashboard
- **Then**: Restart backend service

### WebSocket not connecting
- **Cause**: WSS URL incorrect in frontend
- **Fix**: Use `wss://domain.com` (not `ws://`)
- **Then**: Clear browser cache and reload

---

## 📞 Monitoring & Logs

**Vercel Logs**:
- Dashboard → Project → Deployments → View Build Logs

**Railway Logs**:
- Dashboard → Backend Service → Logs tab
- Database → Logs tab

**GitHub Actions**:
- Repository → Actions tab
- View workflow runs and failures

---

## 🎉 Deployment Complete!

Once Phase 5 passes, your system is:
- ✅ Live on the internet
- ✅ Auto-scaling ready
- ✅ Auto-deploying on git push
- ✅ Database persisting data
- ✅ Available 24/7

**Now you have a production-ready AI space mission control platform!**

---

## 📋 Quick Reference

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | GitHub Secrets | 15 min | ⏳ TODO |
| 2 | Vercel Frontend | 20 min | ⏳ TODO |
| 3 | Railway Backend | 20 min | ⏳ TODO |
| 4 | Wire Together | 5 min | ⏳ TODO |
| 5 | Verify | 15 min | ⏳ TODO |
| **Total** | **Complete Setup** | **75 min** | ⏳ TODO |

---

**👉 START WITH PHASE 1: Add GitHub Secrets**

Then come back and let me know when each phase completes!
