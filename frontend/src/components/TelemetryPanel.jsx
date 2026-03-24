import React, { useState, useEffect } from 'react'
import { Gauge, Activity, AlertTriangle } from 'lucide-react'
import useTelemetry from '../hooks/useTelemetry'

const GaugeWidget = ({ label, value, max = 100, unit, status }) => {
  const percentage = (value / max) * 100

  const getStatusColor = () => {
    if (status === 'critical') return 'text-red-400'
    if (status === 'warning') return 'text-yellow-400'
    return 'text-space-cyan'
  }

  return (
    <div className="card flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e3a8a" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 45 * (percentage / 100)} ${2 * Math.PI * 45}`}
            className={getStatusColor()}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="metric-value text-lg">{value}</p>
            <p className="text-xs text-gray-400">{unit}</p>
          </div>
        </div>
      </div>
      <p className="metric-label">{label}</p>
    </div>
  )
}

export default function TelemetryPanel() {
  const { telemetry, anomalies, connected, getSnapshot, checkAnomalies } = useTelemetry()
  const [metrics, setMetrics] = useState([])

  useEffect(() => {
    if (telemetry) {
      setMetrics([
        {
          label: 'Temperature',
          value: Math.round(telemetry.temperature),
          max: 50,
          unit: '°C',
          status: telemetry.temperature > 40 ? 'warning' : 'healthy',
        },
        {
          label: 'Power',
          value: Math.round(telemetry.power_level),
          max: 100,
          unit: '%',
          status: telemetry.power_level < 20 ? 'critical' : 'healthy',
        },
        {
          label: 'Signal',
          value: telemetry.signal_strength,
          max: 100,
          unit: '%',
          status: telemetry.signal_strength < 40 ? 'warning' : 'healthy',
        },
        {
          label: 'CPU',
          value: Math.round(telemetry.cpu_usage),
          max: 100,
          unit: '%',
          status: 'healthy',
        },
      ])
    }
  }, [telemetry])

  return (
    <div className="grid-panel">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-space-cyan" />
            Telemetry
          </h2>
          <p className="text-sm text-gray-400 mt-1">Real-time spacecraft metrics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={getSnapshot}
            className="btn-secondary text-sm"
            title="Refresh telemetry"
          >
            ⟳ Refresh
          </button>
          <button
            onClick={checkAnomalies}
            className="btn-primary text-sm"
            title="Check for anomalies"
          >
            🔍 Check
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4 p-3 rounded-lg bg-space-blue/20 border border-space-cyan/30">
        <p className="text-sm">
          WS Connection:{' '}
          <span className={connected ? 'text-green-400 font-semibold' : 'text-red-400'}>
            {connected ? '● Connected' : '● Disconnected'}
          </span>
        </p>
      </div>

      {/* Anomalies Alert */}
      {anomalies.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-400/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400">Active Anomalies</p>
              <ul className="text-sm text-gray-300 mt-1">
                {anomalies.map((anomaly, idx) => (
                  <li key={idx}>• {anomaly}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <GaugeWidget
            key={metric.label}
            {...metric}
          />
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="mt-6 pt-6 border-t border-space-cyan/20">
        <h3 className="text-lg font-semibold mb-4 text-space-cyan">Position & Velocity</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20">
            <p className="metric-label">Altitude</p>
            <p className="metric-value">{telemetry.altitude} km</p>
          </div>
          <div className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20">
            <p className="metric-label">Velocity</p>
            <p className="metric-value">{telemetry.speed.toFixed(2)} km/s</p>
          </div>
          <div className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20">
            <p className="metric-label">Battery</p>
            <p className="metric-value">{telemetry.battery_voltage.toFixed(1)}V</p>
          </div>
        </div>

        {/* Position Coordinates */}
        <div className="mt-4 p-3 bg-space-blue/10 rounded-lg border border-space-cyan/10 font-mono text-xs">
          <p className="text-gray-400">Position (km)</p>
          <p className="text-space-cyan">
            X: {telemetry.position.x.toFixed(2)} | Y: {telemetry.position.y.toFixed(2)} | Z:{' '}
            {telemetry.position.z.toFixed(2)}
          </p>
          <p className="text-gray-400 mt-2">Velocity (km/s)</p>
          <p className="text-space-cyan">
            VX: {telemetry.velocity.vx.toFixed(4)} | VY: {telemetry.velocity.vy.toFixed(4)} | VZ:{' '}
            {telemetry.velocity.vz.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500 mt-4">
        Last updated: {new Date(telemetry.timestamp).toLocaleTimeString()}
      </p>
    </div>
  )
}
