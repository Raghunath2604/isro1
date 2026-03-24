from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class MissionStatus(str, Enum):
    """Mission states"""
    PLANNED = "planned"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ABORTED = "aborted"

class MissionType(str, Enum):
    """Types of missions"""
    OBSERVATION = "observation"
    COMMUNICATION = "communication"
    RESCUE = "rescue"
    RESEARCH = "research"
    MAINTENANCE = "maintenance"

class MissionObjective(BaseModel):
    """Single mission objective"""
    name: str
    description: str
    completed: bool = False
    priority: int = Field(ge=1, le=5, description="Priority level 1-5")

class Mission(BaseModel):
    """Mission information"""
    mission_id: str
    name: str
    mission_type: MissionType
    status: MissionStatus
    spacecraft_id: str
    start_time: datetime
    estimated_end_time: Optional[datetime] = None
    objectives: List[MissionObjective]
    progress: float = Field(ge=0, le=100, description="Mission progress %")
    priority: int = Field(ge=1, le=5, description="Mission priority 1-5")
    description: str = ""

class MissionPlanRequest(BaseModel):
    """Request to plan a mission"""
    name: str
    mission_type: MissionType
    spacecraft_id: str
    objectives: List[str]
    priority: Optional[int] = 3

class MissionResponse(BaseModel):
    """Response with mission information"""
    status: str
    mission: Mission

class ActiveMissionsResponse(BaseModel):
    """Response with list of active missions"""
    status: str
    missions: List[Mission]
    total_count: int
