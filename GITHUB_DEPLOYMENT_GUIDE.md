# 🚀 Complete GitHub & Deployment Guide

This guide walks you through deploying the AS³ Platform to production using GitHub, Vercel, and Railway.

## ⏱️ Time Estimate: ~90 minutes total

---

## PART 1: GitHub Repository Setup (15 minutes)

### Step 1.1: Create GitHub Repository

1. Go to **https://github.com/new**
2. Fill in the form:
   ```
   Repository name: as3-platform
   Description: AI-powered autonomous space mission control platform
   Visibility: Public (for open source) or Private (for commercial)
   Initialize with: NO (we already have files)
   ```
3. Click **Create repository**
4. **Important:** Do NOT add README, .gitignore, or license (we have these)

### Step 1.2: Add Remote & Push Code

In your terminal:

```bash
cd /c/Users/raghu/Downloads/isro1

# Set your GitHub username
GITHUB_USER="your-username-here"
REPO_NAME="as3-platform"

# Add remote origin
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git

# Verify remote
git remote -v
# Output should show:
# origin  https://github.com/YOUR_USER/as3-platform.git (fetch)
# origin  https://github.com/YOUR_USER/as3-platform.git (push)

# Push all branches to GitHub
git branch -M main  # Ensure master is named main
git push -u origin main
git push -u origin develop
git push -u origin staging

# Verify branches on GitHub
git branch -r
# Should show:
# origin/HEAD -> origin/main
# origin/develop
# origin/main
# origin/staging
```

**Result:** All code now on GitHub! ✅

---

## PART 2: Security - Rotate Credentials (10 minutes) ⚠️ CRITICAL

### Step 2.1: Rotate OpenAI API Key

1. Go to https://platform.openai.com/account/api-keys
2. Click "Delete" on the old key: `sk-...` (visible in .env)
3. Click "Create new secret key"
4. Copy new key (save securely)
5. **Do NOT put in .env file yet** - we'll use GitHub Secrets

### Step 2.2: Rotate NASA API Key

1. Go to https://api.nasa.gov
2. Under your API key: `kkn8pA8Ac6Pwv0WFR1V83f2zewmnEbfIdrGaja86`
3. Click "Regenerate API key"
4. Copy new key
5. Save for next step

### Step 2.3: Rotate Space-Track Credentials

1. Go to https://www.space-track.org
2. Login with current credentials from .env
3. Go to Account → Change Password
4. Set new password (e.g., something like `SpaceTrack@2024Secure`)
5. Save credentials securely

### Step 2.4: Generate Gmail App Password (for SMTP)

1. Go to https://myaccount.google.com/apppasswords
2. Select app: `Mail`
3. Select device: `Windows Computer` (or your OS)
4. Click **Generate**
5. Google shows 16-character password
6. Copy and save

**Status:** All credentials rotated! ✅

---

## PART 3: GitHub Secrets Configuration (10 minutes)

### Step 3.1: Add Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** (top tab)
3. Left sidebar: Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 3.2: Add Each Secret

Click "New repository secret" for each and add:

**Secret 1: OPENAI_API_KEY**
- Name: `OPENAI_API_KEY`
- Value: `sk-...` (new key from step 2.1)
- Click **Add secret**

**Secret 2: NASA_API_KEY**
- Name: `NASA_API_KEY`
- Value: (new key from step 2.2)
- Click **Add secret**

**Secret 3: SPACETRACK_USERNAME**
- Name: `SPACETRACK_USERNAME`
- Value: `raghunathareddygr94` (from .env)
- Click **Add secret**

**Secret 4: SPACETRACK_PASSWORD**
- Name: `SPACETRACK_PASSWORD`
- Value: (new password from step 2.3)
- Click **Add secret**

**Secret 5: SMTP_PASSWORD**
- Name: `SMTP_PASSWORD`
- Value: (Gmail app password from step 2.4)
- Click **Add secret**

**Secret 6: VERCEL_TOKEN**
- Go to https://vercel.com/account/tokens
- Click "Create Token"
- Name it "as3-github-deploy"
- Set expiration: "No expiration" (for production)
- Copy token
- Back to GitHub → Add secret:
  - Name: `VERCEL_TOKEN`
  - Value: (token from Vercel)
  - Click **Add secret**

**Secret 7: RAILWAY_TOKEN**
- Go to https://railway.app/settings
- Scroll to "API Tokens"
- Click "Create Token"
- Name it "as3-github-deploy"
- Copy token
- Back to GitHub → Add secret:
  - Name: `RAILWAY_TOKEN`
  - Value: (token from Railway)
  - Click **Add secret**

**Verify all secrets added:**
```
✅ OPENAI_API_KEY
✅ NASA_API_KEY
✅ SPACETRACK_USERNAME
✅ SPACETRACK_PASSWORD
✅ SMTP_PASSWORD
✅ VERCEL_TOKEN
✅ RAILWAY_TOKEN
```

**Status:** Secrets configured! ✅

---

## PART 4: Vercel Frontend Deployment (20 minutes)

### Step 4.1: Connect Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste: `https://github.com/YOUR_USER/as3-platform.git`
4. Click **Continue**
5. Select ownership (your account)
6. Click **Import**

### Step 4.2: Configure Vercel Project

Vercel should auto-detect settings. Verify:

```
Framework Preset: Other (since we use Vite)
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
Development Command: npm run dev
```

Click **Configure Project**

### Step 4.3: Add Environment Variables

1. Scroll to "Environment Variables"
2. Add each variable:

```
Name: VITE_API_URL
Value: (leave blank for now, we'll update after Railway deploys)

Name: VITE_WS_URL
Value: (leave blank for now)
```

3. Scroll down → Click **Deploy**

**Wait for build:** Vercel will build and deploy (2-5 minutes)

### Step 4.4: Get Project IDs

After successful deployment:

1. Go to project **Settings**
2. Click **General**
3. Find "Project ID" - copy it
4. Find "Organization ID" - copy it
5. Go back to GitHub repository
6. Settings → Secrets → Add secrets:
   - Name: `VERCEL_PROJECT_ID`, Value: (ID from above)
   - Name: `VERCEL_ORG_ID`, Value: (ID from above)

### Step 4.5: Test Vercel Deployment

1. In GitHub, go to **Actions** tab
2. Look for recent workflow run
3. If showing red ❌: Check logs for errors
4. If showing green ✅: Deployment successful!

**Vercel URL:** `https://as3-platform.vercel.app`

**Status:** Frontend deployed to Vercel! ✅

---

## PART 5: Railway Backend Deployment (20 minutes)

### Step 5.1: Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your GitHub account
4. Select repository: `as3-platform`
5. Click **Deploy**

### Step 5.2: Select Services

Railway shows deployment options:
- Select "Dockerfile"
- Path: `docker/Dockerfile.backend`

Click **Configure**

### Step 5.3: Build & Deploy

Railway will:
1. Clone your repo
2. Build Docker image
3. Create PostgreSQL database automatically
4. Deploy backend container

Wait 3-5 minutes for deployment...

### Step 5.4: Configure Environment Variables

1. In Railway dashboard, click your project
2. Click **Variables** tab
3. Add from GitHub Secrets:

```
OPENAI_API_KEY = (from GitHub Secrets)
NASA_API_KEY = (from GitHub Secrets)
SPACETRACK_USERNAME = raghunathareddygr94
SPACETRACK_PASSWORD = (from GitHub Secrets)
SMTP_PASSWORD = (from GitHub Secrets)
DATABASE_URL = (auto-generated by Railway PostgreSQL)
FRONTEND_BASE_URL = https://as3-platform.vercel.app
DEBUG = False
ENABLE_HTTPS = True
```

4. Click **Save**

### Step 5.5: Get Railway URL

1. In Railway dashboard, click your backend service
2. Look for "Public URL" or similar
3. Copy URL (e.g., `https://as3-api.railway.app`)
4. Add to GitHub Secrets:
   - Name: `RAILWAY_API_URL`
   - Value: (URL from above)

### Step 5.6: Update Vercel with Railway URL

1. Go to Vercel Dashboard → your project
2. Settings → Environment Variables
3. Update:
   - `VITE_API_URL`: `https://as3-api.railway.app`
   - `VITE_WS_URL`: `wss://as3-api.railway.app`
4. Click **Save**
5. Vercel auto-redeploys with new env vars

**Railway URL:** `https://as3-api.railway.app`

**Status:** Backend deployed to Railway! ✅

---

## PART 6: Test Everything (15 minutes)

### Test 6.1: Backend Health

```bash
# Test backend is running
curl https://as3-api.railway.app/health

# Expected response:
# {"status":"healthy","platform":"AS3",...}
```

### Test 6.2: Frontend Load

1. Open https://as3-platform.vercel.app in browser
2. Should see dashboard with:
   - Header with "AS³ Platform"
   - Tab navigation (Dashboard, ISS Tracking, Analytics, Alerts)
   - 3D visualization loading
   - No console errors (F12 → Console tab)

### Test 6.3: API Connection

1. Open browser DevTools (F12)
2. In Console, run:
```javascript
fetch('https://as3-api.railway.app/health')
  .then(r => r.json())
  .then(d => console.log('Backend connected:', d))
```

### Test 6.4: CI/CD Pipeline

1. Test GitHub Actions:
```bash
# Make a test commit
git checkout develop
git commit --allow-empty -m "test: trigger CI/CD pipeline"
git push origin develop

# Watch GitHub
# Go to repository → Actions tab
# Should see workflow running (blue/yellow indicator)
# After 5-10 minutes should show green ✅
```

### Test 6.5: Create Pull Request

```bash
# Create feature branch
git checkout -b feature/test-deployment develop

# Make a small change
echo "# Test" >> README.md

# Commit and push
git add README.md
git commit -m "test: verify PR workflow"
git push origin feature/test-deployment
```

1. Go to GitHub repo
2. Should see "Compare & pull request" button
3. Click it
4. Create PR to develop
5. Watch CI/CD checks run
6. Should all pass (green ✅)

**Status:** Everything tested and working! ✅

---

## PART 7: Production Checklist

Before declaring fully production-ready:

```
Security
✅ All API keys rotated
✅ GitHub Secrets configured
✅ HTTPS enabled (Vercel + Railway both use HTTPS)
✅ Security headers added (backend middleware)
✅ CORS configured for production
✅ Rate limiting enabled

Deployment
✅ Frontend deployed to Vercel
✅ Backend deployed to Railway
✅ Database running (Railway PostgreSQL)
✅ CI/CD pipeline working
✅ Auto-deploy on push to main

Testing
✅ Backend /health endpoint responds
✅ Frontend loads without errors
✅ API connection working
✅ All tests passing (backend + frontend)

Monitoring
✅ Vercel Analytics enabled
✅ Railway logs accessible
✅ Error tracking ready (optional Sentry)

Documentation
✅ README.md complete
✅ DEVELOPMENT.md with branch strategy
✅ TESTING_GUIDE.md with test commands
✅ DEPLOYMENT_GUIDE.md (this file!)
```

---

## 🆘 Troubleshooting

### Issue: Frontend shows 404 or blank page

**Solution:**
```bash
# Check Vercel deployment logs
vercel logs

# If build failed:
# 1. Check npm dependencies (frontend/package.json)
# 2. Verify Vercel config (vercel.json)
# 3. Check VITE_API_URL environment variable

# Redeploy:
git push origin main  # Triggers auto-rebuild
```

### Issue: API calls fail (backend not responding)

**Solution:**
```bash
# Check Railway logs
# Go to Railway dashboard → Service → Logs tab

# Check Railway environment variables
# Make sure DATABASE_URL and all API keys are set

# If database connection fails:
# 1. Check PostgreSQL is running
# 2. Verify DATABASE_URL format
# 3. Check network access in Railway

# Redeploy:
git push origin main  # Triggers rebuild
```

### Issue: CI/CD pipeline failing

**Solution:**
1. Go to GitHub → Actions tab
2. Click failed workflow
3. Click failed job
4. Scroll to see error details
5. Common issues:
   - Missing GitHub Secrets
   - Test failures (run locally: `pytest tests/`, `npm test`)
   - Linting errors (run locally: `flake8 backend`, `npm run lint`)

### Issue: Tests failing locally

**Solution:**
```bash
# Backend tests
pip install -r requirements.txt  # Ensure dependencies installed
pytest tests/ -v                  # Run with verbose output
pytest tests/ -v -s               # Show print statements

# Frontend tests
cd frontend
npm install                       # Ensure dependencies
npm test                          # Run Vitest
npm run test:coverage             # See coverage report

# Database issues
docker-compose up -d postgres     # Ensure DB running
```

---

## 📊 Monitoring Your Deployment

### Vercel Monitoring

1. Go to https://vercel.com/dashboard
2. Click your project
3. View:
   - **Deployments** - see each build/deploy
   - **Analytics** - performance metrics
   - **Logs** - real-time logs
   - **Monitoring** - uptime status

### Railway Monitoring

1. Go to https://railway.app/dashboard
2. Click your project
3. View:
   - **Logs** - real-time logs
   - **Metrics** - CPU, Memory, Network
   - **Database** - PostgreSQL status
   - **Services** - All running services

---

## 🔄 Continuous Deployment Workflow

Now that everything is set up, here's the day-to-day workflow:

```bash
# 1. Create feature branch from develop
git checkout -b feature/new-feature develop

# 2. Make changes, test locally
npm test          # Test frontend
pytest tests/ -v  # Test backend

# 3. Commit with clear message
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push origin feature/new-feature

# 5. Create Pull Request on GitHub
# → GitHub Actions CI/CD runs automatically
# → All checks must pass

# 6. After approval, merge to develop
# → Vercel deploys preview
# → Manual testing on staging

# 7. When ready, create release PR to main
git checkout -b release/v2.1.0 develop
# Update version in package.json + requirements.txt
git push origin release/v2.1.0
# Create PR → After approval, merge to main

# 8. Automatic production deployment
# → Vercel deploy to production
# → Railway deploy latest backend
# → Tests run POST-deploy
```

---

## ✨ You're Live! 🎉

Your AS³ Platform is now:

✅ **Frontend:** https://as3-platform.vercel.app
✅ **Backend:** https://as3-api.railway.app
✅ **API Docs:** https://as3-api.railway.app/api/docs
✅ **CI/CD:** Automatic on every push
✅ **Monitoring:** Real-time on Vercel + Railway

Congratulations on launching a production-grade AI space platform! 🚀

---

## 📞 Support & Next Steps

- **Issues:** GitHub Issues tab
- **Discussions:** GitHub Discussions
- **Logs:** Vercel dashboard or Railway dashboard
- **Documentation:** `README.md`, `DEVELOPMENT.md`, `TESTING_GUIDE.md`

**Next features to consider:**
- Real-time WebSocket communication
- Slack/Email notifications
- Advanced analytics dashboard
- Mobile app
- Multi-language support
- Enterprise SSO integration

---

**Status:** 🟢 Production Deployment Complete

**Last Updated:** 2026-03-24

**Questions?** Check the documentation or open an issue on GitHub!
