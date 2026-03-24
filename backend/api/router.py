from fastapi import APIRouter
from backend.api.routes import analysis, websocket, telemetry, simulation, mission, auth, data_sources, analytics, as3_advanced

router = APIRouter()

# Authentication routes
router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

# Analysis routes
router.include_router(
    analysis.router,
    prefix="/analysis",
    tags=["Analysis"]
)

# Telemetry routes
router.include_router(
    telemetry.router,
    prefix="/telemetry",
    tags=["Telemetry"]
)

# Simulation routes
router.include_router(
    simulation.router,
    prefix="/simulation",
    tags=["Simulation"]
)

# Mission routes
router.include_router(
    mission.router,
    prefix="/mission",
    tags=["Mission"]
)

# Data sources routes (NASA, ESA, etc)
router.include_router(
    data_sources.router,
    prefix="/data",
    tags=["Data Sources"]
)

# Analytics routes
router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

# AS³ Advanced (Phases 4-11)
router.include_router(
    as3_advanced.router,
    prefix="/as3",
    tags=["AS3 Advanced - Anomaly, Hypothesis, Multi-Agent"]
)

# WebSocket routes (no prefix needed)
router.include_router(
    websocket.router,
    tags=["WebSocket"]
)

# Health check endpoint
@router.get("/health")
async def health_check():
    """API Router health check"""
    return {
        "status": "healthy",
        "version": "3.0.0",
        "service": "AS3 API Router - Complete",
        "modules": [
            "authentication", "analysis", "telemetry", "simulation", "mission",
            "data_sources", "analytics", "websocket", "as3_advanced"
        ],
        "phases_implemented": 11,
        "ready": True
    }

