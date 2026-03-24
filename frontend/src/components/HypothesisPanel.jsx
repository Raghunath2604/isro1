import React, { useState, useEffect } from 'react'
import { Zap, Brain, FlaskConical, GitBranch } from 'lucide-react'
import { apiService } from '../services/api'

export default function HypothesisPanel() {
  const [hypotheses, setHypotheses] = useState([])
  const [loading, setLoading] = useState(false)
  const [anomalyType, setAnomalyType] = useState('thermal')

  const generateHypotheses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/as3/hypothesis/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anomaly_type: anomalyType,
          anomaly_data: { temperature: 45, power_level: 25 }
        })
      })
      const data = await response.json()
      setHypotheses(data.hypotheses || [])
    } catch (err) {
      console.error('Error generating hypotheses:', err)
    } finally {
      setLoading(false)
    }
  }

  const getProbabilityColor = (prob) => {
    if (prob > 0.8) return 'text-red-400'
    if (prob > 0.6) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="grid-panel">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-space-purple" />
          Scientific Hypotheses
        </h2>
        <button
          onClick={generateHypotheses}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Generating...' : 'Generate Hypotheses'}
        </button>
      </div>

      {/* Anomaly Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Anomaly Type</label>
        <select
          value={anomalyType}
          onChange={(e) => setAnomalyType(e.target.value)}
          className="w-full px-3 py-2 bg-space-dark border border-space-cyan/30 rounded-lg text-white focus:outline-none focus:border-space-cyan"
        >
          <option value="thermal">Thermal</option>
          <option value="power">Power</option>
          <option value="communication">Communication</option>
          <option value="structural">Structural</option>
        </select>
      </div>

      {/* Hypotheses List */}
      <div className="space-y-3">
        {hypotheses.length === 0 ? (
          <div className="p-4 bg-space-blue/10 rounded-lg border border-space-cyan/20 text-center text-gray-400">
            Click "Generate Hypotheses" to create scientific hypotheses for the selected anomaly
          </div>
        ) : (
          hypotheses.map((hyp, idx) => (
            <div key={idx} className="p-4 bg-space-dark/50 rounded-lg border border-space-cyan/20">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className={`px-2 py-1 round text-xs font-bold ${getProbabilityColor(hyp.probability)}`}>
                    {(hyp.probability * 100).toFixed(0)}%
                  </span>
                  {hyp.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded ${hyp.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    hyp.severity === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                  }`}>
                  {hyp.severity}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-3">{hyp.description}</p>

              <div className="mb-3">
                <p className="text-xs text-gray-400 font-semibold mb-2">Evidence:</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {hyp.evidence.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2 bg-space-cyan/10 rounded-lg border border-space-cyan/20">
                <p className="text-sm text-space-cyan">
                  <strong>Action:</strong> {hyp.suggested_action}
                </p>
              </div>

              <button className="mt-2 text-xs px-3 py-1 bg-space-purple/20 hover:bg-space-purple/40 rounded border border-space-purple/30 transition">
                Test Hypothesis
              </button>
            </div>
          ))
        )}
      </div>

      {hypotheses.length > 0 && (
        <div className="mt-4 p-3 bg-space-blue/10 rounded-lg border border-space-cyan/10 text-xs text-gray-400">
          <p><strong>💡 Tip:</strong> Highest probability hypotheses should be tested first for optimal diagnosis</p>
        </div>
      )}
    </div>
  )
}
