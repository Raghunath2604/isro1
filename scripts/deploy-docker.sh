#!/bin/bash

###############################################################################
# Docker-based Local Deployment Script
# This script builds and deploys the AS³ Platform using Docker
# Run: bash scripts/deploy-docker.sh [prod|dev]
###############################################################################

set -e

ENVIRONMENT=${1:-dev}

echo "🚀 AS³ Platform - Docker Deployment Script"
echo "==========================================="
echo "Environment: $ENVIRONMENT"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker found${NC}"
echo ""

# Build images
echo "${BLUE}[1/5]${NC} Building Docker images..."

docker build -f docker/Dockerfile.backend -t as3-backend:$ENVIRONMENT . \
    --build-arg ENVIRONMENT=$ENVIRONMENT \
    --quiet
echo -e "${GREEN}✓ Backend image built${NC}"

docker build -f docker/Dockerfile.frontend -t as3-frontend:$ENVIRONMENT . \
    --build-arg ENVIRONMENT=$ENVIRONMENT \
    --quiet
echo -e "${GREEN}✓ Frontend image built${NC}"

echo ""

# Stop existing containers
echo "${BLUE}[2/5]${NC} Stopping existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true
echo -e "${GREEN}✓ Containers stopped${NC}"

echo ""

# Start services
echo "${BLUE}[3/5]${NC} Starting services..."

if [ "$ENVIRONMENT" = "prod" ]; then
    docker-compose -f docker-compose.prod.yml up -d
    echo -e "${GREEN}✓ Production services started${NC}"
else
    docker-compose up -d
    echo -e "${GREEN}✓ Development services started${NC}"
fi

sleep 10

echo ""

# Verify services
echo "${BLUE}[4/5]${NC} Verifying services..."

BACKEND_HEALTH=$(curl -s http://localhost:8000/health || echo "FAIL")
if [[ $BACKEND_HEALTH == *"ok"* ]]; then
    echo -e "${GREEN}✓ Backend healthy${NC}"
else
    echo -e "${YELLOW}⚠ Backend not responding yet${NC}"
fi

FRONTEND_CHECK=$(curl -s http://localhost:3000 || echo "FAIL")
if [[ $FRONTEND_CHECK != "FAIL" ]]; then
    echo -e "${GREEN}✓ Frontend accessible${NC}"
else
    echo -e "${YELLOW}⚠ Frontend not responding yet${NC}"
fi

echo ""

# Show logs
echo "${BLUE}[5/5]${NC} Services deployment complete"
echo ""
echo -e "${GREEN}Running services:${NC}"
docker-compose ps --services
echo ""

echo -e "${GREEN}URLs:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/api/docs"
echo "  Database: postgres://postgres:postgres@localhost:5432/as3_db"
echo ""

echo -e "${YELLOW}View logs:${NC}"
echo "  docker-compose logs -f backend"
echo "  docker-compose logs -f frontend"
echo "  docker-compose logs -f"
echo ""

echo -e "${GREEN}Stop services:${NC}"
echo "  docker-compose down"
echo ""

echo -e "${GREEN}Done! 🎉${NC}"
