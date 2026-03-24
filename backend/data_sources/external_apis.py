import aiohttp
import asyncio
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os

class NASADataSource:
    """Integration with NASA APIs"""

    def __init__(self):
        self.nasa_api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
        self.base_url = "https://api.nasa.gov"

    async def get_space_weather(self) -> Dict[str, Any]:
        """Get real-time space weather data"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/planetary/apod"
                params = {"api_key": self.nasa_api_key}

                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        return await response.json()
                    return {"error": f"NASA API error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}

    async def get_iss_position(self) -> Dict[str, Any]:
        """Get ISS real-time position"""
        try:
            async with aiohttp.ClientSession() as session:
                url = "http://api.open-notify.org/iss-now.json"

                async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "spacecraft_id": "ISS-01",
                            "latitude": float(data["iss_position"]["latitude"]),
                            "longitude": float(data["iss_position"]["longitude"]),
                            "altitude": 408,  # ISS orbital altitude
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    return {"error": f"ISS API error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}

    async def get_space_station_data(self) -> Dict[str, Any]:
        """Get ISS crew and data"""
        try:
            async with aiohttp.ClientSession() as session:
                url = "http://api.open-notify.org/astros.json"

                async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status == 200:
                        data = await response.json()
                        iss_crew = [astro for astro in data["people"] if astro["craft"] == "ISS"]
                        return {
                            "spacecraft_id": "ISS-01",
                            "crew_count": len(iss_crew),
                            "crew": [astro["name"] for astro in iss_crew],
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    return {"error": f"Astros API error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}

    async def get_neo_data(self) -> Dict[str, Any]:
        """Get Near Earth Objects data"""
        try:
            today = datetime.utcnow().date()
            url = f"{self.base_url}/neo/rest/v1/feed"
            params = {
                "start_date": str(today),
                "end_date": str(today + timedelta(days=7)),
                "api_key": self.nasa_api_key
            }

            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        return await response.json()
                    return {"error": f"NEO API error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}

    async def get_satellite_imagery(self, lat: float, lon: float, dim: int = 0.1) -> Dict[str, Any]:
        """Get satellite imagery from Landsat"""
        try:
            url = f"{self.base_url}/planetary/imagery"
            params = {
                "lon": lon,
                "lat": lat,
                "dim": dim,
                "api_key": self.nasa_api_key
            }

            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        return {
                            "url": str(response.url),
                            "latitude": lat,
                            "longitude": lon,
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    return {"error": f"Imagery API error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}


class ESADataSource:
    """Integration with ESA APIs"""

    def __init__(self):
        self.base_url = "https://api.esa.int"

    async def get_copernicus_data(self) -> Dict[str, Any]:
        """Get Copernicus satellite data"""
        try:
            async with aiohttp.ClientSession() as session:
                # ESA Copernicus hub endpoint
                url = "https://scihub.copernicus.eu/apihub"

                async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status == 200:
                        return {
                            "source": "ESA Copernicus",
                            "status": "operational",
                            "satellites": ["Sentinel-1", "Sentinel-2", "Sentinel-3", "Sentinel-5P"],
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    return {"error": f"Copernicus API error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}

    async def get_exoplanet_data(self) -> Dict[str, Any]:
        """Get exoplanet data"""
        try:
            async with aiohttp.ClientSession() as session:
                url = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nstedAPI"
                params = {
                    "table": "exoplanets",
                    "select": "pl_name,st_dist,pl_masse",
                    "format": "json",
                    "where": "st_dist<100"
                }

                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "exoplanets": data[:10],  # Top 10
                            "total": len(data),
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    return {"error": f"Exoplanet API error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}


class SpaceWeatherDataSource:
    """Real-time space weather data"""

    async def get_solar_activity(self) -> Dict[str, Any]:
        """Get current solar activity"""
        try:
            async with aiohttp.ClientSession() as session:
                url = "https://services.swpc.noaa.gov/json/goes/magnetometers"

                async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "magnetometer": data,
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    return {"error": f"Space weather error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}

    async def get_geomagnetic_index(self) -> Dict[str, Any]:
        """Get Kp geomagnetic index"""
        try:
            async with aiohttp.ClientSession() as session:
                url = "https://services.swpc.noaa.gov/json/planetary/3day-forecast.json"

                async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "forecast": data,
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    return {"error": f"Geomagnetic API error: {response.status}"}

        except Exception as e:
            return {"error": str(e)}


# Singleton instances
nasa_source = NASADataSource()
esa_source = ESADataSource()
weather_source = SpaceWeatherDataSource()
