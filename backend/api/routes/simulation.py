from fastapi import APIRouter, HTTPException
from backend.models.simulation_model import (
    SimulationStartRequest, SimulationResponse, ManeuverType
)
from backend.services.simulation_service import simulation_service

router = APIRouter()

@router.post("/start", response_model=SimulationResponse)
async def start_simulation(request: SimulationStartRequest):
    """
    Start a new orbital simulation

    Args:
        request: SimulationStartRequest with maneuver parameters

    Returns:
        Initial simulation state
    """
    try:
        state = await simulation_service.start_simulation(
            request.spacecraft_id,
            request.maneuver,
            request.duration
        )
        return SimulationResponse(
            status="success",
            simulation_state=state,
            message="Simulation started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/state/{spacecraft_id}")
async def get_simulation_state(spacecraft_id: str):
    """
    Get current simulation state

    Args:
        spacecraft_id: Spacecraft identifier

    Returns:
        Current simulation state
    """
    state = simulation_service.get_simulation_state(spacecraft_id)
    if not state:
        raise HTTPException(
            status_code=404,
            detail=f"No active simulation for {spacecraft_id}"
        )
    return {
        "status": "success",
        "simulation_state": state.model_dump()
    }

@router.post("/pause/{spacecraft_id}")
async def pause_simulation(spacecraft_id: str):
    """Pause an active simulation"""
    success = await simulation_service.pause_simulation(spacecraft_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"No active simulation for {spacecraft_id}"
        )
    return {
        "status": "success",
        "message": "Simulation paused",
        "spacecraft_id": spacecraft_id
    }

@router.post("/resume/{spacecraft_id}")
async def resume_simulation(spacecraft_id: str):
    """Resume a paused simulation"""
    success = await simulation_service.resume_simulation(spacecraft_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"No active simulation for {spacecraft_id}"
        )
    return {
        "status": "success",
        "message": "Simulation resumed",
        "spacecraft_id": spacecraft_id
    }

@router.post("/stop/{spacecraft_id}")
async def stop_simulation(spacecraft_id: str):
    """Stop and clean up a simulation"""
    success = await simulation_service.stop_simulation(spacecraft_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"No active simulation for {spacecraft_id}"
        )
    return {
        "status": "success",
        "message": "Simulation stopped",
        "spacecraft_id": spacecraft_id
    }

@router.get("/hohmann-transfer")
async def calculate_hohmann_transfer(r1: float, r2: float):
    """
    Calculate delta-v for Hohmann transfer

    Args:
        r1: Initial orbit radius (km)
        r2: Target orbit radius (km)

    Returns:
        Required delta-v (km/s)
    """
    try:
        dv = simulation_service.calculate_hohmann_transfer(r1, r2)
        return {
            "status": "success",
            "r1": r1,
            "r2": r2,
            "delta_v": round(dv, 4),
            "units": "km/s"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/orbital-velocity")
async def get_orbital_velocity(altitude: float):
    """
    Get orbital velocity at altitude

    Args:
        altitude: Altitude above Earth (km)

    Returns:
        Orbital velocity (km/s)
    """
    try:
        velocity = simulation_service.calculate_orbital_velocity(altitude)
        return {
            "status": "success",
            "altitude": altitude,
            "orbital_velocity": round(velocity, 4),
            "units": "km/s"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/is-simulating/{spacecraft_id}")
async def check_if_simulating(spacecraft_id: str):
    """Check if a spacecraft is currently simulating"""
    is_simulating = simulation_service.is_simulating(spacecraft_id)
    return {
        "spacecraft_id": spacecraft_id,
        "is_simulating": is_simulating
    }

@router.get("/health")
async def simulation_health():
    """Health check for simulation service"""
    return {
        "status": "healthy",
        "service": "simulation"
    }
