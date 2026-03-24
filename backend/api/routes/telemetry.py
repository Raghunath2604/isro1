from fastapi import APIRouter, HTTPException
from backend.models.telemetry_model import TelemetryRequest, TelemetryResponse
from backend.services.telemetry_service import telemetry_service

router = APIRouter()

@router.get("/status/{spacecraft_id}", response_model=TelemetryResponse)
async def get_telemetry_status(spacecraft_id: str = "ISS-01"):
    """
    Get current telemetry snapshot

    Args:
        spacecraft_id: Spacecraft identifier

    Returns:
        Current telemetry data
    """
    try:
        telemetry = await telemetry_service.get_current_telemetry(spacecraft_id)
        return TelemetryResponse(
            status="success",
            data=telemetry
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/status", response_model=TelemetryResponse)
async def post_telemetry_status(request: TelemetryRequest):
    """
    Get current telemetry snapshot (POST)

    Args:
        request: TelemetryRequest with spacecraft_id

    Returns:
        Current telemetry data
    """
    try:
        telemetry = await telemetry_service.get_current_telemetry(request.spacecraft_id)
        return TelemetryResponse(
            status="success",
            data=telemetry
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/anomalies/{spacecraft_id}")
async def check_anomalies(spacecraft_id: str = "ISS-01"):
    """
    Check for active anomalies

    Args:
        spacecraft_id: Spacecraft identifier

    Returns:
        List of detected anomalies
    """
    try:
        telemetry = await telemetry_service.get_current_telemetry(spacecraft_id)
        anomalies = await telemetry_service.check_anomalies(telemetry)
        return {
            "status": "success",
            "spacecraft_id": spacecraft_id,
            "anomalies": anomalies,
            "critical": len([a for a in anomalies if "critical" in a.lower()])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def telemetry_health():
    """Health check for telemetry service"""
    return {
        "status": "healthy",
        "service": "telemetry"
    }
