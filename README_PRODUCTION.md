# AS³ - Autonomous Synthetic Space Scientist Platform

> Production-ready AI-powered autonomous space mission control and analysis system

[![CI/CD Pipeline](https://github.com/your-username/as3-platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-username/as3-platform/actions)
[![Frontend on Vercel](https://vercel.com/button)](https://as3-platform.vercel.app)
[![Backend on Railway](https://railway.app/button)](https://as3-api.railway.app)

## 🚀 Overview

AS³ is a comprehensive, production-grade platform for autonomous space mission analysis and control. It combines:

- **Real-time Data Processing**: Live spacecraft telemetry from NASA, ESA, and space agencies
- **Machine Learning**: Anomaly detection via Isolation Forest and statistical analysis
- **Multi-Agent AI System**: 7 specialized agents with autonomous decision-making (CrewAI)
- **Interactive Dashboard**: 3D orbital visualization, real-time charts, and mission control
- **Full Stack**: FastAPI, React 18, PostgreSQL, WebSockets, Docker, Kubernetes

## ✨ Features

### Phase 1: Backend Foundation (✅ Complete)
- FastAPI REST API with 10 route modules
- SQLAlchemy ORM with PostgreSQL
- JWT authentication and role-based access
- Comprehensive Health checks

### Phase 2-3: Real-time Web Platform (✅ Complete)
- React 18 frontend with Vite
- Three.js 3D orbital visualization
- Real-time WebSocket updates
- Responsive design with Tailwind CSS

### Phase 4-11: Advanced Features (✅ Complete)
- Machine Learning anomaly detection (Isolation Forest)
- Hypothesis generation with probability scoring
- 7-agent multi-agent orchestration system
- RAG-based knowledge base retrieval
- Reasoning pipeline for autonomous decisions
- Advanced analytics and mission planning
- Prometheus monitoring and Grafana dashboards
- Kubernetes production deployment
- CI/CD pipeline with GitHub Actions

## 🛠️ Tech Stack

**Backend:**
- FastAPI 0.104.1 - Modern async web framework
- SQLAlchemy 2.0.23 - SQL toolkit and ORM
- PostgreSQL - Relational database
- Scikit-learn - Machine learning
- LangChain + CrewAI - AI agents
- Pydantic - Data validation

**Frontend:**
- React 18.2.0 - UI library
- Vite 5.0 - Build tool
- Three.js 0.160.0 - 3D graphics
- Tailwind CSS 3.3.6 - Styling
- Axios - HTTP client
- Recharts - Charts and analytics

**DevOps:**
- Docker & Dockerfile - Containerization
- Kubernetes - Orchestration
- GitHub Actions - CI/CD
- Vercel - Frontend hosting
- Railway - Backend hosting

## 📦 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 16+
- Docker (optional)

### Local Development

1. **Clone and setup:**
```bash
git clone https://github.com/your-username/as3-platform.git
cd as3-platform

# Copy environment template
cp .env.example .env
# Edit .env with your actual API keys
```

2. **Backend Setup:**
```bash
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn backend.main:app --reload
# Backend runs on http://localhost:8000
```

3. **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

4. **Database Setup:**
```bash
# Using Docker Compose (recommended)
docker-compose up -d
# This starts PostgreSQL on localhost:5432
```

## 🚀 Deployment

### Frontend - Vercel

1. Connect your GitHub repo to Vercel
2. Set environment variables:
   - `VITE_API_URL`: `https://as3-api.railway.app`
   - `VITE_WS_URL`: `wss://as3-api.railway.app`
3. Auto-deploys on push to `main` branch

### Backend - Railway

1. Create Railway project and connect GitHub
2. Add PostgreSQL service
3. Set environment variables from GitHub Secrets
4. Deploy from `Dockerfile` in `docker/`

### Kubernetes Production

```bash
# Apply manifests
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods -n as3
kubectl logs deployment/as3-backend -n as3
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🧪 Testing

### Run Tests

```bash
# Backend tests
pytest tests/ -v --cov=backend --cov-report=html

# Frontend tests
cd frontend
npm test                    # Run tests in watch mode
npm run test:coverage       # Generate coverage report
npm run test:ui             # Interactive UI
```

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for more details.

## 📚 API Documentation

After starting backend, visit:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Key Endpoints

```
POST   /api/auth/register          - Register user
POST   /api/auth/login             - Login with credentials
POST   /as3/analysis/query         - Submit analysis query
GET    /as3/telemetry/status       - Get spacecraft telemetry
POST   /as3/anomaly/detect         - Run anomaly detection
GET    /as3/agents/status          - Check agent system status
WS     /ws/{room_id}               - WebSocket for real-time updates
```

See `backend/api/routes/` for all endpoints.

## 🔄 CI/CD Pipeline

Automated pipeline with:
- ✅ **Lint** - flake8, pylint, black, isort, ESLint
- ✅ **Test** - pytest, Vitest with coverage reports
- ✅ **Security** - Trivy vulnerability scanning
- ✅ **Build** - Docker images to GHCR
- ✅ **Deploy** - Vercel + Railway on main push

**Workflows trigger on:**
- Push to `main`, `develop`, `staging`
- Pull requests to any branch

See `.github/workflows/ci-cd.yml` for full pipeline.

## 🔐 Security

### Environment Variables

Never commit `.env` file! Use `.env.example` as template and manage secrets via:
- **Local dev**: `.env` file (in `.gitignore`)
- **GitHub Actions**: GitHub Secrets (Settings > Secrets and variables)
- **Vercel**: Project environment variables
- **Railway**: Project variables

Required Secrets for CI/CD:
- `OPENAI_API_KEY` - LLM API key
- `NASA_API_KEY` - NASA REST API key
- `VERCEL_TOKEN` - Vercel deployment
- `RAILWAY_TOKEN` - Railway deployment
- Other API keys as needed

### Security Headers

Production deployment includes:
- HTTPS/TLS encryption
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- CORS restrictions
- Rate limiting (100 req/min per IP)

## 📖 Development

### Branch Strategy

- **`main`** - Production deployments (protected)
  - Requires 2 PR approvals
  - All CI/CD checks must pass
  - Auto-deploys to Vercel + Railway

- **`develop`** - Integration branch
  - Base for feature branches
  - Staging deployments

- **Feature branches**
  - Pattern: `feature/short-description`
  - Create PR to `develop`
  - Merge to `main` after review

Example workflow:
```bash
git checkout -b feature/add-alerts develop
# ... make changes ...
git push origin feature/add-alerts
# Create PR: feature/add-alerts → develop
# After merge: develop → main (auto-deploy)
```

See [DEVELOPMENT.md](./DEVELOPMENT.md) for complete guide.

### Code Review Checklist

- [ ] Code follows project style
- [ ] Tests written and passing
- [ ] No console warnings
- [ ] No secrets in code
- [ ] Documentation updated
- [ ] Performance acceptable

## 📊 Monitoring & Observability

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Database connection
curl http://localhost:8000/health/db

# Agent system status
curl http://localhost:8000/as3/agents/status
```

### Metrics

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001

Default credentials: admin/admin

### Logs

```bash
# Backend logs
docker logs as3-backend

# Frontend logs (browser console)
Open DevTools > Console
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: your feature"`
4. Push branch: `git push origin feature/your-feature`
5. Open Pull Request

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed contribution guidelines.

## 📋 Project Structure

```
as3-platform/
├── backend/                 # FastAPI application
│   ├── main.py             # Entry point
│   ├── api/                # Route modules (10 modules)
│   ├── services/           # Business logic (7 agent system, ML)
│   ├── database/           # SQLAlchemy models
│   └── core/               # Security, config
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # 12+ React components
│   │   ├── pages/          # Page routes
│   │   ├── services/       # API clients
│   │   └── context/        # State management
│   └── public/             # Static assets
├── docker/                 # Dockerfiles
├── k8s/                    # Kubernetes manifests
├── .github/workflows/      # CI/CD pipeline
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 📄 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Branch strategy and contribution process
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing framework and best practices
- **[AS3_COMPLETE_SYSTEM.md](./AS3_COMPLETE_SYSTEM.md)** - Full system architecture

## 🆘 Troubleshooting

### Frontend not rendering

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection refused

```bash
# Ensure PostgreSQL is running
docker-compose up -d postgres

# Check database credentials in .env
# Default: DATABASE_URL=postgresql://as3user:as3password@localhost:5432/as3_db
```

### Tests failing

```bash
# Backend: Clear pytest cache
rm -rf .pytest_cache
pytest tests/ -v

# Frontend: Clear Vitest cache
cd frontend
npm test -- --clearCache
```

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: See `/docs` and `.md` files

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- NASA for space data APIs
- ESA/Copernicus for Earth observation
- NOAA for space weather data
- CrewAI for multi-agent framework
- React, FastAPI, and open-source communities

---

**Status**: ✅ Production Ready | Phase 12 - CI/CD & Deployment Complete

**Last Updated**: 2026-03-24

**Next Steps**:
- [ ] Create GitHub repository
- [ ] Add GitHub Secrets
- [ ] Deploy to Vercel
- [ ] Deploy to Railway
- [ ] Configure monitoring
