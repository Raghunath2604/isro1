import React, { useState } from 'react'
import Header from './Header'
import Visualization3D from './Visualization3D'
import TelemetryPanel from './TelemetryPanel'
import SimulationPanel from './SimulationPanel'
import AgentConsole from './AgentConsole'
import { ISSTracker } from './ISSTracker'
import { AdvancedAnalytics } from './AdvancedAnalytics'
import { AlertRulesManager } from '../services/alertManager'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [alertRules, setAlertRules] = useState([])

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'iss', label: 'ISS Tracking', icon: '🛰️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' }
  ]

  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      {/* Enhanced Tab Navigation */}
      <nav className="backdrop-blur-md bg-slate-900/40 dark:bg-black/30 border-b border-cyan-500/20 sticky top-14 z-40">
        <div className="max-w-full overflow-x-auto">
          <div className="flex gap-1 px-3 md:px-6 min-w-min py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 px-4 md:px-6 py-3 whitespace-nowrap transition-all duration-300 rounded-lg font-semibold ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8 space-y-6">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Top Section: 3D + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* 3D Visualization */}
              <div className="lg:col-span-2 h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/20 backdrop-blur-sm bg-gradient-to-br from-slate-900/50 to-purple-900/20">
                <Visualization3D />
              </div>

              {/* Quick Stats Cards */}
              <div className="space-y-3 md:space-y-4">
                <div className="rounded-xl backdrop-blur-md bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 p-4 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                  <p className="text-xs text-cyan-300/70 uppercase tracking-wide font-semibold">Altitude</p>
                  <p className="text-3xl font-bold text-cyan-400 mt-2">408 km</p>
                  <p className="text-xs text-cyan-300/60 mt-1">Low Earth Orbit</p>
                </div>

                <div className="rounded-xl backdrop-blur-md bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 p-4 hover:shadow-lg hover:shadow-green-500/20 transition-all">
                  <p className="text-xs text-green-300/70 uppercase tracking-wide font-semibold">Velocity</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">7.66 km/s</p>
                  <p className="text-xs text-green-300/60 mt-1">Orbital Speed</p>
                </div>

                <div className="rounded-xl backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 p-4 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                  <p className="text-xs text-purple-300/70 uppercase tracking-wide font-semibold">Status</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                    <p className="text-2xl font-bold text-green-400">Active</p>
                  </div>
                  <p className="text-xs text-purple-300/60 mt-1">Mission Running</p>
                </div>
              </div>
            </div>

            {/* Middle Section: Telemetry and Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/50 to-blue-900/20 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="p-4 border-b border-blue-500/20 bg-blue-500/5">
                  <h3 className="text-sm font-bold text-blue-300 uppercase">Telemetry</h3>
                </div>
                <TelemetryPanel />
              </div>

              <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/50 to-purple-900/20 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="p-4 border-b border-purple-500/20 bg-purple-500/5">
                  <h3 className="text-sm font-bold text-purple-300 uppercase">Simulation</h3>
                </div>
                <SimulationPanel />
              </div>
            </div>

            {/* Bottom Section: Agent Console */}
            <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/50 to-emerald-900/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
              <div className="p-4 border-b border-emerald-500/20 bg-emerald-500/5">
                <h3 className="text-sm font-bold text-emerald-300 uppercase">AI Agent Console</h3>
              </div>
              <AgentConsole />
            </div>
          </>
        )}

        {/* ISS Tracking Tab */}
        {activeTab === 'iss' && (
          <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/50 to-pink-900/20 border border-pink-500/20">
            <div className="p-6 border-b border-pink-500/20 bg-pink-500/5">
              <h2 className="text-xl font-bold text-pink-300">Real-Time ISS Tracking</h2>
            </div>
            <ISSTracker />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/50 to-emerald-900/20 border border-emerald-500/20">
            <div className="p-6 border-b border-emerald-500/20 bg-emerald-500/5">
              <h2 className="text-xl font-bold text-emerald-300">Advanced Analytics</h2>
            </div>
            <AdvancedAnalytics />
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/50 to-red-900/20 border border-red-500/20">
            <div className="p-6 border-b border-red-500/20 bg-red-500/5">
              <h2 className="text-xl font-bold text-orange-300">Alert Rules Manager</h2>
            </div>
            <div className="p-6">
              <AlertRulesManager alertRules={alertRules} setAlertRules={setAlertRules} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
