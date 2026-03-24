import React, { useState } from 'react'
import { Rocket, Play, Pause, Square } from 'lucide-react'
import useWebSocket from '../hooks/useWebSocket'
import { apiService } from '../services/api'

export default function SimulationPanel() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [maneuverType, setManeuverType] = useState('hohmann_transfer')
  const [deltaV, setDeltaV] = useState(3.0)
  const [duration, setDuration] = useState(300)
  const [trajectoryLength, setTrajectoryLength] = useState(0)

  const { send } = useWebSocket('simulation', (data) => {
    if (data.type === 'simulation_update') {
      setProgress(data.progress)
      setCurrentTime(data.current_time)
      setTrajectoryLength(data.trajectory_count)
      if (data.status === 'completed') {
        setIsSimulating(false)
      }
    } else if (data.type === 'error') {
      console.error('Simulation error:', data.message)
    }
  })

  const startSimulation = async () => {
    try {
      setIsSimulating(true)
      setProgress(0)
      setCurrentTime(0)

      const maneuver = {
        maneuver_type: maneuverType,
        delta_v: parseFloat(deltaV),
        duration: parseInt(duration),
      }

      // Start via WebSocket
      send({
        command: 'start',
        spacecraft_id: 'ISS-01',
        maneuver,
        duration: 3600,
      })
    } catch (err) {
      console.error('Error starting simulation:', err)
      setIsSimulating(false)
    }
  }

  const pauseSimulation = () => {
    send({
      command: 'pause',
      spacecraft_id: 'ISS-01',
    })
  }

  const resumeSimulation = () => {
    send({
      command: 'resume',
      spacecraft_id: 'ISS-01',
    })
  }

  const stopSimulation = () => {
    send({
      command: 'stop',
      spacecraft_id: 'ISS-01',
    })
    setIsSimulating(false)
    setProgress(0)
    setCurrentTime(0)
  }

  return (
    <div className="grid-panel">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Rocket className="w-6 h-6 text-space-purple" />
          Simulation
        </h2>
        <p className="text-sm text-gray-400 mt-1">Orbital maneuver simulator</p>
      </div>

      {/* Simulation Progress */}
      {isSimulating && (
        <div className="mb-6 p-4 bg-space-purple/10 rounded-lg border border-space-purple/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Simulation Progress</span>
            <span className="text-sm text-space-cyan">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-space-dark/50 rounded-full h-2 border border-space-purple/20">
            <div
              className="bg-space-purple h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-3 text-sm text-gray-400">
            <p>Time: {(currentTime / 60).toFixed(1)} min | Trajectory Points: {trajectoryLength}</p>
          </div>
        </div>
      )}

      {/* Maneuver Parameters */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-space-cyan">Maneuver Parameters</h3>

        <div className="space-y-4">
          {/* Maneuver Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Maneuver Type</label>
            <select
              value={maneuverType}
              onChange={(e) => setManeuverType(e.target.value)}
              disabled={isSimulating}
              className="w-full px-3 py-2 bg-space-dark border border-space-cyan/30 rounded-lg text-white focus:outline-none focus:border-space-cyan disabled:opacity-50"
            >
              <option value="hohmann_transfer">Hohmann Transfer</option>
              <option value="plane_change">Plane Change</option>
              <option value="deorbit_burn">Deorbit Burn</option>
              <option value="rendezvous">Rendezvous</option>
              <option value="station_keeping">Station Keeping</option>
            </select>
          </div>

          {/* Delta-V */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Delta-V (km/s): <span className="text-space-cyan">{deltaV}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={deltaV}
              onChange={(e) => setDeltaV(e.target.value)}
              disabled={isSimulating}
              className="w-full disabled:opacity-50"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Burn Duration (s): <span className="text-space-cyan">{duration}</span>
            </label>
            <input
              type="range"
              min="1"
              max="1000"
              step="10"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={isSimulating}
              className="w-full disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 flex-wrap">
        {!isSimulating ? (
          <button onClick={startSimulation} className="btn-primary flex items-center gap-2">
            <Play className="w-4 h-4" />
            Start Simulation
          </button>
        ) : (
          <>
            <button onClick={pauseSimulation} className="btn-secondary flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </button>
            <button onClick={resumeSimulation} className="btn-secondary flex items-center gap-2">
              <Play className="w-4 h-4" />
              Resume
            </button>
            <button onClick={stopSimulation} className="btn-secondary flex items-center gap-2 bg-red-600 hover:bg-red-700">
              <Square className="w-4 h-4" />
              Stop
            </button>
          </>
        )}
      </div>

      {/* Quick Calculations */}
      <div className="mt-6 pt-6 border-t border-space-cyan/20">
        <h3 className="text-lg font-semibold mb-4 text-space-cyan">Quick Calculations</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 hover:border-space-cyan/50 transition text-sm text-gray-300 hover:text-white">
            Hohmann Transfer
          </button>
          <button className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 hover:border-space-cyan/50 transition text-sm text-gray-300 hover:text-white">
            Orbital Velocity
          </button>
          <button className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 hover:border-space-cyan/50 transition text-sm text-gray-300 hover:text-white col-span-2">
            Orbit Decay Analysis
          </button>
        </div>
      </div>
    </div>
  )
}
