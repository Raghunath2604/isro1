# Development Guide

This document outlines the development workflow, branch strategy, and contribution process for the AS³ Platform.

## 🌳 Branch Strategy (Git Flow)

### Main Branches

| Branch | Purpose | Protection | Auto-Deploy |
|--------|---------|-----------|------------|
| **main** | Production releases | ✅ Yes (protected) | ✅ Vercel + Railway |
| **develop** | Integration & staging | ✅ Yes (soft) | ❌ Manual |
| **staging** | Pre-production testing | ✅ Yes (soft) | ❌ Manual |

### Branch Naming

Follow these patterns for consistency:

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/*` | `feature/add-anomaly-alerts` |
| Bug Fix | `bugfix/*` | `bugfix/fix-websocket-timeout` |
| Hotfix | `hotfix/*` | `hotfix/db-connection-critical` |
| Documentation | `docs/*` | `docs/update-api-guide` |
| Refactor | `refactor/*` | `refactor/optimize-3d-render` |
| Release | `release/*` | `release/v2.1.0` |

## 🔀 Git Workflow

### 1. Create Feature Branch

```bash
# Update develop first
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes

```bash
# Create commits with clear messages
git add .
git commit -m "feat: add anomaly alert notifications"

# Multiple commits for logical changes
git commit -m "chore: update dependencies"
git commit -m "feat: implement alert priority levels"
git commit -m "test: add alert tests"
```

### 3. Push to Remote

```bash
git push origin feature/your-feature-name
```

### 4. Create Pull Request

Go to GitHub and create PR with:
- **Base branch**: `develop` (or `main` for hotfixes)
- **Compare branch**: your feature branch
- **Title**: Brief, descriptive (examples below)
- **Description**: Use PR template from `.github/PULL_REQUEST_TEMPLATE.md`

**Good PR titles:**
- `feat: add real-time alert system`
- `fix: resolve WebSocket timeout issue`
- `docs: add API authentication guide`
- `refactor: optimize database queries`

### 5. Code Review & Feedback

- Request reviewers from `@platform-team`
- Respond to review comments
- Make requested changes in new commit:

```bash
git add .
git commit -m "review: address feedback on alert system"
git push origin feature/your-feature-name
```

### 6. Merge to Develop

After 2 approvals + CI/CD passing:
- Squash commits (optional): `git rebase -i develop`
- Merge: Create merge commit, don't squash (keep history)

```bash
# After merge on GitHub
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

### 7. Promote to Main

When ready for production:

```bash
# Create release PR: develop → main
git checkout -b release/v2.1.0 develop
# Update version in package.json and requirements.txt
git commit -m "chore: bump version to 2.1.0"
git push origin release/v2.1.0

# Create PR to main, merge with rebase (clean history)
# GitHub Actions auto-deploys to Vercel + Railway
```

## ✅ Code Quality Standards

### Pre-commit Checklist

Before pushing, ensure:

- [ ] Code compiles/runs without errors
- [ ] Linting passes (`npm run lint`, `flake8`)
- [ ] Tests pass locally (`npm test`, `pytest`)
- [ ] No console warnings or deprecations
- [ ] No secrets/API keys in code
- [ ] Comments added for complex logic
- [ ] Documentation updated

### Testing Requirements

| Component | Test Type | Coverage Target |
|-----------|-----------|-----------------|
| Backend | Unit + Integration | >80% |
| Frontend | Unit + Component | >70% |
| API Routes | Integration | 100% |
| Services | Unit | >85% |

**Run tests before push:**

```bash
# Backend
pytest tests/ -v --cov=backend --cov-report=term-missing

# Frontend
cd frontend
npm test -- --coverage
```

### Code Style

**Backend Python:**
```bash
black backend --line-length=100
isort backend
flake8 backend --max-line-length=100
```

**Frontend JavaScript:**
```bash
cd frontend
npx eslint src --fix
npx prettier --write src/
```

## 🚀 PR Review Process

### For Reviewers

When reviewing PRs, check:

1. **Functionality** ✅
   - Changes implement the requirement
   - No regressions in existing features
   - Tests prove the fix/feature works

2. **Code Quality** ✅
   - Follows project conventions
   - No code duplication
   - Proper error handling
   - Security best practices followed

3. **Testing** ✅
   - New tests written for new code
   - All tests pass
   - Adequate coverage maintained

4. **Documentation** ✅
   - README updated if needed
   - API docs updated
   - Code comments clear
   - Commit messages descriptive

5. **Security** ✅
   - No secrets leaked
   - Input validation present
   - OWASP guidelines followed
   - Dependencies updated if security issues

**Approval:** 2 approvals required for `main` branch

### For PR Authors

Respond to feedback professionally:

- ✅ Implement requested changes
- ✅ Reply with "Done" or link to new commit
- ✅ Request re-review after changes
- ✅ Ask clarifying questions if needed
- ❌ Don't force-push without explanation

## 📦 Deployment Process

### Staging Deploy (Manual)

```bash
# Deploy develop to staging environment
git checkout develop
git pull origin develop

# Run tests locally first
pytest tests/ -v
cd frontend && npm test

# Create release candidate branch
git checkout -b release/staging develop

# Push and create PR to staging branch
git push origin release/staging

# After merge to staging, deploy runs automatically
```

### Production Deploy (Automatic)

```bash
# When PR merged to main:
# 1. GitHub Actions runs full CI/CD pipeline
# 2. ✅ All checks pass → auto-deploys
# 3. Frontend→ Vercel auto updates
# 4. Backend→ Railway auto updates
# 5. Smoke tests run
# 6. Slack notification sent

# To rollback (emergency):
git revert HEAD --no-edit
git push origin main
# This triggers automatic rollback deployment
```

## 🆘 Common Scenarios

### Scenario 1: Found bug in develop

```bash
# Create hotfix from develop
git checkout -b bugfix/critical-fix develop
# ... fix the bug ...
git push origin bugfix/critical-fix
# Create PR to develop
# After merge, manually promote to main
```

### Scenario 2: Need immediate production fix

```bash
# Create hotfix from main
git checkout -b hotfix/critical-issue main
# ... fix the issue ...
git push origin hotfix/critical-issue
# Create PR directly to main (bypasses develop)
# Merge and auto-deploy (emergency only)
```

### Scenario 3: Merge conflict

```bash
# Pull latest from target branch
git fetch origin
git rebase origin/develop

# Resolve conflicts in editor
# Mark as resolved
git add .
git rebase --continue

# Push resolved branch
git push origin feature/your-feature --force-with-lease
```

### Scenario 4: Undo last commit

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard commit and changes
git reset --hard HEAD~1

# Already pushed? Revert instead
git revert HEAD
git push origin feature/your-feature
```

## 🔧 Setup Development Environment

### First-time Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/as3-platform.git
cd as3-platform

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Setup frontend
cd frontend
npm install
cd ..

# 5. Configure environment
cp .env.example .env
# Edit .env with your keys

# 6. Start services
docker-compose up -d  # PostgreSQL
python -m uvicorn backend.main:app --reload  # Terminal 1
cd frontend && npm run dev  # Terminal 2
```

### Daily Development

```bash
# Start of day
git checkout develop
git pull origin develop

# Work on feature
git checkout -b feature/your-feature
# ... edit files ...

# Before committing
npm run lint
pytest tests/

# Commit and push as described above
```

## 📚 Project Structure for Developers

```
as3-platform/
├── backend/
│   ├── main.py                      # FastAPI app entry
│   ├── config.py                    # Settings/env config
│   ├── api/
│   │   ├── routes/                  # 10 API route modules
│   │   │   ├── auth.py              # JWT auth endpoints
│   │   │   ├── analysis.py          # Analysis endpoints
│   │   │   ├── telemetry.py         # Live telemetry
│   │   │   └── ...
│   ├── services/                    # Business logic
│   │   ├── anomaly_detection_service.py
│   │   ├── hypothesis_generator.py
│   │   ├── multi_agent_system.py
│   │   └── ...
│   ├── database/
│   │   └── models.py                # SQLAlchemy models
│   ├── core/
│   │   ├── security.py              # JWT, auth middleware
│   │   └── websocket_manager.py
│   └── tests/
│       ├── test_auth.py
│       ├── test_health.py
│       └── ...
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Visualization3D.jsx
│   │   │   ├── TelemetryPanel.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Page routes
│   │   ├── services/                # API clients
│   │   ├── context/                 # Context API state
│   │   ├── hooks/                   # Custom hooks
│   │   └── __tests__/               # Component tests
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # GitHub Actions
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── .dockerignore
├── k8s/
│   └── deployment.yaml              # Kubernetes manifests
├── tests/
│   └── test_api.py                  # Integration tests
├── requirements.txt                 # Python deps
├── README.md                        # Docs
└── .env.example                     # Config template
```

## 🐛 Debugging Tips

### Backend Debugging

```python
# Add breakpoints
import pdb; pdb.set_trace()

# Or use breakpoint() in Python 3.7+
breakpoint()

# Then navigate with: n(ext), s(tep), c(ontinue), p(rint)
```

### Frontend Debugging

```jsx
// Console.log
console.log('value:', value)

// Debugger statement
debugger

// Browser DevTools
Open DevTools (F12) → Sources tab
```

### Database Debugging

```bash
# Connect to PostgreSQL
psql -U as3user -d as3_db -h localhost

# List tables
\dt

# Check query
SELECT * FROM user WHERE id = 1;
```

## 📞 Getting Help

- **Questions**: Discussions tab on GitHub
- **Bugs**: Open an Issue with reproduction steps
- **Features**: Discussions or Issues with `[FEATURE]` label
- **Docs**: See README, DEPLOYMENT_GUIDE, etc.

## ✨ Recognition

Contributors are recognized in the [CONTRIBUTORS.md](./CONTRIBUTORS.md) file. Thank you for improving AS³!

---

**Last Updated**: 2026-03-24
**Status**: ✅ Active Development
