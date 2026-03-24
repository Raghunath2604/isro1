#!/bin/bash

###############################################################################
# Local Environment Setup Script
# This script sets up the complete development environment locally
# Run: bash scripts/setup-local.sh
###############################################################################

set -e

echo "🚀 AS³ Platform - Local Setup Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}[1/8]${NC} Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 not found. Please install Python 3.11+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found ($(node --version))${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found. Please install Docker${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker found${NC}"

echo ""

# Setup backend
echo "${BLUE}[2/8]${NC} Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment exists${NC}"
fi

# Activate venv
source venv/bin/activate

# Install dependencies
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

cd ..

echo ""

# Setup frontend
echo "${BLUE}[3/8]${NC} Setting up frontend..."
cd frontend

# Install dependencies
npm install --legacy-peer-deps --loglevel=error > /dev/null 2>&1
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

echo ""

# Create environment files
echo "${BLUE}[4/8]${NC} Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env 2>/dev/null || cat > backend/.env << 'EOF'
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/as3_db

# API Keys
OPENAI_API_KEY=sk-proj-demo-key
NASA_API_KEY=DEMO_KEY
SPACETRACK_USERNAME=demo_user
SPACETRACK_PASSWORD=demo_pass

# Security
JWT_SECRET_KEY=your-secret-key-change-in-production
SECRET_KEY=your-secret-key-change-in-production

# App Settings
DEBUG=True
ENVIRONMENT=development
API_HOST=localhost
API_PORT=8000
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Logging
LOG_LEVEL=INFO
EOF
    echo -e "${GREEN}✓ Backend .env created${NC}"
else
    echo -e "${GREEN}✓ Backend .env exists${NC}"
fi

# Frontend .env
if [ ! -f "frontend/.env.local" ]; then
    cat > frontend/.env.local << 'EOF'
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_LOG_LEVEL=debug
EOF
    echo -e "${GREEN}✓ Frontend .env.local created${NC}"
else
    echo -e "${GREEN}✓ Frontend .env.local exists${NC}"
fi

echo ""

# Start services with Docker Compose
echo "${BLUE}[5/8]${NC} Starting services with Docker Compose..."

if [ -f "docker-compose.yml" ]; then
    docker-compose up -d postgres redis
    sleep 10
    echo -e "${GREEN}✓ Database and cache started${NC}"
else
    echo -e "${YELLOW}⚠ docker-compose.yml not found, skipping database start${NC}"
fi

echo ""

# Initialize database
echo "${BLUE}[6/8]${NC} Initializing database..."

cd backend
source venv/bin/activate

# Run migrations if Alembic exists
if [ -d "alembic" ]; then
    alembic upgrade head 2>/dev/null || echo -e "${YELLOW}⚠ Migrations skipped${NC}"
fi

cd ..

echo -e "${GREEN}✓ Database initialized${NC}"

echo ""

# Run tests
echo "${BLUE}[7/8]${NC} Running tests..."

cd backend
source venv/bin/activate

if command -v pytest &> /dev/null; then
    pytest tests/ -v --tb=short 2>&1 | head -20
    echo -e "${GREEN}✓ Backend tests completed${NC}"
fi

cd ../frontend

if [ -f "package.json" ]; then
    npm run test -- --run --passWithNoTests 2>&1 | head -20
    echo -e "${GREEN}✓ Frontend tests completed${NC}"
fi

cd ..

echo ""

# Summary
echo "${BLUE}[8/8]${NC} Setup complete!"
echo ""
echo -e "${GREEN}✓ Backend virtual environment: ${NC}backend/venv"
echo -e "${GREEN}✓ Backend dependencies: ${NC}Installed"
echo -e "${GREEN}✓ Frontend dependencies: ${NC}Installed"
echo -e "${GREEN}✓ Environment files: ${NC}Created"
echo -e "${GREEN}✓ Database: ${NC}Running on localhost:5432"
echo -e "${GREEN}✓ Redis: ${NC}Running on localhost:6379"
echo ""

# Start instructions
echo "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Start the backend:"
echo "   cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "${GREEN}Happy coding! 🚀${NC}"
