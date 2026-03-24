from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Position(BaseModel):
    """3D Position coordinates"""
    x: float = Field(..., description="X coordinate (km)")
    y: float = Field(..., description="Y coordinate (km)")
    z: float = Field(..., description="Z coordinate (km)")

class Velocity(BaseModel):
    """3D Velocity vector"""
    vx: float = Field(..., description="Velocity X (km/s)")
    vy: float = Field(..., description="Velocity Y (km/s)")
    vz: float = Field(..., description="Velocity Z (km/s)")

class TelemetryData(BaseModel):
    """Real-time spacecraft telemetry"""
    spacecraft_id: str
    timestamp: datetime
    position: Position
    velocity: Velocity
    temperature: float = Field(..., description="Temperature in Celsius")
    power_level: float = Field(..., ge=0, le=100, description="Power percentage")
    altitude: float = Field(..., description="Altitude above Earth (km)")
    speed: float = Field(..., description="Speed (km/s)")
    battery_voltage: float = Field(..., description="Battery voltage (V)")
    cpu_usage: float = Field(..., ge=0, le=100, description="CPU usage percentage")
    memory_usage: float = Field(..., ge=0, le=100, description="Memory usage percentage")
    signal_strength: int = Field(..., ge=0, le=100, description="Signal strength %")
    anomalies: List[str] = Field(default_factory=list, description="Active anomalies")

class TelemetryRequest(BaseModel):
    """Request for telemetry data"""
    spacecraft_id: str

class TelemetryResponse(BaseModel):
    """Response with telemetry data"""
    status: str
    data: TelemetryData
