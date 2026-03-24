import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
baseURL: API_URL,
headers: {
'Content-Type': 'application/json',
},
})

// API endpoints
export const apiService = {
// Analysis
analyze: (query) =>
api.post('/analysis/', { query }),

// Telemetry
getTelemetryStatus: (spacecraftId) =>
api.get(`/telemetry/status/${spacecraftId}`),

checkAnomalies: (spacecraftId) =>
api.get(`/telemetry/anomalies/${spacecraftId}`),

// Simulation
startSimulation: (spacecraftId, maneuver, duration) =>
api.post('/simulation/start', {
spacecraft_id: spacecraftId,
maneuver,
duration,
}),

getSimulationState: (spacecraftId) =>
api.get(`/simulation/state/${spacecraftId}`),

pauseSimulation: (spacecraftId) =>
api.post(`/simulation/pause/${spacecraftId}`),

resumeSimulation: (spacecraftId) =>
api.post(`/simulation/resume/${spacecraftId}`),

stopSimulation: (spacecraftId) =>
api.post(`/simulation/stop/${spacecraftId}`),

calculateHohmannTransfer: (r1, r2) =>
api.get('/simulation/hohmann-transfer', { params: { r1, r2 } }),

getOrbitalVelocity: (altitude) =>
api.get('/simulation/orbital-velocity', { params: { altitude } }),

// Mission
planMission: (name, missionType, spacecraftId, objectives) =>
api.post('/mission/plan', {
name,
mission_type: missionType,
spacecraft_id: spacecraftId,
objectives,
}),

getActiveMissions: () =>
api.get('/mission/active'),

getAllMissions: () =>
api.get('/mission'),

getMission: (missionId) =>
api.get(`/mission/${missionId}`),

activateMission: (missionId) =>
api.post(`/mission/${missionId}/activate`),

completeMission: (missionId) =>
api.post(`/mission/${missionId}/complete`),

abortMission: (missionId) =>
api.post(`/mission/${missionId}/abort`),

// Health
getHealth: () =>
api.get('/health'),

getTelemetryHealth: () =>
api.get('/telemetry/health'),

getSimulationHealth: () =>
api.get('/simulation/health'),

getMissionHealth: () =>
api.get('/mission/health'),
}

export default api