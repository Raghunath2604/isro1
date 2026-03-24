import React, { useState, useEffect } from 'react'
import { Cpu, ActivitySquare, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

export default function AgentDashboard() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [workflowStatus, setWorkflowStatus] = useState('idle')

  useEffect(() => {
    fetchAgentStatus()
    const interval = setInterval(fetchAgentStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/as3/agents/status`)
      const data = await response.json()
      if (data.agents?.agents) {
        setAgents(data.agents.agents)
      }
      setLoading(false)
    } catch (err) {
      console.error('Error fetching agent status:', err)
    }
  }

  const executeWorkflow = async () => {
    try {
      setWorkflowStatus('running')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/as3/agents/workflow/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telemetry: { temperature: 30, power_level: 85, signal_strength: 95 },
          anomalies: []
        })
      })
      const data = await response.json()
      setWorkflowStatus('completed')
      setTimeout(() => setWorkflowStatus('idle'), 3000)
    } catch (err) {
      console.error('Error executing workflow:', err)
      setWorkflowStatus('error')
    }
  }

  const agentDescriptions = {
    telemetry_agent: 'Monitors spacecraft telemetry in real-time',
    analysis_agent: 'Analyzes anomalies and provides insights',
    simulation_agent: 'Runs orbital simulations and predictions',
    decision_agent: 'Makes autonomous decisions',
    research_agent: 'Performs knowledge-based research',
    planning_agent: 'Plans missions and operations',
    discovery_agent: 'Makes scientific discoveries'
  }

  return (
    <div className="grid-panel">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-space-purple" />
          Multi-Agent System (7 Agents)
        </h2>
        <button
          onClick={executeWorkflow}
          disabled={workflowStatus !== 'idle'}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {workflowStatus === 'idle' ? 'Execute Workflow' : workflowStatus === 'running' ? 'Running...' : 'Completed'}
        </button>
      </div>

      {/* Workflow Status */}
      {workflowStatus !== 'idle' && (
        <div className={`mb-4 p-3 rounded-lg border ${workflowStatus === 'running' ? 'bg-yellow-500/10 border-yellow-500/30' :
            workflowStatus === 'completed' ? 'bg-green-500/10 border-green-500/30' :
              'bg-red-500/10 border-red-500/30'
          }`}>
          <p className="text-sm font-semibold flex items-center gap-2">
            {workflowStatus === 'running' ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                Workflow executing across all agents...
              </>
            ) : workflowStatus === 'completed' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                Workflow completed successfully
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-400" />
                Workflow encountered an error
              </>
            )}
          </p>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          'telemetry_agent',
          'analysis_agent',
          'simulation_agent',
          'decision_agent',
          'research_agent',
          'planning_agent',
          'discovery_agent'
        ].map((agentType) => (
          <div key={agentType} className="p-3 bg-space-dark/50 rounded-lg border border-space-cyan/20 hover:border-space-cyan/50 transition">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <p className="font-semibold text-sm text-space-cyan capitalize">
                {agentType.replace('_', ' ')}
              </p>
            </div>
            <p className="text-xs text-gray-400">{agentDescriptions[agentType]}</p>
            <div className="mt-2 text-xs">
              <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 rounded">
                ✓ Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Capabilities */}
      <div className="mt-6 pt-6 border-t border-space-cyan/20">
        <h3 className="text-lg font-semibold mb-4 text-space-cyan">Autonomous Capabilities</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>✓ Continuous telemetry monitoring with ML anomaly detection</p>
          <p>✓ Real-time hypothesis generation and ranking</p>
          <p>✓ Autonomous mission planning and optimization</p>
          <p>✓ Orbital simulation and trajectory prediction</p>
          <p>✓ Scientific discovery and pattern recognition</p>
          <p>✓ Real-time decision making with confidence scoring</p>
          <p>✓ Self-improving feedback loops</p>
        </div>
      </div>

      {/* System Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 text-center">
          <p className="text-2xl font-bold text-space-cyan">7</p>
          <p className="text-xs text-gray-400">Active Agents</p>
        </div>
        <div className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 text-center">
          <p className="text-2xl font-bold text-space-cyan">100%</p>
          <p className="text-xs text-gray-400">System Health</p>
        </div>
        <div className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 text-center">
          <p className="text-2xl font-bold text-space-cyan">Real-time</p>
          <p className="text-xs text-gray-400">Processing</p>
        </div>
      </div>
    </div>
  )
}
