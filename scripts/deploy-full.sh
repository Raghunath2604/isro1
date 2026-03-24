#!/bin/bash

###############################################################################
# Interactive Deployment Setup
# Handles both Vercel and Railway deployment with user prompts
# Usage: bash scripts/deploy-full.sh
###############################################################################

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║         AS³ PLATFORM - INTERACTIVE DEPLOYMENT SETUP                         ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get tokens
echo -e "${BLUE}🔑 STEP 1: Get Your Tokens${NC}"
echo "================================"
echo ""
echo "1. Vercel Token:"
echo "   → Go to: https://vercel.com/account/tokens"
echo "   → Click 'Create Token'"
echo "   → Copy the token"
echo ""
read -p "Paste your VERCEL_TOKEN (or press Enter to skip): " VERCEL_TOKEN
echo ""

echo "2. Railway Token:"
echo "   → Go to: https://railway.app/account/tokens"
echo "   → Click 'Create API Token'"
echo "   → Copy the token"
echo ""
read -p "Paste your RAILWAY_TOKEN (or press Enter to skip): " RAILWAY_TOKEN
echo ""

# Ask what to deploy
echo -e "${BLUE}📦 STEP 2: What to Deploy?${NC}"
echo "================================"
echo ""
echo "1) Frontend only (Vercel)"
echo "2) Backend only (Railway)"
echo "3) Both (Vercel + Railway)"
echo ""
read -p "Choose (1-3): " DEPLOYMENT_CHOICE

echo ""
echo "═════════════════════════════════════════════════════════════════════════════════"

# Deploy based on choice
case $DEPLOYMENT_CHOICE in
    1)
        echo -e "${BLUE}🎨 Deploying Frontend to Vercel...${NC}"
        if [ -z "$VERCEL_TOKEN" ]; then
            echo -e "${RED}❌ Error: Vercel token required${NC}"
            exit 1
        fi
        bash scripts/deploy-vercel.sh "$VERCEL_TOKEN"
        ;;
    2)
        echo -e "${BLUE}🔧 Deploying Backend to Railway...${NC}"
        if [ -z "$RAILWAY_TOKEN" ]; then
            echo -e "${RED}❌ Error: Railway token required${NC}"
            exit 1
        fi
        bash scripts/deploy-railway.sh "$RAILWAY_TOKEN"
        ;;
    3)
        echo -e "${BLUE}🚀 Deploying Both (Vercel + Railway)...${NC}"

        if [ -z "$VERCEL_TOKEN" ]; then
            echo -e "${RED}❌ Error: Vercel token required${NC}"
            exit 1
        fi

        if [ -z "$RAILWAY_TOKEN" ]; then
            echo -e "${RED}❌ Error: Railway token required${NC}"
            exit 1
        fi

        echo -e "${YELLOW}Starting frontend deployment...${NC}"
        bash scripts/deploy-vercel.sh "$VERCEL_TOKEN" &
        FRONTEND_PID=$!

        echo -e "${YELLOW}Starting backend deployment...${NC}"
        bash scripts/deploy-railway.sh "$RAILWAY_TOKEN" &
        BACKEND_PID=$!

        wait $FRONTEND_PID
        wait $BACKEND_PID

        echo ""
        echo -e "${GREEN}✅ Both deployments complete!${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "═════════════════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE${NC}"
echo ""
echo "Next steps:"
echo "  1. Check Vercel dashboard: https://vercel.com/dashboard"
echo "  2. Check Railway dashboard: https://railway.app/dashboard"
echo "  3. Wire frontend to backend (update env vars)"
echo "  4. Test your deployment"
echo ""
