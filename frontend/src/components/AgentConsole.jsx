import React, { useState, useRef, useEffect } from 'react'
import { Brain, Send, Trash2 } from 'lucide-react'
import useWebSocket from '../hooks/useWebSocket'
import { apiService } from '../services/api'

export default function AgentConsole() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const { send: sendWS } = useWebSocket('analysis', (data) => {
    setMessages((prev) => [...prev, data])
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleAnalysis = async (e) => {
    e.preventDefault()

    if (!query.trim()) return

    try {
      setLoading(true)
      setMessages((prev) => [
        ...prev,
        {
          type: 'user_query',
          message: query,
          timestamp: new Date().toISOString(),
        },
      ])

      // Send via WebSocket for real-time streaming
      sendWS({
        command: 'analyze',
        query,
      })

      setQuery('')
    } catch (err) {
      console.error('Analysis error:', err)
      setMessages((prev) => [
        ...prev,
        {
          type: 'error',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  const getMessageColor = (type) => {
    switch (type) {
      case 'user_query':
        return 'bg-space-blue/20 border-space-cyan/50'
      case 'analysis_stage':
        return 'bg-space-purple/10 border-space-purple/30'
      case 'analysis_complete':
        return 'bg-green-500/10 border-green-500/30'
      case 'error':
        return 'bg-red-500/10 border-red-500/30'
      default:
        return 'bg-space-cyan/10 border-space-cyan/20'
    }
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case 'user_query':
        return '👤'
      case 'analysis_stage':
        return '🔍'
      case 'analysis_complete':
        return '✓'
      case 'error':
        return '⚠️'
      default:
        return '⚙️'
    }
  }

  return (
    <div className="grid-panel flex flex-col h-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-space-purple" />
          AI Agent Console
        </h2>
        <button
          onClick={clearMessages}
          className="p-2 hover:bg-space-purple/20 rounded-lg transition"
          title="Clear console"
        >
          <Trash2 className="w-5 h-5 text-gray-400 hover:text-space-cyan" />
        </button>
      </div>

      {/* Messages Display */}
      <div className="flex-1 mb-4 p-4 bg-space-dark/50 rounded-lg border border-space-cyan/10 overflow-y-auto space-y-3 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No messages. Start by asking a question about the spacecraft...</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${getMessageColor(msg.type)}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{getMessageIcon(msg.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    {msg.type || 'message'} • {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-gray-100 break-words whitespace-pre-wrap">
                    {msg.message || msg.stage || JSON.stringify(msg, null, 2)}
                  </p>
                  {msg.context_count && (
                    <p className="text-xs text-space-cyan mt-1">✓ {msg.context_count} documents retrieved</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalysis} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the AI agent..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-space-dark border border-space-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-space-cyan disabled:opacity-50 transition"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-3 bg-space-purple text-white rounded-lg hover:bg-space-purple/80 disabled:opacity-50 transition flex items-center gap-2 font-semibold"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Ask'}
        </button>
      </form>

      {/* Info Section */}
      <div className="mt-4 p-3 bg-space-blue/10 rounded-lg border border-space-cyan/10 text-xs text-gray-400">
        <p>💡 The AI agent retrieves context from the knowledge base and provides analysis based on spacecraft telemetry and system data.</p>
      </div>
    </div>
  )
}
