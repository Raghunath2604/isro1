# ⚡ CI/CD Quick Reference

## 🚀 5-Stage Pipeline Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                          GITHUB PUSH                                 │
│                  (main, develop, or pull_request)                    │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Pull Request        Any Branch          Main Branch
        │                  │                  │
        ▼                  ▼                  ▼
   ┌────────┐          ┌────────┐        ┌────────┐
   │  TEST  │          │  LINT  │        │SECURITY│
   │ pytest │          │flake8  │        │ Trivy  │
   │ vitest │          │eslint  │        │ Scan   │
   └─┬──────┘          └─┬──────┘        └─┬──────┘
     │ 2m                │ 1m                │ 1m
     │ (parallel)        │ (parallel)        │ (parallel)
     └────────┬──────────┴────────┬─────────┘
              │                   │
              ▼                   ▼
         All Passed?         Results
         ├─ ✅ YES          ├─ ✅ PASS: continue
         └─ ❌ NO           └─ ❌ FAIL: reject
              │                   │
              ▼                   ▼
    ┌─────────────────┐  ┌──────────────────────┐
    │ BUILD (Optional)│  │ DEPLOY (if main push)│
    │                 │  │                      │
    │ Docker Images   │  │ ✓ Vercel (frontend) │
    │ ├─ Backend      │  │ ✓ Railway (backend) │
    │ ├─ Frontend     │  │ ✓ Smoke tests       │
    │ └─ Push to GHCR │  │ ✓ Notifications     │
    │                 │  │                      │
    │ 3-5m            │  │ 5-10m                │
    └────────┬────────┘  └──────────┬───────────┘
             │                      │
             │                      ▼
             │            ┌──────────────────┐
             │            │  🎉 LIVE! 🎉    │
             │            │                  │
             │            │ https://vercel   │
             │            │ https://railway  │
             │            └──────────────────┘
             │
             └─→ Docker images available
                 at GitHub Container Registry
```

---

## 📊 Job Status Matrix

| Job | PR | develop | main | Needs | Duration |
|-----|----|---------|----|---------|----------|
| **TEST** | ✅ Run | ✅ Run | ✅ Run | - | 2-3m |
| **LINT** | ✅ Run | ✅ Run | ✅ Run | - | 1-2m |
| **SECURITY** | ✅ Run | ✅ Run | ✅ Run | - | 1-2m |
| **BUILD** | ❌ Skip | ✅ Run | ✅ Run | TEST ✅ | 3-5m |
| **DEPLOY** | ❌ Skip | ❌ Skip | ✅ Run | ALL ✅ | 5-10m |

---

## 🔑 Required GitHub Secrets

### Add these in: Settings → Secrets and variables → Actions

```
Deployment Secrets (Required for Step 5):
├─ VERCEL_TOKEN           ← From vercel.com/account/tokens
├─ RAILWAY_TOKEN          ← From railway.app/account/tokens
├─ VERCEL_PROJECT_ID      ← Optional
└─ VERCEL_ORG_ID          ← Optional

Runtime Secrets (Required for app to run):
├─ OPENAI_API_KEY         ← From openai.com
├─ NASA_API_KEY           ← From api.nasa.gov
├─ SPACETRACK_USERNAME    ← From space-track.org
└─ SPACETRACK_PASSWORD    ← From space-track.org
```

---

## 🎯 Typical Developer Workflow

```bash
1. Create branch              git checkout -b feature/xyz
   └─ Branch from develop

2. Make changes               # Edit files
   └─ Add features/fixes

3. Commit locally             git commit -m "feat: description"
   ├─ Run: pytest tests/ -v
   ├─ Run: npm test
   └─ Check: flake8 backend/

4. Push to GitHub             git push origin feature/xyz
   └─ GitHub Actions starts

5. Wait for CI/CD             GitHub Actions runs:
   ├─ ✅ TEST (2-3 min)
   ├─ ✅ LINT (1-2 min)
   ├─ ✅ SECURITY (1-2 min)
   └─ Status shows: ✅ All checks passed

6. Create Pull Request        On GitHub: Create PR → develop
   ├─ Add description
   ├─ Link related issues
   └─ Request reviewers

7. Code review                Team reviews code
   └─ If changes needed: commit & push again

8. Merge to develop           GitHub: Merge PR → develop
   └─ GitHub Actions runs: TEST, LINT, SECURITY, BUILD
      └─ Docker images created (for deployment)

9. Eventually: Release        Create release branch
   ├─ Bump version
   ├─ Update CHANGELOG
   └─ Merge to main

10. Main push triggers         GitHub Actions runs: ALL JOBS
    ├─ ✅ TEST
    ├─ ✅ LINT
    ├─ ✅ SECURITY
    ├─ ✅ BUILD
    └─ ✅ DEPLOY → 🚀 LIVE!
```

---

## 🚨 Common Failures & Fixes

### ❌ TEST FAILED
```
Cause: Test suite failing
Fix:
  1. Look at error in GitHub Actions log
  2. Run locally: pytest tests/ -v
  3. Fix the issue
  4. Commit and push again
```

### ❌ LINT FAILED
```
Cause: Code style issues
Fix:
  1. Run locally: flake8 backend/
  2. Run: black backend/ --fix
  3. Commit and push
```

### ❌ SECURITY FAILED
```
Cause: Vulnerable dependencies detected
Fix:
  1. Check SARIF report in GitHub Security
  2. Update vulnerable packages
  3. Run: pip install --upgrade package
  4. Commit requirements.txt
  5. Push again
```

### ❌ BUILD FAILED
```
Cause: Docker image won't build
Fix:
  1. Check logs for specific error
  2. Verify Dockerfile.backend/frontend exist
  3. Test locally: docker build -f docker/Dockerfile.backend .
  4. Fix Dockerfile or dependencies
  5. Push again
```

### ❌ DEPLOY FAILED
```
Cause: Missing secrets or service issues
Fix:
  1. Check Vercel/Railway account
  2. Verify VERCEL_TOKEN and RAILWAY_TOKEN in GitHub Secrets
  3. Tokens expired? Regenerate them
  4. Check Vercel/Railway project settings
  5. Manually deploy if needed (sign into Vercel/Railway)
```

---

## ✅ Verification Before First Push

```bash
# Before pushing to GitHub:

# 1. Run tests locally
pytest tests/ -v --cov

# 2. Run frontend tests
npm test -- --run --coverage

# 3. Lint backend
flake8 backend --count

# 4. Lint frontend
cd frontend && npm run lint

# 5. Check .env not in git
git ls-files | grep .env

# 6. Check uncommitted changes
git status

# 7. Verify Python version (3.11)
python --version

# 8. Verify Node version (18+)
node --version

# If all ✅, push!
git push origin main
```

---

## 📈 Monitor CI/CD Status

### During Workflow
1. Go to: **GitHub → Actions tab**
2. Click on latest workflow run
3. See each job status in real-time
4. Click job to see detailed logs

### After Deployment
1. Check frontend: https://your-vercel-domain.vercel.app
2. Check backend: https://your-railway-domain.railway.app
3. Check API docs: https://your-railway-domain.railway.app/api/docs
4. Test WebSocket: wscat -c wss://your-railway-domain.railway.app/ws/telemetry

---

## 🎓 Understanding Job Order

```
┌─ TEST (always runs)
│
├─ LINT (always runs, parallel with TEST)
│
├─ SECURITY (always runs, parallel with TEST/LINT)
│
├─ BUILD (requires: TEST ✅, runs on main/develop push)
│
└─ DEPLOY (requires: TEST ✅, LINT ✅, SECURITY ✅, BUILD ✅)
            (only on: main branch push)
            (skips on: pull_request, develop, other branches)
```

Key: Each job waits for its dependencies
Result: Can't deploy if tests/lint/security fail

---

## ⏱️ Total Pipeline Time

```
PR Review Only:
├─ TEST: 2-3 min
├─ LINT: 1-2 min (parallel)
├─ SECURITY: 1-2 min (parallel)
└─ Total: ~3-5 minutes

Full Deployment (main push):
├─ TEST: 2-3 min
├─ LINT: 1-2 min (parallel)
├─ SECURITY: 1-2 min (parallel)
├─ BUILD: 3-5 min (depends on TEST)
├─ DEPLOY: 5-10 min (depends on all)
└─ Total: ~15-25 minutes

Typical Scenario:
  Push → 3 min (all checks) → Deploy (if main) → 5 min → LIVE ✅
```

---

## 🔗 Useful Links

After pushing to GitHub:

| Resource | Link |
|----------|------|
| **GitHub Actions Runs** | https://github.com/YOUR_USERNAME/isro1/actions |
| **GitHub Secrets** | https://github.com/YOUR_USERNAME/isro1/settings/secrets/actions |
| **Branch Protection** | https://github.com/YOUR_USERNAME/isro1/settings/branches |
| **Vercel Deployments** | https://vercel.com/dashboard/isro1 |
| **Railway Deployments** | https://railway.app/project/YOUR_PROJECT |
| **Codecov Coverage** | https://codecov.io/github/YOUR_USERNAME/isro1 |

---

## 💡 Pro Tips

✅ **Enable branch protection** on main:
- Require PR reviews before merge
- Require all checks to pass
- Require branches up to date
- Dismiss stale reviews on new commits

✅ **Auto-merge PRs** after CI/CD passes:
- Settings → General → Pull Requests
- Enable "Auto-merge"
- Squash commits option available

✅ **Use PR templates** for consistency:
- Already configured in `.github/PULL_REQUEST_TEMPLATE.md`
- Auto-fills PR description

✅ **Required status checks**:
- Push to main only after all ✅
- CI/CD will auto-deploy on main push

---

## 📞 Troubleshooting Help

**Where to check for errors:**
1. GitHub Actions → Click workflow run
2. Click failing job (TEST, BUILD, DEPLOY, etc.)
3. Expand step to see full log
4. Search for error message
5. Reference this guide for common fixes

**Getting more help:**
- GitHub Actions Docs: https://docs.github.com/en/actions
- Workflow syntax: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- See: `CI_CD_GUIDE.md` for detailed troubleshooting

---

**Your CI/CD pipeline is automated, scalable, and production-ready!** 🚀
