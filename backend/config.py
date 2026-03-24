from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"  # Ignore extra fields from .env
    )

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    secret_key: str = "your-secret-key-change-in-production"

    # LLM
    openai_api_key: Optional[str] = None
    llm_model: str = "gpt-4"
    llm_temperature: float = 0.7

    # NASA APIs
    nasa_api_key: Optional[str] = None
    nasa_iss_api_url: str = "https://api.nasa.gov/iss-now.json"
    enable_nasa_apis: bool = True

    # NOAA
    noaa_swpc_api_url: str = "https://services.swpc.noaa.gov/json"
    enable_noaa_apis: bool = True

    # SpaceTrack
    spacetrack_username: Optional[str] = None
    spacetrack_password: Optional[str] = None
    enable_spacetrack: bool = True

    # RAG
    rag_vector_db: str = "chroma"
    rag_embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    rag_chunk_size: int = 512
    rag_chunk_overlap: int = 100

    # ML
    ml_anomaly_threshold: float = 0.1
    ml_isolation_contamination: float = 0.1
    ml_statistical_zscore: int = 3
    enable_ml_training: bool = True

    # Database
    database_url: Optional[str] = "postgresql://as3user:as3password@localhost:5432/as3_db"
    database_pool_size: int = 20
    database_pool_recycle: int = 3600

    # Redis
    redis_url: Optional[str] = None
    enable_redis: bool = False

    # Email/SMTP
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_from_email: str = "as3-platform@example.com"
    enable_email_alerts: bool = True

    # Logging
    log_level: str = "INFO"
    log_file: str = "logs/as3.log"
    log_format: str = "json"
    enable_structured_logging: bool = True

    # Security
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    enable_https: bool = False
    cors_origins: str = '["http://localhost:3000", "http://localhost:3001"]'
    rate_limit_enabled: bool = True
    rate_limit_requests_per_minute: int = 100

    # Frontend
    frontend_base_url: str = "http://localhost:3000"

settings = Settings()
