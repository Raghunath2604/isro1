from fastapi import APIRouter, HTTPException
from backend.models.mission_model import (
    MissionPlanRequest, MissionResponse, ActiveMissionsResponse, Mission, MissionObjective, MissionStatus, MissionType
)
from datetime import datetime, timedelta

router = APIRouter()

# Mock mission database
missions_db = {
    "MISSION-001": Mission(
        mission_id="MISSION-001",
        name="ISS Resupply",
        mission_type=MissionType.COMMUNICATION,
        status=MissionStatus.ACTIVE,
        spacecraft_id="ISS-01",
        start_time=datetime.utcnow() - timedelta(hours=2),
        estimated_end_time=datetime.utcnow() + timedelta(hours=4),
        objectives=[
            MissionObjective(name="Establish connection", description="Connect to ISS", completed=True, priority=1),
            MissionObjective(name="Transfer data", description="Upload science data", completed=True, priority=1),
            MissionObjective(name="System check", description="Verify all systems", completed=False, priority=2)
        ],
        progress=75,
        priority=1,
        description="Regular communication and data transfer"
    ),
    "MISSION-002": Mission(
        mission_id="MISSION-002",
        name="Earth Observation",
        mission_type=MissionType.OBSERVATION,
        status=MissionStatus.ACTIVE,
        spacecraft_id="ISS-01",
        start_time=datetime.utcnow() - timedelta(hours=1),
        estimated_end_time=datetime.utcnow() + timedelta(hours=5),
        objectives=[
            MissionObjective(name="Scan weather systems", description="Monitor storms", completed=True, priority=1),
            MissionObjective(name="Capture imagery", description="High-res photos", completed=False, priority=2)
        ],
        progress=50,
        priority=2,
        description="Environmental monitoring mission"
    )
}

@router.post("/plan", response_model=MissionResponse)
async def plan_mission(request: MissionPlanRequest):
    """
    Create a new mission plan

    Args:
        request: Mission planning request

    Returns:
        Created mission
    """
    try:
        mission_id = f"MISSION-{len(missions_db) + 1:03d}"
        objectives = [
            MissionObjective(name=obj, description=obj, completed=False, priority=2)
            for obj in request.objectives
        ]

        mission = Mission(
            mission_id=mission_id,
            name=request.name,
            mission_type=request.mission_type,
            status=MissionStatus.PLANNED,
            spacecraft_id=request.spacecraft_id,
            start_time=datetime.utcnow(),
            estimated_end_time=datetime.utcnow() + timedelta(hours=8),
            objectives=objectives,
            progress=0,
            priority=request.priority,
            description=request.name
        )

        missions_db[mission_id] = mission

        return MissionResponse(
            status="success",
            mission=mission
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/active", response_model=ActiveMissionsResponse)
async def get_active_missions():
    """Get all active missions"""
    try:
        active = [m for m in missions_db.values() if m.status == MissionStatus.ACTIVE]
        return ActiveMissionsResponse(
            status="success",
            missions=active,
            total_count=len(active)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{mission_id}", response_model=MissionResponse)
async def get_mission(mission_id: str):
    """Get specific mission details"""
    mission = missions_db.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")

    return MissionResponse(
        status="success",
        mission=mission
    )

@router.post("/{mission_id}/activate")
async def activate_mission(mission_id: str):
    """Activate a planned mission"""
    mission = missions_db.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")

    mission.status = MissionStatus.ACTIVE
    mission.start_time = datetime.utcnow()

    return {
        "status": "success",
        "message": f"Mission {mission_id} activated",
        "mission": mission.model_dump()
    }

@router.post("/{mission_id}/complete")
async def complete_mission(mission_id: str):
    """Mark mission as completed"""
    mission = missions_db.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")

    mission.status = MissionStatus.COMPLETED
    mission.progress = 100

    return {
        "status": "success",
        "message": f"Mission {mission_id} completed",
        "mission": mission.model_dump()
    }

@router.post("/{mission_id}/abort")
async def abort_mission(mission_id: str):
    """Abort an active mission"""
    mission = missions_db.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")

    mission.status = MissionStatus.ABORTED

    return {
        "status": "success",
        "message": f"Mission {mission_id} aborted",
        "mission": mission.model_dump()
    }

@router.get("")
async def get_all_missions():
    """Get all missions"""
    return {
        "status": "success",
        "missions": list(missions_db.values()),
        "total_count": len(missions_db)
    }

@router.get("/health")
async def mission_health():
    """Health check for mission service"""
    return {
        "status": "healthy",
        "service": "mission"
    }
