#!/bin/bash

###############################################################################
# Automated Vercel Deployment Script
# This script deploys frontend to Vercel using Vercel CLI
# Usage: bash scripts/deploy-vercel.sh <VERCEL_TOKEN>
###############################################################################

set -e

echo "🚀 AS³ Platform - Vercel Deployment Script"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check token
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Vercel token required${NC}"
    echo ""
    echo "Usage: bash scripts/deploy-vercel.sh <VERCEL_TOKEN>"
    echo ""
    echo "Get your token from: https://vercel.com/account/tokens"
    exit 1
fi

VERCEL_TOKEN="$1"

# Check Vercel CLI
echo -e "${BLUE}[1/5]${NC} Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel@latest
fi
echo -e "${GREEN}✓ Vercel CLI ready${NC}"
echo ""

# Install frontend dependencies
echo -e "${BLUE}[2/5]${NC} Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps --silent
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Build frontend
echo -e "${BLUE}[3/5]${NC} Building frontend..."
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Deploy to Vercel
echo -e "${BLUE}[4/5]${NC} Deploying to Vercel..."
export VERCEL_TOKEN="$VERCEL_TOKEN"
vercel deploy --prod \
  --name as3-platform \
  --scope raghunath2604 \
  --build-env VITE_API_URL=https://as3-backend.railway.app \
  --build-env VITE_WS_URL=wss://as3-backend.railway.app \
  --confirm

DEPLOYMENT_URL=$(vercel ls --json 2>/dev/null | head -1 | grep -o '"url":"[^"]*"' | cut -d'"' -f4 || echo "Check Vercel dashboard")

echo -e "${GREEN}✓ Deployment complete${NC}"
echo ""

# Verify deployment
echo -e "${BLUE}[5/5]${NC} Verifying deployment..."
sleep 5

if curl -s "$DEPLOYMENT_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is live${NC}"
else
    echo -e "${YELLOW}⚠ Still starting, check: $DEPLOYMENT_URL${NC}"
fi

echo ""
echo "=" * 80
echo -e "${GREEN}✅ DEPLOYMENT SUCCESS${NC}"
echo "=" * 80
echo ""
echo -e "Frontend URL: ${BLUE}$DEPLOYMENT_URL${NC}"
echo ""
echo "Next steps:"
echo "  1. Update backend URL if needed"
echo "  2. Test at: $DEPLOYMENT_URL"
echo "  3. Deploy backend to Railway"
echo "  4. Wire frontend to backend"
echo ""
