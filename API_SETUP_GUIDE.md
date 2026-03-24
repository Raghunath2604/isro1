# API Setup Guide for AS³ Platform

## Quick Start - FREE APIs Only

To run AS³ with completely free APIs:

```bash
# 1. Get NASA API Key (30 seconds)
# Visit: https://api.nasa.gov
# Fill simple form, get key instantly
# Copy to .env: NASA_API_KEY=your-key

# 2. NOAA Space Weather (NO KEY NEEDED!)
# Already included, just enable: ENABLE_NOAA_APIs=True

# 3. Optional: OpenAI API Key
# Visit: https://platform.openai.com/api-keys
# Create free account with $5 trial credit
# Copy to .env: OPENAI_API_KEY=sk-your-key
```

That's it! You can now run the full platform with real space data.

---

## Detailed Setup Instructions

### 1️⃣ NASA APIs (FREE - RECOMMENDED)

**Time to setup: 1 minute**

1. Go to: https://api.nasa.gov
2. Fill in simple form (name, email)
3. Check email for API key
4. Add to `.env`:
   ```env
   NASA_API_KEY=your-api-key-here
   ENABLE_NASA_APIs=True
   ```

**What you get:**
- ✅ **ISS Real-Time Position** - Live space station location
- ✅ **NEO Data** - Near Earth asteroids & objects
- ✅ **Satellite Imagery** - Earth photos by coordinates
- ✅ **APOD** - Astronomy Picture of the Day
- ✅ **Free tier**: 40 requests/hour (unlimited with key)

**Used by:**
- Telemetry visualizations
- 3D orbit tracking
- Real-time ISS position updates

---

### 2️⃣ NOAA Space Weather (FREE - NO KEY REQUIRED!)

**Time to setup: 0 minutes**

Just enable in `.env`:
```env
ENABLE_NOAA_APIs=True
```

Already configured to use:
- `https://services.swpc.noaa.gov/json` - Public API

**What you get:**
- ✅ **Solar Wind Data** - Current space weather
- ✅ **Geomagnetic Forecasts** - Kp index predictions
- ✅ **magnetometer plots** - Solar activity tracking
- ✅ **Satellite Impact Alerts** - Real-time alerts
- ✅ **COMPLETELY FREE** - No limits!

**Used by:**
- Anomaly detection (solar storm correlation)
- Spacecraft risk assessment
- Mission planning recommendations

---

### 3️⃣ Space-Track.org TLE Data (FREE ACCOUNT)

**Time to setup: 5 minutes**

1. Go to: https://www.space-track.org
2. Create free account (email verification)
3. Get credentials
4. Add to `.env`:
   ```env
   SPACETRACK_USERNAME=your-username
   SPACETRACK_PASSWORD=your-password
   ENABLE_SPACETRACK=True
   ```

**What you get:**
- ✅ **Two-Line Element Sets (TLEs)** - Satellite orbital data
- ✅ **Real-time satellite tracking** - 40,000+ tracked objects
- ✅ **Historical TLE data** - Track orbit changes
- ✅ **Official source** - US Space Force data
- ✅ **Free account** - Full access!

**Used by:**
- Precise satellite position calculations
- Orbital predictions
- Collision avoidance
- 3D visualization accuracy

---

### 4️⃣ ESA/Copernicus APIs (OPTIONAL - FREE)

**Time to setup: 10 minutes**

1. Go to: https://dataspace.copernicus.eu
2. Create free account
3. Get OAuth credentials
4. Add to `.env`:
   ```env
   ESA_API_KEY=your-key
   ESA_CLIENT_ID=your-id
   ESA_CLIENT_SECRET=your-secret
   ENABLE_ESA_APIs=True
   ```

**What you get:**
- ✅ **Copernicus Sentinel Imagery** - Satellite photos
- ✅ **Earth Observation Data** - Climate monitoring
- ✅ **Exoplanet Database** - Caltech archive
- ✅ **High resolution imagery** - 10m per pixel
- ✅ **Free tier** - Good for development

**Used by:**
- Advanced visualizations
- Scientific discovery
- Earth observation analysis

---

### 5️⃣ OpenAI API (OPTIONAL - PAY-AS-YOU-GO)

**Time to setup: 5 minutes**

1. Go to: https://platform.openai.com/api-keys
2. Create free account
3. Add payment method (optional, starts with $5 trial)
4. Create API key
5. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   LLM_MODEL=gpt-4
   ```

**Cost:**
- Free tier: $5 trial credit (usually lasts a month)
- gpt-3.5-turbo: $0.0015/1K tokens (very cheap)
- gpt-4: $0.03/1K tokens (recommended for quality)

**What you get:**
- ✅ **AI-powered analysis** - Better hypothesis generation
- ✅ **Smart reasoning** - Real hypothesis evaluation
- ✅ **Natural language insights** - Human-readable analysis
- ✅ **Without it** - System still works, uses fallback reasoning

**Used by:**
- Hypothesis generation
- Multi-agent reasoning
- Scientific discovery
- Analysis & insights

---

## Production Setup Checklist

### Before Deployment to Production

- [ ] Generate strong `SECRET_KEY`:
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```

- [ ] Set `DEBUG=False` in `.env`

- [ ] Set `ENABLE_HTTPS=True` for HTTPS

- [ ] Generate SSL certificate:
  ```bash
  # Using Let's Encrypt (recommended)
  certbot certonly --standalone -d your-domain.com
  ```

- [ ] Update `JWT_EXPIRATION_HOURS` appropriately (default 24)

- [ ] Set strong database password:
  ```bash
  DATABASE_URL=postgresql://as3user:STRONG_PASSWORD@prod-host:5432/as3_db
  ```

- [ ] Configure email for alerts:
  ```env
  SMTP_USERNAME=your-email@gmail.com
  SMTP_PASSWORD=app-specific-password
  ENABLE_EMAIL_ALERTS=True
  ```

- [ ] Update `CORS_ORIGINS` with real frontend domain

- [ ] Enable monitoring:
  ```env
  ENABLE_PROMETHEUS=True
  ENABLE_GRAFANA=True
  ```

---

## Minimal Viable Setup (MvS)

Want to start with bare minimum? Use this:

```env
# Backend API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
SECRET_KEY=dev-key-change-in-prod

# NASA API (FREE - get key in 1 minute)
NASA_API_KEY=your-key-here
ENABLE_NASA_APIs=True

# NOAA (FREE - no key needed!)
ENABLE_NOAA_APIs=True

# Database (local PostgreSQL)
DATABASE_URL=postgresql://as3user:as3password@localhost:5432/as3_db

# Logging
LOG_LEVEL=INFO

# Frontend
VITE_API_URL=http://localhost:8000
```

Then run:
```bash
docker-compose up -d
open http://localhost:3000
```

---

## Advanced Setup (All Features)

See `.env.example` for complete configuration with:
- Redis caching
- Email notifications
- Webhooks
- Multiple LLM models
- Custom TLE tracking
- Prometheus monitoring
- Grafana dashboards

---

## Troubleshooting

### "API Key Not Working"
- Check it's copied exactly (no spaces)
- Verify key is for correct service
- Check API rate limits haven't been exceeded
- Confirm API is enabled in `.env`

### "No Space Data"
- Verify `ENABLE_*_APIs=True` in `.env`
- Check internet connection
- Test API directly:
  ```bash
  curl "https://api.nasa.gov/iss-now.json?api_key=YOUR_KEY"
  ```

### "Database Connection Error"
- Verify PostgreSQL is running
- Check credentials in DATABASE_URL
- Create database if not exists:
  ```bash
  createdb as3_db
  ```

### "Slow API Responses"
- Enable Redis: `ENABLE_REDIS=True`
- Reduce `RAG_CHUNK_SIZE`
- Check network latency to API servers

---

## Quick Copy-Paste Configuration

Want to try everything immediately? Use this template:

```env
# Core
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
SECRET_KEY=dev-secret-key

# APIs (fill in your keys)
NASA_API_KEY=FILL_ME
ENABLE_NASA_APIs=True
ENABLE_NOAA_APIs=True
SPACETRACK_USERNAME=FILL_ME
SPACETRACK_PASSWORD=FILL_ME
ENABLE_SPACETRACK=True

# LLM (optional)
OPENAI_API_KEY=FILL_ME
LLM_MODEL=gpt-4

# Database
DATABASE_URL=postgresql://as3user:as3password@localhost:5432/as3_db

# Frontend
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_ENABLE_3D_VIZ=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_REAL_TIME=true

# Features
ENABLE_ML_TRAINING=True
ENABLE_PROMETHEUS=True
LOG_LEVEL=INFO
```

---

## Summary

| API | Time | Cost | Quality | Required |
|-----|------|------|---------|----------|
| NASA | 1 min | FREE | ⭐⭐⭐⭐⭐ | Yes |
| NOAA | 0 min | FREE | ⭐⭐⭐⭐ | Yes |
| Space-Track | 5 min | FREE | ⭐⭐⭐⭐⭐ | Optional |
| ESA | 10 min | FREE | ⭐⭐⭐⭐ | Optional |
| OpenAI | 5 min | $0-20/mo | ⭐⭐⭐⭐⭐ | Optional |

**Recommendation:** Start with NASA + NOAA (completely free), add others as needed!

---

Ready? Which APIs do you have keys for? I'll update your `.env` and enable all the features!
