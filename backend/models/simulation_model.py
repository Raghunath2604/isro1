from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ManeuverType(str, Enum):
    """Types of spacecraft maneuvers"""
    HOHMANN_TRANSFER = "hohmann_transfer"
    PLANE_CHANGE = "plane_change"
    DEORBIT_BURN = "deorbit_burn"
    RENDEZVOUS = "rendezvous"
    STATION_KEEPING = "station_keeping"

class SimulationStatus(str, Enum):
    """Simulation states"""
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    ERROR = "error"

class Maneuver(BaseModel):
    """Maneuver parameters"""
    maneuver_type: ManeuverType
    delta_v: float = Field(..., description="Delta-v (km/s)")
    duration: float = Field(..., description="Burn duration (seconds)")
    start_time: Optional[datetime] = None
    direction: str = Field(default="prograde", description="Prograde, retrograde, or radial")

class TrajectoryPoint(BaseModel):
    """Point on a trajectory"""
    time: float = Field(..., description="Time in simulation (seconds)")
    x: float
    y: float
    z: float
    vx: float
    vy: float
    vz: float
    distance_from_earth: float = Field(..., description="Distance from Earth center (km)")

class SimulationStartRequest(BaseModel):
    """Request to start simulation"""
    spacecraft_id: str
    maneuver: Maneuver
    duration: float = Field(default=3600, description="Simulation duration (seconds)")

class SimulationState(BaseModel):
    """Current simulation state"""
    spacecraft_id: str
    status: SimulationStatus
    current_time: float = Field(description="Current simulation time (seconds)")
    current_position: dict
    trajectory: List[TrajectoryPoint] = Field(default_factory=list)
    maneuver: Optional[Maneuver] = None
    progress: float = Field(ge=0, le=100, description="Completion percentage")

class SimulationResponse(BaseModel):
    """Response from simulation"""
    status: str
    simulation_state: SimulationState
    message: str = ""
