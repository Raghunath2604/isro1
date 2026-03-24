#!/bin/bash

# AS3 Platform - Run Script
# Starts backend and frontend

set -e

echo "╔════════════════════════════════════════════╗"
echo "║     AS3 Platform - Start Services         ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check for arguments
if [ "$1" == "backend" ]; then
    echo "Starting backend only..."
    source venv/bin/activate
    exec uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

elif [ "$1" == "frontend" ]; then
    echo "Starting frontend only..."
    cd frontend
    exec npm run dev

elif [ "$1" == "docker" ]; then
    echo "Starting with Docker..."
    docker-compose up

else
    echo "AS3 Platform supports multiple startup modes:"
    echo ""
    echo "Usage: ./scripts/run.sh [MODE]"
    echo ""
    echo "Modes:"
    echo "  backend      - Start only backend (http://localhost:8000)"
    echo "  frontend     - Start only frontend (http://localhost:3000)"
    echo "  docker       - Start all services with docker-compose"
    echo ""
    echo "Example:"
    echo "  Terminal 1: ./scripts/run.sh backend"
    echo "  Terminal 2: ./scripts/run.sh frontend"
    echo ""
    echo "Or single command:"
    echo "  ./scripts/run.sh docker"
    echo ""
fi
