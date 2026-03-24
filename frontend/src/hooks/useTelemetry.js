import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../services/api'
import useWebSocket from './useWebSocket'
import mockData from '../services/mockData'

export const useTelemetry = (spacecraftId = 'ISS-01', autoFetch = true) => {
const [telemetry, setTelemetry] = useState(mockData.telemetry)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [anomalies, setAnomalies] = useState([])

// WebSocket connection for real-time updates
const { connected, send } = useWebSocket('telemetry', (data) => {
if (data.type === 'telemetry_update') {
setTelemetry(data.data)
} else if (data.type === 'anomalies') {
setAnomalies(data.anomalies)
}
})

// Fetch telemetry via REST API
const fetchTelemetry = useCallback(async () => {
try {
setLoading(true)
const response = await apiService.getTelemetryStatus(spacecraftId)
setTelemetry(response.data.data)
setError(null)
} catch (err) {
setError(err.message)
console.error('Error fetching telemetry:', err)
} finally {
setLoading(false)
}
}, [spacecraftId])

// Check for anomalies
const checkAnomalies = useCallback(async () => {
try {
const response = await apiService.checkAnomalies(spacecraftId)
setAnomalies(response.data.anomalies)
} catch (err) {
console.error('Error checking anomalies:', err)
}
}, [spacecraftId])

// Auto-fetch telemetry on mount
useEffect(() => {
if (autoFetch && !connected) {
fetchTelemetry()
checkAnomalies()
}
}, [autoFetch, connected, fetchTelemetry, checkAnomalies])

// Start streaming telemetry via WebSocket
const startStreaming = useCallback(() => {
if (connected) {
send({
command: 'stream',
spacecraft_id: spacecraftId,
})
}
}, [connected, send, spacecraftId])

// Get telemetry snapshot via WebSocket
const getSnapshot = useCallback(() => {
if (connected) {
send({
command: 'snapshot',
spacecraft_id: spacecraftId,
})
} else {
fetchTelemetry()
}
}, [connected, send, spacecraftId, fetchTelemetry])

return {
telemetry,
loading,
error,
anomalies,
connected,
fetchTelemetry,
checkAnomalies,
startStreaming,
getSnapshot,
}
}

export default useTelemetry