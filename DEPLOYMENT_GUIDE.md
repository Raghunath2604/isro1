# AS3 Platform - Complete Deployment Guide

## 🚀 Quick Start (Choose One)

### Option 1: Single Command (Docker Compose)
```bash
docker-compose up -d
# Access: http://localhost:3000
```

### Option 2: Kubernetes (Production)
```bash
kubectl apply -f k8s/deployment.yaml
# Check status: kubectl get pods -n as3
```

### Option 3: Development (Local)
```bash
# Terminal 1 - Backend
source venv/bin/activate
uvicorn backend.main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 📋 Prerequisites

### System Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 20GB for data
- **OS**: Linux, macOS, or Windows (WSL2)

### Software
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)
- kubectl (for K8s deployment)
- PostgreSQL 16 client tools (optional)

### Accounts/Keys Needed
- OpenAI API key (free tier available)
- NASA API key (free at api.nasa.gov)
- GitHub account (for CI/CD)

---

## 🐳 Docker Compose Deployment

### 1. Setup

```bash
# Clone/navigate to project
cd as3-platform

# Create environment file
cp .env.example .env

# Edit with your keys
nano .env
```

### 2. Start Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check status
docker-compose ps
```

### 3. Access

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/api/docs
- **Database**: postgres://as3user:as3password@localhost:5432/as3_db

### 4. Stop Services

```bash
docker-compose down

# Remove volumes (data)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

---

## ☸️ Kubernetes Deployment

### 1. Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install helm (optional)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify cluster access
kubectl cluster-info
kubectl get nodes
```

### 2. Prepare Images

```bash
# Build backend image
docker build -f docker/Dockerfile.backend -t as3-backend:v2.0.0 .
docker tag as3-backend:v2.0.0 yourusername/as3-backend:v2.0.0

# Build frontend image
docker build -f docker/Dockerfile.frontend -t as3-frontend:v2.0.0 ./frontend
docker tag as3-frontend:v2.0.0 yourusername/as3-frontend:v2.0.0

# Push to registry
docker push yourusername/as3-backend:v2.0.0
docker push yourusername/as3-frontend:v2.0.0

# Update image names in k8s/deployment.yaml
sed -i 's|yourusername|YOUR_REGISTRY_USERNAME|g' k8s/deployment.yaml
```

### 3. Deploy

```bash
# Create namespace
kubectl create namespace as3

# Apply manifests
kubectl apply -f k8s/deployment.yaml

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=as3-backend -n as3 --timeout=60s

# Check status
kubectl get all -n as3
```

### 4. Configure Ingress

```bash
# Install nginx-ingress (if not present)
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace

# Install cert-manager for SSL
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --set installCRDs=true

# Update k8s/deployment.yaml with your domain
sed -i 's|as3-platform.example.com|YOUR_DOMAIN|g' k8s/deployment.yaml

# Apply ingress
kubectl apply -f k8s/deployment.yaml
```

### 5. Access

```bash
# Get ingress IP
kubectl get ingress -n as3

# Add to /etc/hosts (local testing)
echo "YOUR_INGRESS_IP as3-platform.example.com api.as3-platform.example.com" >> /etc/hosts

# Access
open https://as3-platform.example.com
```

---

## 🔧 Environment Configuration

### .env Template

```env
# ==================
# API Configuration
# ==================
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False  # Set to True for development

# ==================
# LLM Configuration
# ==================
OPENAI_API_KEY=sk-your-api-key-here
LLM_MODEL=gpt-4

# ==================
# External APIs
# ==================
NASA_API_KEY=your-nasa-api-key
ESA_API_KEY=your-esa-api-key

# ==================
# Database
# ==================
DATABASE_URL=postgresql://as3user:as3password@localhost:5432/as3_db
DATABASE_POOL_SIZE=20
DATABASE_POOL_RECYCLE=3600

# ==================
# Security
# ==================
SECRET_KEY=change-this-to-a-random-secure-string-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# ==================
# RAG & Embeddings
# ==================
RAG_VECTOR_DB=chroma
RAG_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# ==================
# Redis (optional)
# ==================
REDIS_URL=redis://localhost:6379/0

# ==================
# Logging
# ==================
LOG_LEVEL=INFO
LOG_FILE=logs/as3.log
LOG_FORMAT=json

# ==================
# Frontend
# ==================
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_API_TIMEOUT=30000

# ==================
# Monitoring
# ==================
ENABLE_PROMETHEUS=True
PROMETHEUS_PORT=9090

# ==================
# Email (optional)
# ==================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 🧪 Testing & Validation

### 1. Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000

# API Documentation
open http://localhost:8000/api/docs
```

### 2. Run Tests

```bash
# All tests
pytest tests/ -v

# Specific test file
pytest tests/test_api.py -v

# With coverage
pytest tests/ --cov=backend --cov-report=html

# Frontend tests
cd frontend && npm test
```

### 3. Load Testing

```bash
# Install tools
pip install locust
npm install -g artillery

# Run load test
locust -f tests/load_test.py

# Or with artillery
artillery run tests/artillery-config.yml
```

---

## 📊 Database Setup

### Automated (Recommended)

```bash
# Migrations run automatically on startup
# Database tables created from models.py
python -m backend.database.init_db
```

### Manual Setup

```bash
# Connect to PostgreSQL
psql postgresql://as3user:as3password@localhost/as3_db

# Create tables
\i backend/database/schema.sql

# Load sample data
\i backend/database/seed_data.sql

# Verify
\dt  # List all tables
```

### Backup & Restore

```bash
# Backup
pg_dump postgresql://as3user:as3password@localhost/as3_db > backup.sql

# Restore
psql postgresql://as3user:as3password@localhost/as3_db < backup.sql
```

---

## 🔐 Security Hardening

### Production Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT SECRET_KEY
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
- [ ] Enable HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up API authentication
- [ ] Configure CSRF protection
- [ ] Enable SQL injection prevention (using ORM)
- [ ] Set up security headers
- [ ] Enable audit logging
- [ ] Configure backups
- [ ] Set up monitoring/alerting

### Security Headers

```nginx
# Add to nginx config
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "no-referrer";
add_header Content-Security-Policy "default-src 'self'";
```

---

## 📈 Monitoring & Logs

### View Logs

```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# Kubernetes
kubectl logs -n as3 -f deployment/as3-backend
kubectl logs -n as3 -f deployment/as3-frontend

# Direct files
tail -f logs/as3.log
```

### Prometheus Metrics

```bash
# Access Prometheus
open http://localhost:9090

# Query metrics
- up{job="as3-backend"} == 1  # Service health
- http_requests_total  # Request count
- http_request_duration_seconds  # Latency
```

### Grafana Dashboards

```bash
# Access Grafana
open http://localhost:3000/grafana
# Default: admin/admin

# Create dashboards for:
# - API response times
# - Database queries
# - WebSocket connections
# - System resources
```

---

## 🚨 Troubleshooting

### Backend Issues

```bash
# Port already in use
lsof -i :8000
kill -9 PID

# Database connection error
psql postgresql://as3user:as3password@localhost/as3_db

# Missing dependencies
pip install -r requirements.txt

# Import errors
export PYTHONPATH="${PYTHONPATH}:/path/to/project"
```

### Frontend Issues

```bash
# Port already in use
lsof -i :3000
kill -9 PID

# Module not found
rm -rf node_modules package-lock.json
npm install

# CORS errors
Check backend CORS config
```

### WebSocket Issues

```bash
# Connection refused
- Verify backend is running
- Check firewall rules
- Verify WS_URL in frontend .env

# Connection timeout
- Increase proxy timeout in nginx
- Check network latency
```

### Database Issues

```bash
# Can't connect
psql -h localhost -U as3user -d as3_db

# Connection pool exhausted
Increase DATABASE_POOL_SIZE in .env

# Slow queries
Enable query logging
ANALYZE database performance
Create indexes
```

---

## 🔄 Continuous Deployment

### GitHub Actions

```bash
# Trigger workflow
git push origin main

# View workflows
open https://github.com/yourusername/as3-platform/actions

# Check logs
Click on workflow run → View job logs
```

### Manual Deployment

```bash
# Build & push images
docker-compose build
docker-compose push

# Update K8s
kubectl set image deployment/as3-backend \
  app=yourusername/as3-backend:latest -n as3

kubectl rollout status deployment/as3-backend -n as3
```

---

## 📚 Documentation

- **Architecture**: See system diagrams in PHASE_2_README.md
- **API Reference**: http://localhost:8000/api/docs
- **Deployment**: This file
- **Development**: See PHASE_1_README.md, PHASE_2_README.md
- **Operations**: See PHASE_3_README.md

---

## 💡 Best Practices

1. **Always backup before major updates**
2. **Test in staging before production**
3. **Monitor system resources**
4. **Keep logs for audit trail**
5. **Rotate secrets regularly**
6. **Use version control**
7. **Document changes**
8. **Plan for disaster recovery**

---

## 📞 Support

- **Documentation**: README Files
- **API Docs**: /api/docs endpoint
- **Issues**: GitHub Issues
- **Community**: Discussions

---

**AS3 Platform v2.0.0 - Ready for Production! 🚀**
