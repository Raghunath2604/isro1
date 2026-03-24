# Phase 1: Core API + AI Pipeline Integration

## Overview
This phase implements the complete pipeline:
```
User Query → API → RAG → CrewAI Agent → Response
```

## Project Structure

```
AS3/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration settings
│   ├── api/
│   │   ├── router.py           # Main API router
│   │   └── routes/
│   │       └── analysis.py     # Analysis endpoint
│   ├── models/
│   │   └── analysis_model.py   # Pydantic models
│   └── services/
│       ├── rag_service.py      # RAG service layer
│       └── reasoning_service.py # Analysis service
├── agents/
│   └── crew.py                 # CrewAI agents setup
├── rag/
│   └── rag_engine.py           # RAG engine
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── README.md
```

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Edit `.env` file with your settings:
```
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4
```

### 3. Run the Server
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Health Check
```bash
GET http://localhost:8000/
GET http://localhost:8000/health
```

### Analysis Endpoint
```bash
POST http://localhost:8000/analysis/

Body:
{
  "query": "Why spacecraft temperature increases?"
}
```

## Flow Explanation

### 1. **API Router** (`backend/api/router.py`)
- Registers all API routes
- Includes `/analysis` endpoints

### 2. **Analysis Endpoint** (`backend/api/routes/analysis.py`)
- Receives user query
- Calls RAG service for context
- Calls reasoning service for analysis
- Returns structured response

### 3. **RAG Service** (`backend/services/rag_service.py`)
- Interfaces with RAG engine
- Retrieves relevant documents
- Returns RAGContext objects

### 4. **RAG Engine** (`rag/rag_engine.py`)
- Stores knowledge base
- Performs semantic search
- Returns matching documents

### 5. **Reasoning Service** (`backend/services/reasoning_service.py`)
- Orchestrates CrewAI agents
- Formats context for agents
- Executes analysis tasks

### 6. **CrewAI Agents** (`agents/crew.py`)
- Defines AI agents (Space Scientist)
- Creates analysis tasks
- Executes crew workflow
- Returns detailed analysis

## Testing the Pipeline

### Test 1: Health Check
```bash
curl http://localhost:8000/health
```

Expected Response:
```json
{
  "status": "healthy",
  "platform": "AS3",
  "debug": true
}
```

### Test 2: Full Analysis
```bash
curl -X POST http://localhost:8000/analysis/ \
  -H "Content-Type: application/json" \
  -d '{"query": "Why spacecraft temperature increases?"}'
```

Expected Response:
```json
{
  "query": "Why spacecraft temperature increases?",
  "context": [
    {
      "content": "...",
      "source": "spacecraft_thermal_management",
      "relevance_score": 0.9
    }
  ],
  "response": "...",
  "status": "success"
}
```

## Key Components

### Models (`backend/models/analysis_model.py`)
- `AnalysisRequest`: Incoming query
- `AnalysisResponse`: Complete response with context and analysis
- `RAGContext`: Retrieved document context

### Configuration (`backend/config.py`)
- Pydantic Settings for environment variables
- API host/port configuration
- LLM and RAG settings

### RAG System (`rag/rag_engine.py`)
- Knowledge base management
- Document search and retrieval
- Semantic matching (currently keyword-based)

### Agents (`agents/crew.py`)
- Space Scientist agent
- Analysis task creation
- Crew orchestration

## Environment Variables

```env
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

OPENAI_API_KEY=your_key_here
LLM_MODEL=gpt-4

RAG_VECTOR_DB=chroma
RAG_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

DATABASE_URL=postgresql://user:password@localhost:5432/as3_db

LOG_LEVEL=INFO
LOG_FILE=logs/as3.log
```

## Next Steps (Phase 2+)

- [ ] Add more agents (Anomaly Detector, Simulation Agent, etc.)
- [ ] Implement actual vector database (Chroma/Pinecone)
- [ ] Add semantic search with embeddings
- [ ] Integrate with NASA/ESA APIs
- [ ] Build React frontend
- [ ] Add 3D visualization (Three.js)
- [ ] Implement mission planning module
- [ ] Add database persistence

## Troubleshooting

**Import Errors:**
- Ensure all `__init__.py` files are present
- Run from project root directory
- Check Python path includes project root

**OpenAI API Errors:**
- Verify `OPENAI_API_KEY` is set in `.env`
- Check API key is valid
- Ensure sufficient credits/quota

**RAG Not Finding Context:**
- Check query keywords match knowledge base sources
- Add more documents using `add_knowledge()` function
- Implement semantic search for better matching

## Phase 1 Status: ✅ COMPLETE

All core components implemented:
- ✅ FastAPI backend
- ✅ API routing
- ✅ RAG system
- ✅ CrewAI agents
- ✅ End-to-end pipeline
- ✅ Error handling
- ✅ Configuration management
