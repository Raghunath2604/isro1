from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    """User model for authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")  # admin, user, analyst
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    missions = relationship("Mission", back_populates="created_by_user")
    analyses = relationship("Analysis", back_populates="user")

class Spacecraft(Base):
    """Spacecraft model"""
    __tablename__ = "spacecraft"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    spacecraft_id = Column(String(50), unique=True, nullable=False)
    spacecraft_type = Column(String(50))  # ISS, Satellite, Probe, etc.
    status = Column(String(20), default="active")  # active, inactive, retired
    launch_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    telemetry_records = relationship("TelemetryRecord", back_populates="spacecraft")
    missions = relationship("Mission", back_populates="spacecraft")

class TelemetryRecord(Base):
    """Telemetry record for time-series data"""
    __tablename__ = "telemetry_records"

    id = Column(Integer, primary_key=True)
    spacecraft_id = Column(Integer, ForeignKey("spacecraft.id"))
    timestamp = Column(DateTime, nullable=False, index=True)

    # Position and Velocity
    position_x = Column(Float)
    position_y = Column(Float)
    position_z = Column(Float)
    velocity_x = Column(Float)
    velocity_y = Column(Float)
    velocity_z = Column(Float)

    # System Metrics
    temperature = Column(Float)
    power_level = Column(Float)
    altitude = Column(Float)
    speed = Column(Float)
    battery_voltage = Column(Float)
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    signal_strength = Column(Integer)

    # Anomalies
    anomalies = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    spacecraft = relationship("Spacecraft", back_populates="telemetry_records")

class Mission(Base):
    """Mission model"""
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True)
    mission_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    mission_type = Column(String(50))  # observation, communication, rescue, etc.
    status = Column(String(20), default="planned")  # planned, active, completed, aborted
    spacecraft_id = Column(Integer, ForeignKey("spacecraft.id"))
    created_by = Column(Integer, ForeignKey("users.id"))

    description = Column(String(500))
    start_time = Column(DateTime)
    estimated_end_time = Column(DateTime)
    actual_end_time = Column(DateTime)
    progress = Column(Float, default=0)
    priority = Column(Integer, default=3)

    objectives = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    spacecraft = relationship("Spacecraft", back_populates="missions")
    created_by_user = relationship("User", back_populates="missions")

class Analysis(Base):
    """AI analysis result"""
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True)
    analysis_id = Column(String(50), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    query = Column(String(500), nullable=False)
    retrieved_context = Column(JSON)
    analysis_result = Column(String(5000))
    confidence_score = Column(Float)

    agent_used = Column(String(50))
    execution_time_ms = Column(Integer)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="analyses")

class SimulationLog(Base):
    """Orbital simulation log"""
    __tablename__ = "simulation_logs"

    id = Column(Integer, primary_key=True)
    simulation_id = Column(String(50), unique=True, nullable=False)
    spacecraft_id = Column(Integer, ForeignKey("spacecraft.id"))

    maneuver_type = Column(String(50))
    delta_v = Column(Float)
    duration = Column(Integer)

    trajectory = Column(JSON)
    status = Column(String(20))  # completed, failed, running

    results = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Alert(Base):
    """System alerts for anomalies"""
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True)
    alert_id = Column(String(50), unique=True, nullable=False)
    spacecraft_id = Column(Integer, ForeignKey("spacecraft.id"))

    alert_type = Column(String(50))  # critical, warning, info
    title = Column(String(200), nullable=False)
    description = Column(String(500))

    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)

# Database connection
DATABASE_URL = "postgresql://as3user:as3password@localhost:5432/as3_db"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database"""
    Base.metadata.create_all(bind=engine)
