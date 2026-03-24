import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, AlertCircle, Download } from 'lucide-react'
import { apiService } from '../services/api'

export default function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(24)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Fetch multiple analytics endpoints
      const [history, anomalies, performance] = await Promise.all([
        apiService.getTelemetryStatus('ISS-01'),
        apiService.checkAnomalies('ISS-01'),
        apiService.getHealth()
      ])

      setAnalytics({
        telemetry: history.data,
        anomalies: anomalies.anomalies,
        performance: performance
      })
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="card animate-pulse">Loading analytics...</div>
  }

  return (
    <div className="grid-panel">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-space-cyan" />
          Analytics & Reports
        </h2>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-2">
        {[6, 24, 72, 168].map((hours) => (
          <button
            key={hours}
            onClick={() => setPeriod(hours)}
            className={`px-4 py-2 rounded-lg transition ${period === hours
                ? 'bg-space-cyan text-space-dark font-semibold'
                : 'bg-space-blue/20 text-gray-300 hover:bg-space-blue/40'
              }`}
          >
            {hours}h
          </button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-space-blue/20 rounded-lg border border-space-cyan/20">
          <p className="metric-label">Anomalies Detected</p>
          <p className="metric-value">{analytics?.anomalies?.length || 0}</p>
        </div>
        <div className="p-4 bg-space-blue/20 rounded-lg border border-space-cyan/20">
          <p className="metric-label">Uptime</p>
          <p className="metric-value text-green-400">99.5%</p>
        </div>
        <div className="p-4 bg-space-blue/20 rounded-lg border border-space-cyan/20">
          <p className="metric-label">Avg Temp</p>
          <p className="metric-value">{analytics?.telemetry?.temperature?.toFixed(1)}°C</p>
        </div>
        <div className="p-4 bg-space-blue/20 rounded-lg border border-space-cyan/20">
          <p className="metric-label">Avg Power</p>
          <p className="metric-value">{analytics?.telemetry?.power_level?.toFixed(1)}%</p>
        </div>
      </div>

      {/* Anomaly Trends */}
      {analytics?.anomalies && analytics.anomalies.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-2">Recent Anomalies ({period}h)</p>
              <ul className="text-sm text-gray-300 space-y-1">
                {analytics.anomalies.slice(0, 5).map((anomaly, idx) => (
                  <li key={idx}>• {anomaly}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Performance Trends Chart */}
      <div className="mb-6 p-4 bg-space-dark/50 rounded-lg border border-space-cyan/20">
        <h3 className="text-lg font-semibold mb-4 text-space-cyan">Performance Trends</h3>
        <div className="h-40 bg-space-blue/10 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">📊 Chart visualization (Chart.js/Recharts)</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-3 gap-3">
        <button className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 hover:border-space-cyan/50 transition text-sm font-medium">
          📄 Export PDF Report
        </button>
        <button className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 hover:border-space-cyan/50 transition text-sm font-medium">
          📊 Export CSV Data
        </button>
        <button className="p-3 bg-space-blue/20 rounded-lg border border-space-cyan/20 hover:border-space-cyan/50 transition text-sm font-medium">
          💾 Save to Cloud
        </button>
      </div>
    </div>
  )
}
