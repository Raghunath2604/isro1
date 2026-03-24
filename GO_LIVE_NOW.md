# 🚀 DEPLOYMENT EXECUTION - LET'S GO LIVE!

## Phase 1: Add GitHub Secrets (15 min) ⏰

### Step 1.1: Get Vercel Token
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "GitHub CI/CD"
4. Leave expiration: "No expiry"
5. Click "Create"
6. **Copy the entire token value**

### Step 1.2: Get Railway Token
1. Go to: https://railway.app/account/tokens
2. Click "Create New Token"
3. **Copy the token value**

### Step 1.3: Add Secrets to GitHub
1. Go to: https://github.com/Raghunath2604/isro1/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret one by one:

```
Name: VERCEL_TOKEN
Value: [paste from Vercel]
→ Click "Add secret"

Name: RAILWAY_TOKEN
Value: [paste from Railway]
→ Click "Add secret"

Name: OPENAI_API_KEY
Value: sk-... (use existing key or get from https://openai.com/api)
→ Click "Add secret"

Name: NASA_API_KEY
Value: DEMO_KEY (for testing)
→ Click "Add secret"

Name: SPACETRACK_USERNAME
Value: [your space-track.org username]
→ Click "Add secret"

Name: SPACETRACK_PASSWORD
Value: [your space-track.org password]
→ Click "Add secret"
```

✅ **PHASE 1 COMPLETE** - All secrets added!

---

## Phase 2: Deploy Frontend to Vercel (20 min) ⏰

### Step 2.1: Create Vercel Project
1. Go to: https://vercel.com/dashboard
2. Click "New Project"
3. Click "Import Git Repository"
4. Search for: "Raghunath2604/isro1"
5. Click "Import"

### Step 2.2: Configure Project
On the "Configure Project" page:
- **Framework**: Select "Vite"
- **Root Directory**: Select "./frontend"
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Leave everything else as default

### Step 2.3: Add Environment Variables
On the "Environment Variables" section:

```
VITE_API_URL
Value: https://[YOUR_RAILWAY_BACKEND_URL]
(You'll set this after Railway deploys - leave empty for now)

VITE_WS_URL
Value: wss://[YOUR_RAILWAY_BACKEND_URL]
(You'll set this after Railway deploys - leave empty for now)
```

Just add the keys, we'll update values after Railway setup.

### Step 2.4: Deploy
Click "Deploy"

Wait for deployment to complete (~3-5 minutes)

**You'll get**: https://isro1.vercel.app (or similar)

✅ **PHASE 2 COMPLETE** - Frontend deployed!

---

## Phase 3: Deploy Backend to Railway (20 min) ⏰

### Step 3.1: Create Railway Project
1. Go to: https://railway.app/dashboard
2. Click "New Project"
3. Click "Deploy from GitHub Repo"
4. Search for and select: "Raghunath2604/isro1"
5. Wait for connection

### Step 3.2: Configure Backend Service
Click on the service that appears:
- **Root Directory**: `./backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3.3: Add PostgreSQL Database
1. Click "Add Service" (in Railway)
2. Select "Database"
3. Choose "PostgreSQL"
4. Wait for PostgreSQL to deploy

### Step 3.4: Set Environment Variables
In the backend service settings, add these variables:

```
DATABASE_URL
(Should auto-fill from PostgreSQL - verify it's there)

OPENAI_API_KEY
[from GitHub Secrets]

NASA_API_KEY
DEMO_KEY

SPACETRACK_USERNAME
[from GitHub Secrets]

SPACETRACK_PASSWORD
[from GitHub Secrets]

JWT_SECRET_KEY
[generate random: visit https://passwordsgenerator.com and copy 32-char string]
```

### Step 3.5: Deploy Backend
Click "Deploy"

Wait for backend to deploy (~3-5 minutes)

**You'll get**: https://as3-backend.railway.app (or similar)

✅ **PHASE 3 COMPLETE** - Backend deployed!

---

## Phase 4: Wire Frontend to Backend (5 min) ⏰

### Step 4.1: Update Vercel Environment Variables
1. Go to: Vercel Dashboard → Your Project → Settings
2. Click "Environment Variables"
3. Edit the variables:

```
VITE_API_URL
New Value: https://as3-backend.railway.app

VITE_WS_URL
New Value: wss://as3-backend.railway.app
```

### Step 4.2: Redeploy Frontend
1. Go to: Vercel Dashboard → Deployments
2. Click "Redeploy" on the latest deployment
3. Wait for redeployment (~2 min)

✅ **PHASE 4 COMPLETE** - Frontend now connects to backend!

---

## Phase 5: Verify Everything Works (15 min) ⏰

### Step 5.1: Test Frontend
1. Visit: https://isro1.vercel.app (your Vercel URL)
2. You should see the dashboard loading
3. ✅ Frontend works!

### Step 5.2: Test Backend API
1. Visit: https://as3-backend.railway.app/api/docs
2. You should see Swagger UI with all endpoints
3. ✅ Backend works!

### Step 5.3: Test WebSocket Connection
1. Open your Vercel frontend URL in browser
2. Open DevTools (F12)
3. Go to Console
4. You should see:
   ```
   Connected to room: telemetry
   ```
5. ✅ WebSocket works!

### Step 5.4: Check GitHub Actions
1. Go to: https://github.com/Raghunath2604/isro1/actions
2. You should see workflow runs
3. All jobs should be showing: ✅ (green checkmarks)
4. The last job should be "DEPLOY"
5. ✅ CI/CD working!

### Step 5.5: Test Auto-Deployment
Make a small change and push to main:
```bash
# Make a tiny change (e.g., update README)
echo "# System is LIVE!" >> README.md

# Commit
git add README.md
git commit -m "test: verify auto-deployment"

# Push to main (triggers auto-deployment)
git push origin main

# Watch GitHub Actions run automatically
# Changes should appear on Vercel + Railway in 20-25 min
```

✅ **PHASE 5 COMPLETE** - Everything verified!

---

## 🎉 YOU'RE LIVE!

**Your System is Now Production-Ready:**
- ✅ Frontend: https://isro1.vercel.app
- ✅ Backend: https://as3-backend.railway.app
- ✅ API Docs: https://as3-backend.railway.app/api/docs
- ✅ CI/CD: Auto-testing & auto-deployment active
- ✅ Database: PostgreSQL connected

---

## 📊 Timeline Summary

| Phase | Task | Duration | Total |
|-------|------|----------|-------|
| 1 | Add GitHub Secrets | 15 min | 15 min |
| 2 | Deploy Frontend | 20 min | 35 min |
| 3 | Deploy Backend | 20 min | 55 min |
| 4 | Wire Frontend to Backend | 5 min | 60 min |
| 5 | Verify Everything | 15 min | **75 min** |

**Total Time to Live: ~75-90 minutes** 🚀

---

## 🔄 Your New Automated Workflow

After deployment, this is how you work:

```
1. Create feature branch
   git checkout -b feature/my-feature

2. Make changes and test locally
   pytest tests/ -v
   npm test

3. Push to GitHub
   git push origin feature/my-feature

4. Create Pull Request
   → GitHub Actions auto-runs tests

5. Merge to develop (if tests pass)
   → GitHub Actions builds Docker images

6. Eventually merge develop → main
   → GitHub Actions auto-deploys
   → Changes live in 20-25 minutes ✅

NO MANUAL DEPLOYMENT!
Everything is automated!
```

---

** 🎊 CONGRATULATIONS! You're production-ready! 🎊 **

Your AI-powered space system is about to go live!

Start with **Phase 1: Add GitHub Secrets** and follow through all 5 phases.

Total time: ~90 minutes to production! ⏰

**Let's make it LIVE! 🚀**
