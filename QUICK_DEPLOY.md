# 🚀 One-Command Deployment Guide

**Choose your deployment method below:**

---

## ⚡ FASTEST: One Command (Requires Tokens)

If you have Vercel and Railway tokens ready:

```bash
bash scripts/deploy-full.sh
```

This will:
1. Ask for your tokens
2. Deploy frontend to Vercel
3. Deploy backend to Railway
4. Show you the live URLs

**Total time: ~45 minutes**

---

## 🎨 Frontend Only (Vercel)

Deploy just the React frontend:

```bash
bash scripts/deploy-vercel.sh YOUR_VERCEL_TOKEN
```

Get token from: https://vercel.com/account/tokens

**Time: ~20 minutes**

---

## 🔧 Backend Only (Railway)

Deploy just the FastAPI backend:

```bash
bash scripts/deploy-railway.sh YOUR_RAILWAY_TOKEN
```

Get token from: https://railway.app/account/tokens

**Time: ~20 minutes**

---

## 📖 Step-by-Step Manual Guide

Follow: `DEPLOYMENT_VERCEL_RAILWAY.md`

5 detailed phases with screenshots and explanations.

**Time: ~75 minutes (but more detailed)**

---

## 🐳 Docker Deployment

Deploy everything locally or to your server:

```bash
bash scripts/deploy-docker.sh prod
```

**Time: ~5 minutes**

---

## 🤖 Automatic Deployment

Every time you push to GitHub, it automatically:
1. Runs tests
2. Builds application
3. Deploys to Vercel + Railway

No manual deployment needed after initial setup!

---

## 🎯 What You Need

| For Vercel + Railway | Get From |
|----------------------|----------|
| VERCEL_TOKEN | https://vercel.com/account/tokens |
| RAILWAY_TOKEN | https://railway.app/account/tokens |
| OPENAI_API_KEY | https://platform.openai.com/api-keys |
| NASA_API_KEY | https://api.nasa.gov |

---

## ✅ After Deployment

Your system will have:
- 🌍 **Frontend**: https://your-frontend.vercel.app
- 🔧 **Backend**: https://your-backend.railway.app
- 📊 **Database**: PostgreSQL on Railway
- 🔄 **Auto-CI/CD**: GitHub → Vercel/Railway
- 📈 **Auto-scaling**: Handles any traffic
- 🔒 **SSL/TLS**: HTTPS everywhere
- 🌐 **Global**: Available worldwide

---

## 🚀 TL;DR

```bash
# Quick deploy to Vercel + Railway
bash scripts/deploy-full.sh

# Just frontend
bash scripts/deploy-vercel.sh <VERCEL_TOKEN>

# Just backend
bash scripts/deploy-railway.sh <RAILWAY_TOKEN>

# Or follow manual guide
cat DEPLOYMENT_VERCEL_RAILWAY.md
```

---

**Ready? Let's go! 🎉**
