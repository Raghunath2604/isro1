# 🚀 AS³ Platform - Autonomous Synthetic Space Scientist

A production-ready, AI-powered autonomous space mission control system with real-time telemetry, ML-based anomaly detection, multi-agent orchestration, and advanced analytics.

**Status**: ✅ Production Ready | 🔧 Deployment Ready | 📦 ~15K LoC

## 🌟 Core Features

- ⚡ **Real-Time WebSocket Streaming** - Live spacecraft telemetry updates
- 🛰️ **3D Orbital Visualization** - Interactive Earth + satellite tracking (Three.js)
- 🤖 **7-Agent AI System** - Autonomous multi-agent orchestration (CrewAI)
- 🔍 **ML Anomaly Detection** - Isolation Forest ML model for satellite anomalies
- 🧠 **Hypothesis Generator** - AI-powered hypothesis generation with probability scoring
- 📊 **Telemetry Dashboard** - Real-time metrics, trends, and alerts
- 🎮 **Orbital Simulation** - Maneuver planning and trajectory calculations
- 📋 **Mission Planning** - Mission creation, tracking, and management
- 🎨 **Enterprise UI/UX** - 11 professional components, 20+ animations, WCAG 2.1 AA
- 🐳 **Docker + Kubernetes** - Production deployment ready

---

## 📋 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Docker & Docker Compose
- PostgreSQL 14+

### Local Development (One Command)

```bash
# Clone and enter directory
git clone https://github.com/YOUR_USERNAME/isro1.git
cd isro1

# Start everything with Docker Compose
docker-compose up -d

# Backend: http://localhost:8000 (API docs: /api/docs)
# Frontend: http://localhost:3000
# Database: postgres://localhost:5432
```

### Manual Setup

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev  # http://localhost:3000
```

---

## 🏗️ Architecture

### Backend Stack
- **Framework**: FastAPI (Python async)
- **Database**: PostgreSQL + SQLAlchemy ORM
- **ML**: Scikit-learn (Isolation Forest)
- **AI**: OpenAI API, CrewAI
- **Real-time**: WebSocket support
- **Auth**: JWT + role-based access

### Frontend Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + custom animations
- **3D**: Three.js orbital visualization
- **State**: Context API + hooks
- **Real-time**: WebSocket integration
- **Components**: 11 professional UI library

### Core Services
| Service | Purpose | Tools |
|---------|---------|-------|
| **Anomaly Detection** | ML-based satellite anomalies | Isolation Forest |
| **Hypothesis Generator** | Pattern-based hypotheses | CrewAI + probability scoring |
| **Multi-Agent System** | 7 specialized agents | CrewAI orchestration |
| **Telemetry Streaming** | Real-time spacecraft data | WebSocket |
| **Simulation Engine** | Orbital mechanics | NumPy calculations |
| **RAG Service** | Knowledge retrieval | LangChain embeddings |
| **Reasoning Service** | AI pipeline | OpenAI reasoning |

---

## 🎨 UI/UX System

### 11 Professional Components
- **Button** (5 variants, 3 sizes, loading states)
- **Input** (validation, icons, error states)
- **Card** (hover effects, gradients)
- **Badge** (4 variants, 3 sizes)
- **AnimatedCard** (hover scale, glow)
- **StatCard** (metrics, trends)
- **FeatureItem** (lists with icons)
- **ProgressRing** (circular progress)
- **LoadingSpinner** (3 sizes)
- **SkeletonLoader** (placeholder states)
- **Toast** (notifications, 4 types)

### Design Features
- **20+ CSS Animations** - fadeInUp, slideInLeft, glowPulse, shimmer, ripple
- **Glass Morphism** - Frosted glass effects with backdrop blur
- **Responsive** - Mobile-first, 3 breakpoints
- **Accessible** - WCAG 2.1 AA, keyboard navigation, reduced motion
- **Professional Colors** - Cyan, Blue, Purple, Green, Orange, Yellow, Red

📖 Full documentation: `frontend/UI_COMPONENT_LIBRARY.md`

---

## 🔌 API Endpoints (30+)

### Authentication (3)
```
POST   /auth/register           - User registration
POST   /auth/login              - User login (returns JWT)
GET    /auth/me                 - Get current user
```

### Anomaly Detection & Analysis (6)
```
POST   /as3/anomaly/detect      - Detect anomalies (ML)
GET    /as3/anomaly/history     - Anomaly history
POST   /as3/hypothesis/generate - Generate hypotheses
POST   /as3/agents/workflow/execute - Run autonomous workflow
GET    /as3/agents/status       - Agent status
GET    /as3/complete-status     - System health
```

### Data Management (8)
```
GET    /api/telemetry           - List telemetry records
POST   /api/telemetry           - Add telemetry
GET    /api/missions            - List missions
POST   /api/missions            - Create mission
GET    /api/analysis            - Get analysis results
POST   /api/alerts              - Create alerts
```

### WebSocket (Real-time)
```
WS     /ws/{room}               - Real-time updates
```

**Full API Docs**: http://localhost:8000/api/docs (Swagger UI)

---

## 🧪 Testing

### Run Tests
```bash
# Backend (pytest)
cd backend
python -m pytest tests/ -v --cov

# Frontend (Vitest)
cd frontend
npm test
npm run test:coverage
```

### Coverage Targets
- Backend: >80% coverage
- Frontend: >70% coverage
- All critical paths tested

---

## 📦 Project Structure

```
isro1/
├── backend/                      # FastAPI backend (Python)
│   ├── main.py                   # App entry point
│   ├── config.py                 # Configuration
│   ├── core/                     # Core modules (security, logging)
│   ├── api/routes/               # 10 API route modules
│   ├── services/                 # 7 business logic services
│   ├── database/                 # Models, schema, session
│   ├── models/                   # Pydantic schemas
│   └── tests/                    # pytest tests
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── App.jsx               # Main component
│   │   ├── components/           # 12+ UI components
│   │   ├── pages/                # Route pages
│   │   ├── services/             # API & WebSocket
│   │   ├── hooks/                # Custom React hooks
│   │   └── __tests__/            # Vitest tests
│   ├── public/                   # Static assets
│   └── package.json
│
├── docker/                       # Docker configs
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── k8s/                          # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   └── postgres.yaml
│
├── .github/
│   ├── workflows/ci-cd.yml       # GitHub Actions
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
│
├── README.md                     # You are here
├── DEVELOPMENT.md                # Git Flow & branching
├── DEPLOYMENT_GUIDE.md           # Deployment instructions
├── GITHUB_DEPLOYMENT_GUIDE.md    # GitHub setup
├── TESTING_GUIDE.md              # Testing docs
└── UI_UX_EXCELLENCE_SUMMARY.md   # Design system
```

---

## 🚀 Deployment

### Quick YouTube-Style Path (90 minutes)

1. **Create GitHub Repository** (15 min)
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/isro1.git
   git push -u origin main
   ```

2. **Configure GitHub Secrets** (10 min)
   - `OPENAI_API_KEY` - OpenAI API key
   - `NASA_API_KEY` - NASA API key
   - `VERCEL_TOKEN` - Vercel token
   - `RAILWAY_API_TOKEN` - Railway token

3. **Deploy Frontend to Vercel** (20 min)
   ```bash
   npm i -g vercel
   vercel deploy --prod
   ```

4. **Deploy Backend to Railway** (20 min)
   - Connect GitHub repo at railway.app
   - Add PostgreSQL plugin
   - Set environment variables

5. **Verify & Test** (15 min)
   - Test all endpoints
   - Check WebSocket connection
   - Verify database connectivity

📖 **Detailed guide**: `GITHUB_DEPLOYMENT_GUIDE.md`

---

## 🔒 Security Features

- ✅ **JWT Authentication** with role-based access control
- ✅ **Security Headers** (HSTS, CSP, X-Frame-Options)
- ✅ **HTTPS Enforcement** in production
- ✅ **Input Validation** on all endpoints
- ✅ **Rate Limiting** (100 req/min per IP)
- ✅ **CORS** configured for production
- ✅ **Secret Management** via GitHub Secrets
- ✅ **SQL Injection Prevention** via SQLAlchemy ORM

### Environment Variables
```bash
# .env (local only, NEVER COMMIT)
OPENAI_API_KEY=sk-...
NASA_API_KEY=DEMO_KEY
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=your-secret-key
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Overview & quick start (you are here) |
| **DEVELOPMENT.md** | Git Flow, branching, PR process |
| **TESTING_GUIDE.md** | Running tests, coverage, best practices |
| **DEPLOYMENT_GUIDE.md** | Docker & traditional deployment |
| **GITHUB_DEPLOYMENT_GUIDE.md** | GitHub + Vercel + Railway setup |
| **UI_UX_EXCELLENCE_SUMMARY.md** | Design system, animations, components |
| **frontend/UI_COMPONENT_LIBRARY.md** | Component API reference |

---

## 🧪 Available Commands

### Backend
```bash
# Development
uvicorn main:app --reload

# Production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app

# Testing
pytest tests/ -v --cov

# Linting
flake8 . --max-line-length=120
black . --line-length=120
```

### Frontend
```bash
# Development
npm run dev

# Production build
npm run build  # Output: dist/

# Testing
npm test
npm run test:coverage
```

---

## 📊 Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| First Paint | <2s | ✅ |
| API Response (p95) | <200ms | ✅ |
| WebSocket Latency | <50ms | ✅ |
| Bundle Size | <500KB gzipped | ✅ |
| Lighthouse | >85 | ✅ |
| Concurrent Users | 10+ | ✅ |

---

## 🤝 Contributing

1. **Clone repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/isro1.git
   cd isro1
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and test**
   ```bash
   npm test  # frontend
   pytest    # backend
   ```

4. **Commit and push**
   ```bash
   git commit -m "feat: your description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - GitHub Actions runs automatically
   - 2 code reviews required before merge

📖 See `DEVELOPMENT.md` for detailed guidelines

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection error
```bash
# Check database
docker ps | grep postgres

# Reset database
python -c "from database.models import Base; Base.metadata.create_all()"
```

### WebSocket not connecting
```bash
# Verify backend
curl http://localhost:8000/api/health

# Check environment variables
cat frontend/.env
```

---

## 📄 License

MIT License - See LICENSE file

---

## 👨‍💻 Technology Stack

**Backend**
- FastAPI, Pydantic, SQLAlchemy
- PostgreSQL, CrewAI, LangChain
- Scikit-learn, OpenAI API

**Frontend**
- React 18, Vite, Tailwind CSS
- Three.js, Axios, Context API

**DevOps**
- Docker, Kubernetes, GitHub Actions
- Vercel, Railway, PostgreSQL

---

## 🌟 What's Next?

**Ready to deploy?** → `GITHUB_DEPLOYMENT_GUIDE.md`

**Want to contribute?** → `DEVELOPMENT.md`

**Need component reference?** → `frontend/UI_COMPONENT_LIBRARY.md`

**Learn the design system?** → `UI_UX_EXCELLENCE_SUMMARY.md`

---

**AS³ Platform v3.0.0** | Autonomous Space Science | Production Ready 🛰️
