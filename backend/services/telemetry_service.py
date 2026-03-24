import asyncio
import random
from datetime import datetime
from math import sin, cos, pi
from backend.models.telemetry_model import TelemetryData, Position, Velocity

class TelemetryService:
    """
    Generates realistic mock spacecraft telemetry
    Simulates orbital motion and system status
    """

    def __init__(self):
        self.time_offset = 0
        self.anomalies_pool = [
            "Thermal drift detected",
            "Solar panel efficiency decrease",
            "Antenna alignment drift",
            "Gyroscope variance",
            "Battery cycle degradation"
        ]

    async def get_current_telemetry(self, spacecraft_id: str) -> TelemetryData:
        """
        Generate current telemetry data
        Simulates ISS-like orbit

        Args:
            spacecraft_id: Spacecraft identifier

        Returns:
            Current telemetry snapshot
        """
        # Simulate orbital motion (approximately ISS orbit)
        altitude = 408  # km
        orbit_period = 92.9  # minutes
        angular_velocity = 2 * pi / (orbit_period * 60)  # rad/s

        # Time-based position on orbit
        angle = (self.time_offset * angular_velocity) % (2 * pi)
        altitude_km = 6371 + altitude  # Earth radius + altitude

        position = Position(
            x=altitude_km * cos(angle),
            y=altitude_km * sin(angle),
            z=altitude_km * sin(angle / 2) * 0.1  # Small inclination
        )

        # Velocity perpendicular to position (orbital velocity)
        velocity_magnitude = 7.66  # km/s (approximately ISS speed)
        velocity = Velocity(
            vx=-velocity_magnitude * sin(angle),
            vy=velocity_magnitude * cos(angle),
            vz=velocity_magnitude * 0.1 * cos(angle / 2)
        )

        # Simulate system metrics with realistic variations
        temperature = 22 + random.uniform(-5, 10)  # Celsius
        power_level = 85 + random.uniform(-10, 5)  # Percentage
        speed = 7.66 + random.uniform(-0.1, 0.1)  # km/s

        # Random anomalies (10% chance)
        active_anomalies = []
        if random.random() < 0.1:
            active_anomalies = [random.choice(self.anomalies_pool)]

        self.time_offset += 1

        return TelemetryData(
            spacecraft_id=spacecraft_id,
            timestamp=datetime.utcnow(),
            position=position,
            velocity=velocity,
            temperature=round(temperature, 2),
            power_level=max(0, min(100, power_level)),
            altitude=altitude,
            speed=round(speed, 3),
            battery_voltage=28.5 + random.uniform(-0.5, 0.5),
            cpu_usage=45 + random.uniform(-10, 10),
            memory_usage=60 + random.uniform(-15, 15),
            signal_strength=max(30, min(100, 85 + random.uniform(-20, 5))),
            anomalies=active_anomalies
        )

    async def stream_telemetry(self, spacecraft_id: str, interval: float = 2):
        """
        Generate telemetry stream
        Yields telemetry data at specified interval

        Args:
            spacecraft_id: Spacecraft identifier
            interval: Time between updates (seconds)

        Yields:
            TelemetryData objects
        """
        while True:
            telemetry = await self.get_current_telemetry(spacecraft_id)
            yield telemetry
            await asyncio.sleep(interval)

    async def check_anomalies(self, telemetry: TelemetryData) -> list:
        """
        Check for anomalies in telemetry

        Args:
            telemetry: Telemetry data to check

        Returns:
            List of detected anomalies
        """
        anomalies = list(telemetry.anomalies)

        # Check temperature bounds
        if telemetry.temperature > 50:
            anomalies.append("Temperature critical")
        elif telemetry.temperature < -20:
            anomalies.append("Temperature low")

        # Check power
        if telemetry.power_level < 20:
            anomalies.append("Power critical")

        # Check signal
        if telemetry.signal_strength < 40:
            anomalies.append("Signal weak")

        return anomalies


# Global telemetry service instance
telemetry_service = TelemetryService()
