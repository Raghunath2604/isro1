import asyncio
from datetime import datetime
from math import sqrt, sin, cos, pi
from backend.models.simulation_model import (
    SimulationState, SimulationStatus, Maneuver, TrajectoryPoint
)

class SimulationService:
    """
    Handles orbital simulations and maneuver calculations
    Simulates realistic orbital mechanics
    """

    def __init__(self):
        self.active_simulations = {}
        self.earth_radius = 6371  # km

    async def start_simulation(self, spacecraft_id: str, maneuver: Maneuver, duration: float):
        """
        Start a new simulation

        Args:
            spacecraft_id: Spacecraft identifier
            maneuver: Maneuver parameters
            duration: Simulation duration in seconds
        """
        simulation_state = SimulationState(
            spacecraft_id=spacecraft_id,
            status=SimulationStatus.RUNNING,
            current_time=0,
            current_position={"x": 6779, "y": 0, "z": 0},  # LEO altitude
            trajectory=[],
            maneuver=maneuver,
            progress=0
        )

        self.active_simulations[spacecraft_id] = simulation_state
        return simulation_state

    async def run_simulation(self, spacecraft_id: str, duration: float):
        """
        Execute simulation and stream updates

        Args:
            spacecraft_id: Spacecraft identifier
            duration: Total simulation duration in seconds

        Yields:
            Updated SimulationState objects
        """
        if spacecraft_id not in self.active_simulations:
            return

        simulation = self.active_simulations[spacecraft_id]
        dt = 1  # Time step (seconds)
        time_elapsed = 0

        # Initial orbit parameters (LEO)
        altitude = 408  # km
        semi_major_axis = self.earth_radius + altitude

        while time_elapsed < duration and simulation.status == SimulationStatus.RUNNING:
            # Calculate current position on orbit
            orbit_period = 2 * pi * sqrt(semi_major_axis ** 3 / 398600)  # Kepler's third law
            mean_motion = 2 * pi / orbit_period
            mean_anomaly = (mean_motion * time_elapsed) % (2 * pi)

            # Simple circular orbit approximation
            x = semi_major_axis * cos(mean_anomaly)
            y = semi_major_axis * sin(mean_anomaly)
            z = 0

            # Add maneuver effects if active
            if simulation.maneuver and time_elapsed < simulation.maneuver.duration:
                # Apply delta-v effects
                dv_factor = (simulation.maneuver.delta_v / 7.66) * (time_elapsed / simulation.maneuver.duration)
                x *= (1 + dv_factor * 0.001)

            simulation.current_position = {"x": round(x, 2), "y": round(y, 2), "z": round(z, 2)}
            simulation.current_time = time_elapsed

            # Add trajectory point
            trajectory_point = TrajectoryPoint(
                time=time_elapsed,
                x=x,
                y=y,
                z=z,
                vx=7.66 * sin(mean_anomaly),
                vy=7.66 * cos(mean_anomaly),
                vz=0,
                distance_from_earth=sqrt(x**2 + y**2 + z**2)
            )
            simulation.trajectory.append(trajectory_point)

            # Update progress
            simulation.progress = (time_elapsed / duration) * 100

            yield simulation

            time_elapsed += dt
            await asyncio.sleep(0.1)  # Control simulation speed

        # Finalize simulation
        simulation.status = SimulationStatus.COMPLETED
        simulation.progress = 100
        yield simulation

        # Clean up
        if spacecraft_id in self.active_simulations:
            del self.active_simulations[spacecraft_id]

    async def pause_simulation(self, spacecraft_id: str) -> bool:
        """Pause an active simulation"""
        if spacecraft_id in self.active_simulations:
            self.active_simulations[spacecraft_id].status = SimulationStatus.PAUSED
            return True
        return False

    async def resume_simulation(self, spacecraft_id: str) -> bool:
        """Resume a paused simulation"""
        if spacecraft_id in self.active_simulations:
            self.active_simulations[spacecraft_id].status = SimulationStatus.RUNNING
            return True
        return False

    async def stop_simulation(self, spacecraft_id: str) -> bool:
        """Stop and clean up a simulation"""
        if spacecraft_id in self.active_simulations:
            del self.active_simulations[spacecraft_id]
            return True
        return False

    def get_simulation_state(self, spacecraft_id: str):
        """Get current simulation state"""
        return self.active_simulations.get(spacecraft_id)

    def is_simulating(self, spacecraft_id: str) -> bool:
        """Check if spacecraft is currently simulating"""
        return spacecraft_id in self.active_simulations

    # Orbital mechanics calculations
    @staticmethod
    def calculate_hohmann_transfer(r1: float, r2: float) -> float:
        """
        Calculate delta-v for Hohmann transfer orbit

        Args:
            r1: Initial orbit radius (km)
            r2: Target orbit radius (km)

        Returns:
            Required delta-v (km/s)
        """
        mu = 398600  # Earth gravitational parameter
        v1 = sqrt(mu / r1)
        va = sqrt(2 * mu * r2 / (r1 * (r1 + r2)))
        dv1 = va - v1

        v2 = sqrt(mu / r2)
        vb = sqrt(2 * mu * r1 / (r2 * (r1 + r2)))
        dv2 = v2 - vb

        return dv1 + dv2

    @staticmethod
    def calculate_orbital_velocity(altitude: float) -> float:
        """
        Calculate orbital velocity at given altitude

        Args:
            altitude: Altitude above Earth (km)

        Returns:
            Orbital velocity (km/s)
        """
        earth_radius = 6371
        mu = 398600
        radius = earth_radius + altitude
        return sqrt(mu / radius)


# Global simulation service instance
simulation_service = SimulationService()
