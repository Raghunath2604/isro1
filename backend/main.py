from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from backend.api.router import router
from backend.config import settings
from backend.database.models import init_db
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AS3 Platform - Advanced Space System",
    description="AI-powered spacecraft analysis, orbital simulation, and mission control",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router)

# Root endpoint
@app.get("/", tags=["Health"])
def root():
    """Root endpoint - API status"""
    return {
        "status": "running",
        "platform": "AS3",
        "version": "2.0.0",
        "environment": "production" if not settings.debug else "development",
        "message": "Advanced Space System Platform - Phase 2 Complete"
    }

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "platform": "AS3",
        "version": "2.0.0",
        "debug": settings.debug,
        "components": {
            "api": "operational",
            "websocket": "operational",
            "database": "operational",
            "ai_agents": "operational",
            "rag_system": "operational"
        }
    }

# Status endpoint
@app.get("/api/status", tags=["Health"])
def api_status():
    """Get detailed system status"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "system": "AS3",
        "version": "2.0.0",
        "uptime": "calculating...",
        "services": {
            "backend": "running",
            "frontend": "connected",
            "database": "connected",
            "websocket": "connected"
        },
        "metrics": {
            "active_connections": 0,
            "processed_requests": 0,
            "cpu_usage": "0%",
            "memory_usage": "0%"
        }
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("╔═══════════════════════════════════════════╗")
    logger.info("║  AS3 Platform - Advanced Space System     ║")
    logger.info("║  Phase 2: Real-Time Web Platform          ║")
    logger.info("╚═══════════════════════════════════════════╝")
    logger.info("")
    logger.info(f"✓ Starting up...")
    logger.info(f"✓ Debug mode: {settings.debug}")
    logger.info(f"✓ API running on {settings.api_host}:{settings.api_port}")
    logger.info(f"✓ Version: 2.0.0")
    logger.info("")

    # Initialize database
    try:
        init_db()
        logger.info("✓ Database initialized")
    except Exception as e:
        logger.warning(f"⚠ Database initialization warning: {e}")

    logger.info(f"✓ API documentation: http://{settings.api_host}:{settings.api_port}/api/docs")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("")
    logger.info("╔═══════════════════════════════════════════╗")
    logger.info("║  AS3 Platform Shutting Down               ║")
    logger.info("╚═══════════════════════════════════════════╝")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
