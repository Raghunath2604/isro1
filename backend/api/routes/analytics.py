from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from backend.database.models import (
    TelemetryRecord, Mission, Alert, SimulationLog, get_db
)

router = APIRouter()

@router.get("/telemetry-history/{spacecraft_id}")
async def get_telemetry_history(
    spacecraft_id: str,
    hours: int = 24,
    db: Session = Depends(get_db)
):
    """Get historical telemetry data"""
    try:
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)

        records = db.query(TelemetryRecord).filter(
            TelemetryRecord.timestamp >= cutoff_time
        ).order_by(TelemetryRecord.timestamp).all()

        return {
            "status": "success",
            "spacecraft_id": spacecraft_id,
            "period_hours": hours,
            "record_count": len(records),
            "data": [{
                "timestamp": r.timestamp.isoformat(),
                "temperature": r.temperature,
                "power_level": r.power_level,
                "altitude": r.altitude,
                "speed": r.speed,
                "cpu_usage": r.cpu_usage,
                "memory_usage": r.memory_usage
            } for r in records]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/anomaly-analysis/{spacecraft_id}")
async def analyze_anomalies(
    spacecraft_id: str,
    hours: int = 24,
    db: Session = Depends(get_db)
):
    """Analyze anomalies in telemetry"""
    try:
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)

        records = db.query(TelemetryRecord).filter(
            TelemetryRecord.timestamp >= cutoff_time,
            TelemetryRecord.anomalies != None
        ).all()

        anomaly_counts = {}
        for record in records:
            if record.anomalies:
                for anomaly in record.anomalies:
                    anomaly_counts[anomaly] = anomaly_counts.get(anomaly, 0) + 1

        return {
            "status": "success",
            "spacecraft_id": spacecraft_id,
            "period_hours": hours,
            "total_anomalies": len(records),
            "anomaly_breakdown": anomaly_counts,
            "severity_assessment": "critical" if len(anomaly_counts) > 5 else "normal"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/performance-metrics/{spacecraft_id}")
async def get_performance_metrics(
    spacecraft_id: str,
    db: Session = Depends(get_db)
):
    """Get spacecraft performance metrics"""
    try:
        records = db.query(TelemetryRecord).filter(
            TelemetryRecord.timestamp >= datetime.utcnow() - timedelta(days=7)
        ).all()

        if not records:
            raise HTTPException(status_code=404, detail="No data available")

        temps = [r.temperature for r in records if r.temperature]
        powers = [r.power_level for r in records if r.power_level]
        cpus = [r.cpu_usage for r in records if r.cpu_usage]

        return {
            "status": "success",
            "spacecraft_id": spacecraft_id,
            "metrics": {
                "temperature": {
                    "avg": sum(temps) / len(temps) if temps else None,
                    "min": min(temps) if temps else None,
                    "max": max(temps) if temps else None
                },
                "power_level": {
                    "avg": sum(powers) / len(powers) if powers else None,
                    "min": min(powers) if powers else None,
                    "max": max(powers) if powers else None
                },
                "cpu_usage": {
                    "avg": sum(cpus) / len(cpus) if cpus else None,
                    "min": min(cpus) if cpus else None,
                    "max": max(cpus) if cpus else None
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/mission-analytics")
async def get_mission_analytics(db: Session = Depends(get_db)):
    """Get overall mission analytics"""
    try:
        total_missions = db.query(func.count(Mission.id)).scalar()
        active_missions = db.query(func.count(Mission.id)).filter(
            Mission.status == "active"
        ).scalar()
        completed_missions = db.query(func.count(Mission.id)).filter(
            Mission.status == "completed"
        ).scalar()

        avg_progress = db.query(func.avg(Mission.progress)).scalar() or 0

        return {
            "status": "success",
            "missions": {
                "total": total_missions,
                "active": active_missions,
                "completed": completed_missions,
                "aborted": total_missions - active_missions - completed_missions
            },
            "average_progress": round(avg_progress, 2),
            "completion_rate": round((completed_missions / total_missions * 100) if total_missions > 0 else 0, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts-summary")
async def get_alerts_summary(db: Session = Depends(get_db)):
    """Get active alerts summary"""
    try:
        active_alerts = db.query(Alert).filter(Alert.is_resolved == False).all()

        alert_types = {}
        for alert in active_alerts:
            alert_types[alert.alert_type] = alert_types.get(alert.alert_type, 0) + 1

        critical_count = sum(1 for a in active_alerts if a.alert_type == "critical")

        return {
            "status": "success",
            "total_active_alerts": len(active_alerts),
            "by_type": alert_types,
            "critical_alerts": critical_count,
            "alerts": [{
                "alert_id": a.alert_id,
                "type": a.alert_type,
                "title": a.title,
                "created_at": a.created_at.isoformat()
            } for a in active_alerts]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/simulation-analytics")
async def get_simulation_analytics(db: Session = Depends(get_db)):
    """Get simulation statistics"""
    try:
        total_sims = db.query(func.count(SimulationLog.id)).scalar()
        successful_sims = db.query(func.count(SimulationLog.id)).filter(
            SimulationLog.status == "completed"
        ).scalar()

        avg_delta_v = db.query(func.avg(SimulationLog.delta_v)).scalar() or 0

        return {
            "status": "success",
            "simulations": {
                "total": total_sims,
                "successful": successful_sims,
                "failed": total_sims - successful_sims
            },
            "average_delta_v": round(avg_delta_v, 4),
            "success_rate": round((successful_sims / total_sims * 100) if total_sims > 0 else 0, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export-report/{spacecraft_id}")
async def export_report(
    spacecraft_id: str,
    format: str = "json",
    db: Session = Depends(get_db)
):
    """Export comprehensive report"""
    try:
        records = db.query(TelemetryRecord).filter(
            TelemetryRecord.timestamp >= datetime.utcnow() - timedelta(days=30)
        ).all()

        report = {
            "spacecraft_id": spacecraft_id,
            "generated_at": datetime.utcnow().isoformat(),
            "period": "30_days",
            "telemetry_records": len(records),
            "summary": {
                "avg_temperature": sum([r.temperature for r in records if r.temperature]) / len([r for r in records if r.temperature]) if records else 0,
                "avg_power": sum([r.power_level for r in records if r.power_level]) / len([r for r in records if r.power_level]) if records else 0,
            }
        }

        if format == "csv":
            return {"format": "csv", "data": report}
        elif format == "pdf":
            return {"format": "pdf", "data": report}
        else:
            return {"status": "success", "format": "json", "report": report}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def analytics_health():
    """Health check for analytics"""
    return {
        "status": "healthy",
        "service": "analytics"
    }
