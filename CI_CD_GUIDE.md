# 🔄 CI/CD Pipeline Guide

Your repository has a **complete, production-ready GitHub Actions CI/CD pipeline** that automates testing, building, security scanning, and deployment.

---

## 🏗️ Pipeline Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CODE PUSH TO GITHUB                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │   Branch: main or develop │
        │   Event: push or PR       │
        └─────────────┬─────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
┌─────────┐      ┌─────────┐      ┌─────────┐
│  TEST   │      │   LINT  │      │SECURITY │
│         │      │         │      │         │
│ pytest  │      │ flake8  │      │ Trivy   │
│ vitest  │      │ eslint  │      │ Scan    │
│ coverage│      │ black   │      │         │
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                │
     └────────────────┼────────────────┘
                      │
            ✅ All checks pass?
                      │
    ┌─────────────────┴─────────────────┐
    │     All pull_request = skip        │     Push to main?
    │     Build Docker images to          │     ▼
    │     GitHub Container Registry      │ ┌──────────┐
    ▼                                    │ │  DEPLOY  │
┌──────────────────────────────────┐   │ │          │
│  BUILD DOCKER IMAGES (optional)  │   │ │ Vercel   │
│                                  │   │ │ +        │
│ ✓ Backend image                  │   │ │ Railway  │
│ ✓ Frontend image                 │   │ │          │
│ ✓ Push to GHCR                   │   │ └────┬─────┘
└──────────────────────────────────┘   │      │
                                        │      ✅ Live!
                                        │
     Test Failure? PR Rejected!         │
     Deployment Failure? Notified!      │
```

---

## ⚙️ Pipeline Jobs

### 1. **TEST** (Runs Always)
```yaml
✓ Backend Tests (pytest)
  • Connects to PostgreSQL database in CI
  • Runs all tests in backend/tests/
  • Generates coverage report
  • Uploads to Codecov

✓ Frontend Tests (Vitest)
  • Runs React component tests
  • Generates coverage report
  • Must pass before build

Duration: ~2-3 minutes
Failure: Blocks build + deploy
```

### 2. **LINT** (Code Quality)
```yaml
✓ Python Linting (flake8, pylint)
  • Checks syntax errors
  • Validates PEP 8 compliance
  • Max warnings: 0

✓ Python Formatting (black, isort)
  • Ensures consistent code style
  • Validates import order

✓ JavaScript Linting (ESLint)
  • React best practices
  • Code quality standards
  • Max warnings: 0

Duration: ~1-2 minutes
Failure: Blocks deploy
```

### 3. **SECURITY** (Vulnerability Scan)
```yaml
✓ Trivy Filesystem Scan
  • Scans all files for vulnerabilities
  • Checks dependencies
  • Generates SARIF report
  • Uploaded to GitHub Security tab

Duration: ~1-2 minutes
Failure: Creates security alert (doesn't block deploy)
```

### 4. **BUILD** (Docker)
```yaml
✓ Backend Docker Image
  • Builds FastAPI application image
  • Tags: branch name + commit SHA
  • Pushes to GitHub Container Registry (GHCR)

✓ Frontend Docker Image
  • Builds React production bundle
  • Optimized Nginx serving
  • Tags: branch name + commit SHA
  • Pushes to GHCR

Only runs on push to main/develop
Only builds (doesn't deploy to containers)

Duration: ~3-5 minutes
```

### 5. **DEPLOY** (Production)
```yaml
✓ Conditions
  • ONLY runs on: git push to main
  • Requires ALL previous jobs to pass
  • Skips on PRs (test only)

✓ Frontend Deployment
  • Vercel auto-deploy from GitHub
  • Uses VERCEL_TOKEN secret
  • Domain: your-vercel-domain.vercel.app

✓ Backend Deployment
  • Railway auto-deploy from GitHub
  • Uses RAILWAY_TOKEN secret
  • Domain: your-railway-domain.railway.app

✓ Post-Deployment Smoke Tests
  • Tests backend /health endpoint
  • Tests frontend landing page
  • Confirms services are up

✓ Notifications
  • Success: Shows frontend & backend URLs
  • Failure: Alerts with error details

Duration: ~5-10 minutes
```

---

## 🔐 Required GitHub Secrets

Go to: **Settings → Secrets and variables → Actions**

### Essential Secrets (for deployment)
```
VERCEL_TOKEN           - Vercel deployment token
VERCEL_PROJECT_ID      - Vercel project ID (optional)
VERCEL_ORG_ID          - Vercel organization ID (optional)
RAILWAY_TOKEN          - Railway API token
```

### Application Secrets (for runtime)
```
OPENAI_API_KEY         - OpenAI API key
NASA_API_KEY          - NASA API key
SPACETRACK_USERNAME   - Space-Track username
SPACETRACK_PASSWORD   - Space-Track password
```

### How to Get Them

#### Vercel Secrets
```bash
# 1. Go to https://vercel.com/account/tokens
# 2. Create new token (name: "GitHub CI/CD", expires: no expiry)
# 3. Copy token as VERCEL_TOKEN

# 4. Go to Vercel project settings
# 5. Find "Environment Variables" section
# 6. Copy Project ID and Organization ID
```

#### Railway Secrets
```bash
# 1. Go to https://railway.app/account/tokens
# 2. Create new token
# 3. Copy token as RAILWAY_TOKEN
```

---

## 📊 CI/CD Workflow Example

### Scenario 1: Create Feature Branch & PR
```bash
# Developer creates feature branch
git checkout -b feature/new-api

# Make changes
# ... edit files ...

# Commit and push
git commit -m "feat: add new endpoint"
git push origin feature/new-api

# Create Pull Request on GitHub
# ↓
# GitHub Actions Triggers:
#   ✓ TEST - Run all tests
#   ✓ LINT - Check code quality
#   ✓ SECURITY - Scan for vulnerabilities
#   ✗ BUILD - Skipped (PR, not main)
#   ✗ DEPLOY - Skipped (PR trigger)
#
# If all pass: ✅ "All checks passed"
# If any fail: ❌ "Some checks failed"
#
# Code review required
# After approval: Merge to develop
```

### Scenario 2: Merge to Develop
```bash
# Merge feature PR to develop
# ↓
# GitHub Actions Triggers:
#   ✓ TEST
#   ✓ LINT
#   ✓ SECURITY
#   ✓ BUILD (builds Docker images, pushes to GHCR)
#   ✗ DEPLOY - Skipped (develop branch, not main)
#
# Docker images now available at:
#   ghcr.io/YOUR_USERNAME/isro1:develop-backend
#   ghcr.io/YOUR_USERNAME/isro1:develop-frontend
```

### Scenario 3: Release to Production
```bash
# Merge release branch to main
git checkout main
git merge release/v1.0.0
git push origin main

# ↓
# GitHub Actions Triggers:
#   ✓ TEST (pytest + vitest)
#   ✓ LINT (flake8 + eslint)
#   ✓ SECURITY (Trivy scan)
#   ✓ BUILD (Docker images)
#   ✓ DEPLOY (if all above pass!)
#       → Vercel deployment
#       → Railway deployment
#       → Smoke tests
#       → Success notification
#
# System is NOW LIVE! 🚀
```

---

## 🚨 Troubleshooting

### Issue: Tests Fail in CI but Pass Locally

**Cause**: Different environment (CI has isolated environment)

**Solutions**:
```bash
# 1. Check Python version matches (3.11)
python --version

# 2. Clear local cache and retry
rm -rf .pytest_cache __pycache__
pytest tests/ -v

# 3. Check database connection
export DATABASE_URL="postgresql://as3user:as3password@localhost:5432/as3_db"
pytest tests/

# 4. Check Node version matches (18)
node --version
npm test
```

### Issue: Build Fails in GitHub Actions

**Cause**: Missing dependencies or environment variables

**Solutions**:
```bash
# 1. Check requirements.txt is up to date
pip freeze > requirements.txt

# 2. Check package.json is up to date
npm install --save-dev [package]

# 3. Verify env vars in GitHub Secrets
# Settings → Secrets → Check all are present and correct

# 4. Run build locally first
npm run build
```

### Issue: Deploy Fails but Tests Pass

**Cause**: Missing GitHub Secrets for deployment

**Check**:
- [ ] VERCEL_TOKEN is set
- [ ] RAILWAY_TOKEN is set
- [ ] Both tokens are valid (not expired)
- [ ] Vercel/Railway projects exist

**Fix**:
```bash
# 1. Go to GitHub: Settings → Secrets and variables → Actions
# 2. Delete old token
# 3. Add new token
# 4. Retry deployment (push to main again)
```

### Issue: Security Scan Shows Vulnerabilities

**Cause**: Trivy found known CVEs in dependencies

**Check Severity**:
```
High/Critical: Must fix before deploy
Medium: Review and fix if possible
Low: Can defer, low priority
```

**Fix**:
```bash
# 1. Update vulnerable package
pip install --upgrade vulnerable-package
npm install vulnerable-package@latest

# 2. Update requirements.txt or package.json
pip freeze > requirements.txt
npm install

# 3. Commit and push (CI will re-scan)
git add requirements.txt package.json
git commit -m "chore: update dependencies for security"
git push origin main
```

---

## 📈 Monitoring CI/CD

### View Pipeline Status
1. Go to your GitHub repository
2. Click "Actions" tab
3. See all workflow runs
4. Click any run to see details

### View Logs for Specific Jobs
1. Click on a workflow run
2. Click on specific job (test, build, deploy, etc.)
3. Expand steps to see detailed logs
4. Search for errors or warnings

### Check Deployment Status
1. **Frontend**: Go to https://vercel.com/dashboard (check deployments)
2. **Backend**: Go to https://railway.app (check latest deploy)
3. **Both**: Click "Actions" → latest deploy run → scroll to "Smoke tests"

---

## ⚡ Performance Tips

### Speed Up Tests
```bash
# Run tests in parallel (local)
pytest -n auto

# Run specific test only
pytest tests/test_anomaly.py -v

# Run frontend tests only (no backend)
cd frontend && npm test -- --run
```

### Speed Up Linting
```bash
# Only lint changed files
git diff --name-only origin/main | grep '.py$' | xargs flake8

# Only lint backend/frontend directories
flake8 backend/
cd frontend && npm run lint
```

### Cache Dependencies
CI/CD already caches:
- Python packages (pip cache)
- npm packages (node_modules cache)
- Docker layers

---

## 🎯 Best Practices

### ✅ DO
- Always write tests for new features
- Run tests locally before pushing
- Use meaningful commit messages
- Keep branches small (easier to review)
- Delete old branches after merge

### ❌ DON'T
- Force push to main (bypasses CI/CD)
- Commit large files (blocks build)
- Ignore failing tests in CI/CD
- Store secrets in code (use GitHub Secrets)
- Push broken code to main

---

## 📝 Example Workflow

### Complete developer workflow:

```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/add-new-api

# 2. Make changes
# ... edit files ...

# 3. Run tests locally
pytest tests/ -v
npm test

# 4. Run linting
black backend/
flake8 backend/
cd frontend && npm run lint

# 5. Commit changes
git commit -m "feat: add user profile API endpoint"

# 6. Push to GitHub
git push origin feature/add-new-api

# 7. Create Pull Request (on GitHub)
# → GitHub Actions runs automatically
# → See status checks in PR

# 8. Wait for approval & merge
# → Merged to develop
# → CI/CD builds Docker images (optional)

# 9. Later: Merge develop → main for production
# → CI/CD runs full pipeline
# → Auto-deploys to Vercel + Railway
# → System is live! 🚀
```

---

## 🔗 GitHub Actions Features Used

| Feature | Purpose |
|---------|---------|
| Checkout code | Gets your repository code |
| Setup Python/Node | Installs runtime environments |
| Cache dependencies | Speeds up subsequent runs |
| Docker Buildx | Builds multi-platform Docker images |
| Upload artifacts | Stores test results, coverage |
| Upload SARIF | GitHub Security tab integration |
| Conditional steps | Runs steps only on certain conditions |
| Environment variables | Secrets passed securely to jobs |

---

## 📋 Quick Command Reference

```bash
# Local test commands (before pushing)
pytest tests/ -v --cov              # Backend tests
npm test -- --run --coverage        # Frontend tests

# Local lint commands (before pushing)
flake8 backend --count
black backend --check
cd frontend && npm run lint

# View CI/CD status
git log --oneline -5                # See recent commits
git status                          # Check branch status

# After pushing
# Go to: https://github.com/YOUR_USERNAME/isro1/actions
# Click latest workflow run
# View test results and deployment logs
```

---

## 🎓 Learning Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Workflow Syntax**: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **Vercel Deployment**: https://vercel.com/docs
- **Railway Deployment**: https://docs.railway.app/

---

## ✅ Verification Checklist

Before first deployment:

- [ ] All tests pass locally
- [ ] Lint checks pass locally
- [ ] GitHub Secrets configured (VERCEL_TOKEN, RAILWAY_TOKEN)
- [ ] Vercel project created and linked
- [ ] Railway project created and linked
- [ ] Docker images build successfully
- [ ] .env not in git (verify with `git ls-files | grep .env`)
- [ ] README.md and docs updated
- [ ] Contributing guidelines documented

---

**Your CI/CD pipeline is production-ready and will automate all testing, building, and deployment!** 🚀

Next step: Push your code to GitHub and watch the magic happen in the Actions tab!
