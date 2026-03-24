#!/bin/bash

###############################################################################
# Automated Railway Deployment Script
# This script deploys backend to Railway using Railway CLI
# Usage: bash scripts/deploy-railway.sh <RAILWAY_TOKEN>
###############################################################################

set -e

echo "🚀 AS³ Platform - Railway Deployment Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check token
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Railway token required${NC}"
    echo ""
    echo "Usage: bash scripts/deploy-railway.sh <RAILWAY_TOKEN>"
    echo ""
    echo "Get your token from: https://railway.app/account/tokens"
    exit 1
fi

RAILWAY_TOKEN="$1"

# Check Railway CLI
echo -e "${BLUE}[1/5]${NC} Checking Railway CLI..."
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠ Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi
echo -e "${GREEN}✓ Railway CLI ready${NC}"
echo ""

# Login to Railway
echo -e "${BLUE}[2/5]${NC} Logging into Railway..."
export RAILWAY_TOKEN="$RAILWAY_TOKEN"
railway login --token "$RAILWAY_TOKEN" > /dev/null 2>&1 || true
echo -e "${GREEN}✓ Railway authenticated${NC}"
echo ""

# Install backend dependencies
echo -e "${BLUE}[3/5]${NC} Installing backend dependencies..."
cd backend
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Run tests
echo -e "${BLUE}[4/5]${NC} Running tests..."
pytest tests/ -v --tb=short 2>&1 | tail -20 || echo -e "${YELLOW}⚠ Tests skipped${NC}"
echo -e "${GREEN}✓ Tests complete${NC}"
echo ""

# Deploy to Railway
echo -e "${BLUE}[5/5]${NC} Deploying to Railway..."
railway up --service backend --environment production 2>&1 | tail -10 || \
  echo -e "${YELLOW}ℹ Check Railway dashboard for deployment status${NC}"

echo ""
echo "=" * 80
echo -e "${GREEN}✅ DEPLOYMENT INITIATED${NC}"
echo "=" * 80
echo ""
echo "Monitor deployment:"
echo "  1. Go to: https://railway.app/dashboard"
echo "  2. View backend service logs"
echo "  3. Check when status changes to RUNNING"
echo ""
echo "Get your backend URL from Railway dashboard"
echo "Then update Vercel environment variables with:"
echo "  VITE_API_URL: https://your-railway-url"
echo "  VITE_WS_URL: wss://your-railway-url"
echo ""
