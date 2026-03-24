from fastapi import APIRouter, HTTPException
from backend.data_sources.external_apis import nasa_source, esa_source, weather_source

router = APIRouter()

# NASA Routes
@router.get("/nasa/iss-position")
async def get_iss_position():
    """Get real-time ISS position"""
    try:
        data = await nasa_source.get_iss_position()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/nasa/space-station")
async def get_space_station():
    """Get ISS crew and data"""
    try:
        data = await nasa_source.get_space_station_data()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/nasa/neo")
async def get_near_earth_objects():
    """Get Near Earth Objects"""
    try:
        data = await nasa_source.get_neo_data()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/nasa/imagery")
async def get_satellite_imagery(lat: float, lon: float):
    """Get satellite imagery"""
    try:
        data = await nasa_source.get_satellite_imagery(lat, lon)
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/nasa/apod")
async def get_astronomy_picture():
    """Get Astronomy Picture of the Day"""
    try:
        data = await nasa_source.get_space_weather()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ESA Routes
@router.get("/esa/copernicus")
async def get_copernicus_data():
    """Get ESA Copernicus satellite data"""
    try:
        data = await esa_source.get_copernicus_data()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/esa/exoplanets")
async def get_exoplanet_data():
    """Get exoplanet data from Caltech"""
    try:
        data = await esa_source.get_exoplanet_data()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Space Weather Routes
@router.get("/weather/solar-activity")
async def get_solar_activity():
    """Get current solar activity"""
    try:
        data = await weather_source.get_solar_activity()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/weather/geomagnetic")
async def get_geomagnetic_forecast():
    """Get geomagnetic forecast"""
    try:
        data = await weather_source.get_geomagnetic_index()
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def external_data_status():
    """Status of all external data sources"""
    return {
        "status": "operational",
        "sources": {
            "nasa": {
                "status": "operational",
                "features": ["ISS tracking", "NEO data", "Imagery", "APOD"]
            },
            "esa": {
                "status": "operational",
                "features": ["Copernicus", "Exoplanet data"]
            },
            "space_weather": {
                "status": "operational",
                "features": ["Solar activity", "Geomagnetic forecast"]
            }
        }
    }

@router.get("/health")
async def data_source_health():
    """Health check for data sources"""
    return {
        "status": "healthy",
        "service": "external_data_sources"
    }
