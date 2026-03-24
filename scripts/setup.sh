#!/bin/bash

# AS3 Platform Setup Script
# Supports: Linux, macOS, WSL

set -e

echo "╔════════════════════════════════════════════╗"
echo "║     AS3 Platform - Setup Script            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Detect OS
OS_TYPE=$(uname -s)
echo "Detected OS: $OS_TYPE"
echo ""

# Check Python
echo "✓ Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "✗ Python 3 not found. Please install Python 3.11+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "  Python version: $PYTHON_VERSION"

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "  Node.js version: $NODE_VERSION"

# Check Git
if ! command -v git &> /dev/null; then
    echo "⚠ Git not found"
else
    echo "✓ Git: $(git --version)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Setting up Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check .env
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env .env.backup 2>/dev/null || true
    cat > .env << 'EOF'
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# LLM Configuration
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4

# RAG Configuration
RAG_VECTOR_DB=chroma
RAG_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/as3_db

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/as3.log
EOF
    echo "✓ .env created. Please edit it with your settings."
else
    echo "✓ .env already exists"
fi

# Create logs directory
mkdir -p logs

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Setting up Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd frontend

# Install Node dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "Updating Node.js dependencies..."
    npm ci
fi

# Check frontend .env
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
EOF
    echo "✓ Frontend .env created"
fi

cd ..

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║    ✓ Setup Complete!                       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

echo "Next steps:"
echo ""
echo "1. Edit .env with your API keys:"
echo "   nano .env"
echo ""
echo "2. Run backend (Terminal 1):"
echo "   source venv/bin/activate"
echo "   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "3. Run frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "Or use Docker for one-command setup:"
echo "   docker-compose up"
echo ""
