# 🚀 AS³ Platform - Quick Start Guide

## ⚡ 30-Second Setup

### 1. Install Dependencies (First Time Only)
```bash
cd isro1

# Backend
cd backend
pip install -r ../requirements-as3-complete.txt

# Frontend
cd ../frontend
npm install
```

### 2. Start Everything
```bash
# From isro1 directory
docker-compose up -d

# Or run locally (two terminals):
# Terminal 1: Backend
cd backend && uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 3. Access the Platform
```
Frontend:   http://localhost:3000
API Docs:   http://localhost:8000/api/docs
WebSocket:  ws://localhost:8000/ws/telemetry
```

---

## 🌟 NEW FEATURES YOU NOW HAVE

### 1. **Dark Mode + Light Mode**
- Toggle theme in top-right corner
- Preference automatically saved
- Smooth transitions

### 2. **Mobile Responsive Design**
- Works perfectly on phones/tablets
- Adaptive layouts
- Touch-friendly buttons
- Tab navigation for features

### 3. **Live ISS Tracking** 🛰️
- **Real ISS Position**: Updated every 5 seconds from NASA API
- **Next Passes**: See when ISS will be visible from your location
- **Live Coordinates**: Latitude, longitude, timestamp
- **Location-Based**: Uses your geolocation (with permission) or defaults to New York

Access on **"ISS Tracking"** tab

### 4. **Advanced Analytics** 📊
- **Temperature Trends**: See heating patterns over time
- **Power Consumption**: Monitor battery levels
- **Anomaly Distribution**: Pie chart of issues detected
- **Component Health**: Health status of each system
- **Data Export**: Download as JSON or CSV
- **Custom Time Ranges**: 24 hours, 7 days, 30 days

Access on **"Analytics"** tab

### 5. **Smart Alerting System** 🔔
- **Custom Alert Rules**: Create conditions (temp > 70, power < 30, etc)
- **Multiple Channels**:
  - 🔔 In-app toast notifications
  - 🌐 Browser notifications (even tab is closed)
  - 📧 Email for critical alerts
- **Webhook Integration**: Send to Slack, Discord, external APIs
- **Alert History**: See all alerts with timestamps

Access on **"Alert Rules"** tab and click "New Alert Rule"

---

## 📋 What's Configured in `.env`

### ✅ Already Set Up
```env
# NASA API
NASA_API_KEY=kkn8pA8Ac6Pwv0WFR1V83f2zewmnEbfIdrGaja86
ENABLE_NASA_APIs=True

# NOAA Space Weather (Free!)
ENABLE_NOAA_APIs=True

# Gmail SMTP (Email alerts)
SMTP_USERNAME=raghunathareddygr94@gmail.com
ENABLE_EMAIL_ALERTS=True

# Space-Track TLE Data
SPACETRACK_USERNAME=your-credentials
ENABLE_SPACETRACK=True

# Database
DATABASE_URL=postgresql://as3user:as3password@localhost:5432/as3_db
```

### ⏳ Still Need (Optional)
```env
# For better AI analysis:
OPENAI_API_KEY=sk-your-key-here

# For ESA satellite imagery:
ESA_API_KEY=your-key-here
ESA_CLIENT_ID=your-id
ESA_CLIENT_SECRET=your-secret
```

---

## 📱 Testing the Features

### Test Dark Mode
1. Click the sun/moon icon in top-right
2. See everything switch to dark theme
3. Reload page - preference is saved!

### Test Mobile Responsive
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Try iPhone 12 / iPad Pro
4. Tap menu button to see responsive navigation

### Test ISS Tracking
1. Go to **ISS Tracking** tab
2. Allow location permission (or it defaults to NYC)
3. See live ISS position updating every 5 seconds
4. Scroll down to see next 10 visible passes

### Test Analytics
1. Go to **Analytics** tab
2. Click "24h", "7d", "30d" buttons to change time range
3. Export JSON or CSV
4. See component health bars and trends

### Test Alerts
1. Go to **Alert Rules** tab
2. See default alert rules (Temperature, Power, Signal, Anomaly)
3. Click "New Alert Rule" to add custom condition
4. Example: `temperature > 60`
5. Enable/disable rules with toggle
6. Delete rules you don't need

---

## 🐳 Docker Compose Commands

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop everything
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Reset database
docker-compose down -v
docker-compose up -d
```

---

## 🛠️ Troubleshooting

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
cd frontend && PORT=3001 npm run dev
```

### "PostgreSQL connection refused"
```bash
# Make sure Docker is running
docker ps

# Restart postgres
docker-compose restart postgres

# Check connection
docker-compose exec postgres psql -U as3user -d as3_db
```

### "NASA API not working"
```bash
# Test API key
curl "https://api.nasa.gov/planetary/apod?api_key=YOUR_KEY"

# Check .env has correct key
grep NASA_API_KEY .env
```

### "Dark mode not working"
1. Clear browser cache
2. Check localStorage: `localStorage.getItem('as3-theme')`
3. Manually set: `localStorage.setItem('as3-theme', 'dark')`

### "ISS Tracker showing no data"
1. Check JavaScript console for errors (F12)
2. Verify NASA API key works
3. Check geolocation permission
4. Try manual coordinates in browser console

---

## 🌐 Environment Variables

### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:8000        # API endpoint
VITE_WS_URL=ws://localhost:8000          # WebSocket endpoint
VITE_ENABLE_DARK_MODE=true               # Dark mode support
VITE_ENABLE_3D_VIZ=true                  # 3D visualization
VITE_ENABLE_REAL_TIME=true               # Real-time updates
VITE_ENABLE_ALERTS=true                  # Alert system
VITE_DEFAULT_THEME=dark                  # Default to dark theme
```

### Backend (.env)
```env
# API
API_HOST=0.0.0.0                        # Listen on all interfaces
API_PORT=8000                           # FastAPI port

# NASA API
NASA_API_KEY=your-key                   # ISS tracking + imagery
ENABLE_NASA_APIs=True

# NOAA (free space weather)
ENABLE_NOAA_APIs=True

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password         # NOT your main password!
ENABLE_EMAIL_ALERTS=True

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/as3_db

# ML
ENABLE_ML_TRAINING=True
ML_ANOMALY_THRESHOLD=0.1
```

---

## 📊 File Structure

```
isro1/
├── frontend/                          # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx           # Main dashboard (with tabs)
│   │   │   ├── Header.jsx              # Header + theme toggle
│   │   │   ├── ISSTracker.jsx           # NEW: Live ISS tracking
│   │   │   ├── AdvancedAnalytics.jsx    # NEW: Charts + export
│   │   │   ├── ThemeToggle.jsx          # NEW: Dark/light toggle
│   │   │   ├── ResponsiveLayout.jsx     # NEW: Mobile responsive
│   │   │   └── ...others
│   │   ├── context/
│   │   │   └── ThemeContext.jsx         # NEW: Theme provider
│   │   ├── services/
│   │   │   ├── issTracking.js          # NEW: ISS tracking service
│   │   │   ├── alertManager.js         # NEW: Alert system
│   │   │   └── api.js
│   │   └── App.jsx                     # Updated with theme
│   └── package.json                    # Updated with recharts
│
├── backend/                            # FastAPI app
│   ├── main.py                         # Entry point
│   ├── api/
│   │   ├── routes/
│   │   │   ├── as3_advanced.py        # ML + agents endpoints
│   │   │   └── ...others
│   │   └── router.py
│   ├── services/
│   │   ├── anomaly_detection_service.py
│   │   ├── hypothesis_generator.py
│   │   ├── multi_agent_system.py
│   │   └── ...others
│   └── main.py
│
├── docker-compose.yml                  # All services
├── .env                                # Configuration (updated)
├── .env.example                        # Template
├── requirements-as3-complete.txt       # Python deps
│
└── docs/
    ├── API_SETUP_GUIDE.md             # How to get API keys
    ├── PLATFORM_ENHANCEMENTS.md       # Feature list
    └── SETUP_CHECKLIST.md             # Configuration guide
```

---

## 🎯 Next Steps

### To Make It Even Better:

1. **Add Your OpenAI Key** (for smarter analysis)
   ```
   OPENAI_API_KEY=sk-your-key
   ```

2. **Connect Your Slack** (for webhook alerts)
   - Create Slack webhook
   - Add to .env: `SLACK_WEBHOOK_URL=https://...`

3. **Train ML Model** (with real data)
   ```bash
   curl -X POST http://localhost:8000/as3/anomaly/train \
     -H "Content-Type: application/json" \
     -d @training_data.json
   ```

4. **Deploy to Production**
   - Use Kubernetes: `kubectl apply -f k8s/deployment.yaml`
   - Or Heroku: `git push heroku main`

---

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

Try the endpoints:
- `GET /api/health` - System health
- `GET /as3/complete-status` -  Full AS³ status
- `POST /as3/anomaly/detect` - Detect anomalies
- `POST /as3/hypothesis/generate` - Generate hypotheses
- `POST /as3/agents/workflow/execute` - Run autonomous workflow

---

## 🎓 Learning

All components are built with:
- **React 18** - Latest React features
- **Tailwind CSS** - Responsive modern styling
- **Three.js** - 3D visualization
- **Recharts** - Beautiful data charts
- **FastAPI** - High-performance Python API

Start with:
1. `frontend/src/components/Dashboard.jsx` - Main UI
2. `frontend/src/services/issTracking.js` - API integration
3. `backend/api/routes/as3_advanced.py` - Backend endpoints

---

## ❓ FAQ

**Q: Can I run without Docker?**
A: Yes! Install Python & Node, then:
```bash
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
cd frontend && npm install && npm run dev
```

**Q: Is my data encrypted?**
A: Communication is HTTPS-ready. Data in transit can be encrypted with TLS. At rest, use PostgreSQL encryption.

**Q: How do I backup data?**
A: PostgreSQL is in Docker with named volume
```bash
docker-compose exec postgres pg_dump -U as3user as3_db > backup.sql
```

**Q: Can I enable SSL/TLS?**
A: Yes! Update `.env`:
```env
ENABLE_HTTPS=True
```
Then provide certificate paths.

---

## 🆘 Need Help?

1. Check logs:
   ```bash
   docker-compose logs -f
   ```

2. Verify services:
   ```bash
   curl http://localhost:8000/api/health
   ```

3. Read docs:
   - `API_SETUP_GUIDE.md` - API configuration
   - `PLATFORM_ENHANCEMENTS.md` - Feature details
   - `DEPLOYMENT_GUIDE.md` - Production setup

---

**Ready? Let's Go! 🚀**

```bash
cd isro1
docker-compose up -d
open http://localhost:3000
```

Enjoy your autonomous space intelligence platform! 🌌✨
