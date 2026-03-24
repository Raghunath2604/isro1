#!/bin/bash

###############################################################################
# Quick Development Startup Script
# Starts both backend and frontend in parallel
# Run: bash scripts/start-dev.sh
###############################################################################

echo "🚀 AS³ Platform - Development Startup"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create log directories
mkdir -p logs

# Start PostgreSQL and Redis with Docker
echo "${BLUE}Starting infrastructure...${NC}"
docker-compose up -d postgres redis 2>/dev/null || true
sleep 5

# Start Backend
echo "${BLUE}Starting backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

echo -e "${GREEN}Backend starting on http://localhost:8000${NC}"
uvicorn main:app --reload --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!

cd ..

# Start Frontend
echo "${BLUE}Starting frontend...${NC}"
cd frontend

echo -e "${GREEN}Frontend starting on http://localhost:5173${NC}"
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!

cd ..

echo ""
echo -e "${GREEN}✓ Services started!${NC}"
echo ""
echo "Process IDs:"
echo "  Backend:  $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/api/docs"
echo ""
echo "Logs:"
echo "  Backend:  tail -f logs/backend.log"
echo "  Frontend: tail -f logs/frontend.log"
echo ""
echo "To stop:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${YELLOW}Press Ctrl+C to view logs or kill processes${NC}"
echo ""

# Keep script running
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Services stopped'; exit" INT

wait
