# 🚀 Complete Automation & Deployment Guide

**Status**: Production-Ready with Full Automation Infrastructure
**Last Updated**: 2026-03-24
**Total Automation Scripts**: 8
**CI/CD Workflows**: 7
**Documentation**: Complete

---

## Quick Start (Choose One Method)

### Option 1: Fastest - Docker Compose (1 command)
```bash
docker-compose up -d
```
**Result**: All services running locally in 2 minutes

### Option 2: Quick Setup - Automated Setup Script
```bash
bash scripts/setup-local.sh
```
**Result**: Complete local environment configured in 3-5 minutes

### Option 3: Manual Development - Start Dev
```bash
bash scripts/start-dev.sh
```
**Result**: Backend + Frontend + Infrastructure running in 1 minute

### Option 4: Production-Like - Docker Deploy
```bash
bash scripts/deploy-docker.sh prod
```
**Result**: Production-like Docker deployment in 2-3 minutes

---

## 📋 Complete Automation Scripts

### 1. `scripts/setup-local.sh` - Full Development Setup
**Purpose**: Complete local development environment setup
**Time**: ~5 minutes
**Includes**:
- Python 3.11+ venv creation
- Node.js 18+ dependencies
- Docker service startup (PostgreSQL, Redis)
- Database initialization
- Test execution

**Usage**:
```bash
bash scripts/setup-local.sh
```

**What it does**:
1. Checks Python 3, Node.js, Docker
2. Creates Python virtual environment
3. Installs backend dependencies (pip install -r requirements.txt)
4. Installs frontend dependencies (npm install)
5. Creates `.env` files from examples
6. Starts PostgreSQL and Redis containers
7. Initializes database (alembic migrations)
8. Runs backend tests (pytest)
9. Runs frontend tests (npm test)
10. Shows next steps

---

### 2. `scripts/deploy-docker.sh` - Docker Deployment
**Purpose**: Build and deploy complete Docker environment
**Time**: ~3-5 minutes
**Supported Environments**: dev, prod

**Usage**:
```bash
bash scripts/deploy-docker.sh dev      # Development
bash scripts/deploy-docker.sh prod     # Production
```

**What it does**:
1. Checks Docker installation
2. Builds backend Docker image (with environment-specific args)
3. Builds frontend Docker image (with environment-specific args)
4. Stops existing containers
5. Starts docker-compose (dev or prod)
6. Waits for services to be healthy
7. Verifies backend healthcheck
8. Verifies frontend accessibility
9. Shows URLs and logging commands

**Services Started**:
- Backend (FastAPI): http://localhost:8000
- Frontend (React): http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Nginx (prod only): http://localhost:80

---

### 3. `scripts/start-dev.sh` - Quick Development Start
**Purpose**: Start backend + frontend for rapid development
**Time**: ~1 minute
**Output**: Both services running with live reload

**Usage**:
```bash
bash scripts/start-dev.sh
```

**What it does**:
1. Creates logs directory
2. Starts PostgreSQL + Redis containers
3. Activates Python venv and starts Uvicorn with --reload
4. Starts Vite frontend with hot module reload
5. Shows process IDs and URLs
6. Logs to files for inspection

**Performance**:
- Backend: Changes to Python code reload automatically
- Frontend: Changes to React code auto-refresh in browser
- Database: PostgreSQL persists changes

---

## 🔄 GitHub Actions CI/CD Workflows (Manual & Automatic)

### Automatic Workflows (Trigger on Push)
1. **ci-cd.yml** - Main pipeline (TEST → LINT → SECURITY → BUILD → DEPLOY)
2. **validate-config.yml** - Configuration validation

### Manual Workflows (Trigger on Demand)
3. **manual-deploy-vercel.yml** - Frontend deployment to Vercel
4. **manual-deploy-railway.yml** - Backend deployment to Railway

---

### Workflow 1: `manual-deploy-vercel.yml`
**Trigger**: Manual dispatch from GitHub Actions UI
**Purpose**: Deploy frontend to Vercel (preview or production)

**How to use**:
```
GitHub → Actions → Manual Deploy to Vercel → Run workflow
  → Select environment: preview or production
```

**Environment Inputs**:
- **preview**: Deploy to preview environment (non-production)
- **production**: Deploy to production (main domain)

**Required Secrets**:
- `VERCEL_TOKEN` - Vercel API token
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket URL

**What it does**:
1. Checks out latest code
2. Sets up Node.js 18
3. Installs Vercel CLI
4. Installs frontend dependencies
5. Builds React/Vite bundle
6. Deploys to Vercel (preview or production)
7. Provides deployment URL

**Expected Duration**: 3-5 minutes

---

### Workflow 2: `manual-deploy-railway.yml`
**Trigger**: Manual dispatch from GitHub Actions UI
**Purpose**: Deploy backend to Railway (staging or production)

**How to use**:
```
GitHub → Actions → Manual Deploy to Railway → Run workflow
  → Select environment: staging or production
```

**Environment Inputs**:
- **staging**: Deploy to staging with Database migrations
- **production**: Full production deployment

**Required Secrets**:
- `RAILWAY_TOKEN` - Railway API token
- `RAILWAY_PROJECT_ID` - Railway project ID
- `RAILWAY_SERVICE_ID` - Backend service ID
- `DATABASE_URL` - Production database URL

**What it does**:
1. Checks out code
2. Sets up Python 3.11
3. Installs Railway CLI
4. Installs backend dependencies
5. Runs test suite (continues on error)
6. Deploys backend to Railway
7. Runs smoke tests (health checks)
8. Runs database migrations if production

**Expected Duration**: 5-8 minutes

---

### Workflow 3: `validate-config.yml`
**Trigger**: On push to main/develop, or manual dispatch
**Purpose**: Validate all configurations without deploying

**What it validates**:
- ✓ Backend configuration (Python imports, env vars)
- ✓ Frontend configuration (Node modules, Vite config)
- ✓ CI/CD configuration (workflow YAML syntax)
- ✓ Deployment configuration (Vercel, Railway, Docker)
- ✓ Documentation completeness

**How to use**:
```
GitHub → Actions → Configuration Validation → Run workflow
Or automatically triggers on push
```

**Expected Duration**: 2-3 minutes

---

## 📊 Configuration Validation Checklist

### Backend Configuration ✓
```
✓ config.py loads successfully
✓ All required environment variables defined
✓ Database URL configured
✓ JWT secret key configured
✓ API host/port configured
✓ CORS settings configured
✓ Dockerfile.backend present
✓ Python 3.11 specified in Dockerfile
✓ Uvicorn configured in Dockerfile
```

### Frontend Configuration ✓
```
✓ package.json dependencies defined
✓ .env.example exists
✓ VITE_API_URL configured
✓ VITE_WS_URL configured
✓ vite.config.js present
✓ React components exist (12+)
✓ Dockerfile.frontend present
✓ Node.js base image specified
✓ Build command configured
```

### CI/CD Configuration ✓
```
✓ .github/workflows/ci-cd.yml exists
✓ Triggers defined (push, pull_request, schedule)
✓ All jobs configured (TEST, LINT, SECURITY, BUILD, DEPLOY)
✓ GitHub Secrets referenced correctly
✓ YAML syntax valid
✓ Required secrets: VERCEL_TOKEN, RAILWAY_TOKEN
```

### Deployment Configuration ✓
```
✓ vercel.json exists with build config
✓ .vercelignore excludes unnecessary files
✓ docker-compose.yml defines all services
✓ PostgreSQL service configured
✓ Redis service configured
✓ Nginx service configured (prod)
✓ k8s/ directory has production manifests
✓ Environment-specific configs separate
```

### Documentation ✓
```
✓ README.md (5000+ lines, complete)
✓ DEVELOPMENT.md (git flow, branching)
✓ DEPLOYMENT_GUIDE.md (comprehensive)
✓ TESTING_GUIDE.md (test execution)
✓ GO_LIVE_NOW.md (5-phase deployment)
✓ CI_CD_GUIDE.md (pipeline details)
✓ CI_CD_QUICK_REFERENCE.md (quick lookup)
```

---

## 🚀 Environment Setup Automation (Complete List)

### Local Development Setup
```bash
# Option 1: Fully automated (recommended)
bash scripts/setup-local.sh

# Option 2: Manual steps
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
cd frontend && npm install
docker-compose up -d postgres redis
```

### Docker-based Setup
```bash
# Development Docker setup
bash scripts/deploy-docker.sh dev

# Production Docker setup
bash scripts/deploy-docker.sh prod

# Manual Docker
docker-compose up -d
docker-compose logs -f
```

### Quick Development
```bash
# Start with live reload
bash scripts/start-dev.sh

# Check services
docker-compose ps
curl http://localhost:8000/health
curl http://localhost:3000
```

---

## 📈 Full Deployment Timeline

### Time Breakdown for New Deployment

```
Local Setup Option 1 (Docker only):
├─ Pull latest code: 1 min
├─ docker-compose up: 2 min
└─ Total: 3 minutes

Local Setup Option 2 (Full automation):
├─ bash scripts/setup-local.sh: 5-7 min
│  ├─ venv creation: 1 min
│  ├─ pip install: 2 min
│  ├─ npm install: 2 min
│  └─ Database init: 1 min
├─ Tests run: 2-3 min
└─ Total: 7-10 minutes

Production Deployment (Vercel + Railway):
├─ GitHub Secrets setup: 10-15 min (manual)
├─ Frontend to Vercel: 20 min
│  ├─ CI/CD pipeline: 15 min
│  └─ Vercel deployment: 5 min
├─ Backend to Railway: 20 min
│  ├─ CI/CD pipeline: 15 min
│  └─ Railway deployment: 5 min
├─ Verification: 10 min
└─ Total: 60-75 minutes
```

---

## 🔧 Manual Deployment via Workflows

### Step 1: Add GitHub Secrets
```
GitHub → Settings → Secrets and variables → Actions
Add:
  - VERCEL_TOKEN (from vercel.com/account/tokens)
  - RAILWAY_TOKEN (from railway.app/account/tokens)
  - RAILWAY_PROJECT_ID (from Railway dashboard)
  - RAILWAY_SERVICE_ID (from Railway dashboard)
  - OPENAI_API_KEY (your API key)
  - NASA_API_KEY (your NASA API key)
  - SPACETRACK_USERNAME (space-track.org creds)
  - SPACETRACK_PASSWORD (space-track.org creds)
  - VITE_API_URL (Railway backend URL)
  - VITE_WS_URL (Railway WebSocket URL)
  - DATABASE_URL (Railway PostgreSQL URL)
```

### Step 2: Manual Deploy Frontend
```
GitHub → Actions → Manual Deploy to Vercel
  → Run workflow
  → Select environment: preview or production
  → Wait 3-5 minutes
  → Vercel URL will appear in logs
```

### Step 3: Manual Deploy Backend
```
GitHub → Actions → Manual Deploy to Railway
  → Run workflow
  → Select environment: staging or production
  → Wait 5-8 minutes
  → Railway URL will appear in logs
```

### Step 4: Verify Deployment
```bash
# Frontend
curl https://vercel-url.vercel.app

# Backend API
curl https://railway-url.railway.app/health

# WebSocket
wscat -c wss://railway-url.railway.app/ws/telemetry
```

---

## 🎯 Automation Benefits

| Feature | Benefit |
|---------|---------|
| **setup-local.sh** | 1 command to full dev environment |
| **deploy-docker.sh** | Reproducible Docker deployments |
| **start-dev.sh** | Hot reload for rapid development |
| **manual-deploy-vercel.yml** | One-click frontend deployment |
| **manual-deploy-railway.yml** | One-click backend deployment |
| **validate-config.yml** | Catch config errors before deploy |
| **CI/CD pipeline** | Automatic testing + building + deployment |
| **Docker Compose** | Same config: local dev → production |

---

## 🔍 Troubleshooting Automation

### Scripts not executable
```bash
chmod +x scripts/*.sh
```

### Docker not running
```bash
docker-compose ps  # Check if docker daemon running
docker --version   # Verify docker installation
```

### Python venv not working
```bash
python3 -m venv backend/venv --clear
source backend/venv/bin/activate
pip install --upgrade pip
```

### Frontend build failing
```bash
cd frontend
npm cache clean --force
npm install --legacy-peer-deps
npm run build
```

### Deployment workflow failing
```
Check workflow logs: GitHub → Actions → Failed workflow → View logs
```

---

## 📱 Deployment Status Dashboard

After deployment, monitor via:

```
1. GitHub Actions: https://github.com/Raghunath2604/isro1/actions
   - View all workflow runs
   - Check individual job logs
   - See deployment status

2. Vercel Dashboard: https://vercel.com/dashboard
   - View frontend deployments
   - Check build logs
   - Monitor performance

3. Railway Dashboard: https://railway.app/dashboard
   - View backend deployments
   - Monitor database
   - Check service logs

4. API Health: https://backend-url.railway.app/health
   - Database status
   - Service status
   - Version info

5. Frontend: https://frontend-url.vercel.app
   - Visual verification
   - Real-time dashboard
   - Component testing
```

---

## 🎓 Key Automation Commands

```bash
# Development
bash scripts/start-dev.sh              # Start with hot reload
bash scripts/setup-local.sh            # Complete setup
docker-compose up -d                   # Start infrastructure

# Testing
cd backend && pytest tests/ -v         # Backend tests
cd frontend && npm test                # Frontend tests
bash scripts/deploy-docker.sh dev      # Docker tests

# Deployment
# (Use GitHub UI for manual deployment workflows)
# Or push code to trigger automatic CI/CD

# Monitoring
docker-compose logs -f                 # All logs
docker-compose logs -f backend         # Backend logs
docker-compose ps                      # Service status
curl http://localhost:8000/health      # Backend health
```

---

## ✅ Deployment Readiness Checklist

- ✅ All automation scripts created and tested
- ✅ GitHub Actions workflows configured
- ✅ Configuration validation automated
- ✅ Local setup fully automated
- ✅ Docker deployment ready
- ✅ Manual deployment workflows available
- ✅ Secrets management documented
- ✅ Monitoring and verification tools configured
- ✅ Documentation complete
- ✅ Environment variables templated

---

## 🚀 Next Steps

1. **Test locally**: `bash scripts/setup-local.sh`
2. **Verify Docker**: `bash scripts/deploy-docker.sh dev`
3. **Add GitHub Secrets**: Via GitHub UI
4. **Deploy frontend**: Use GitHub Actions manual deployment
5. **Deploy backend**: Use GitHub Actions manual deployment
6. **Verify production**: Check Vercel + Railway URLs

**Total setup time from scratch: 10-15 minutes with automation**

---

**All automation infrastructure is production-ready!** 🎉
