const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

class WebSocketService {
constructor() {
this.connections = {}
this.reconnectAttempts = {}
this.maxReconnectAttempts = 5
this.reconnectDelay = 3000
}

connect(room, onMessage, onError, onClose) {
return new Promise((resolve, reject) => {
try {
const wsUrl = `${WS_URL}/ws/${room}`
const ws = new WebSocket(wsUrl)

ws.onopen = () => {
console.log(`Connected to room: ${room}`)
this.connections[room] = ws
this.reconnectAttempts[room] = 0
resolve(ws)
}

ws.onmessage = (event) => {
try {
const data = JSON.parse(event.data)
onMessage(data)
} catch (err) {
console.error('Error parsing WebSocket message:', err)
}
}

ws.onerror = (error) => {
console.error(`WebSocket error in room ${room}:`, error)
onError(error)
}

ws.onclose = () => {
console.log(`Disconnected from room: ${room}`)
delete this.connections[room]
onClose()
// Attempt reconnection
this.attemptReconnect(room, onMessage, onError, onClose)
}
} catch (err) {
reject(err)
}
})
}

attemptReconnect(room, onMessage, onError, onClose) {
const attempts = this.reconnectAttempts[room] || 0

if (attempts < this.maxReconnectAttempts) { this.reconnectAttempts[room]=attempts + 1; console.log(`Reconnecting to
  ${room} (${attempts + 1}/${this.maxReconnectAttempts})...`) setTimeout(()=> {
  this.connect(room, onMessage, onError, onClose).catch((err) => {
  console.error(`Reconnect failed for ${room}:`, err)
  })
  }, this.reconnectDelay)
  } else {
  console.error(`Max reconnection attempts reached for ${room}`)
  }
  }

  send(room, message) {
  const ws = this.connections[room]
  if (ws && ws.readyState === WebSocket.OPEN) {
  ws.send(JSON.stringify(message))
  return true
  } else {
  console.warn(`WebSocket for room ${room} is not open`)
  return false
  }
  }

  disconnect(room) {
  const ws = this.connections[room]
  if (ws) {
  ws.close()
  delete this.connections[room]
  }
  }

  disconnectAll() {
  Object.keys(this.connections).forEach((room) => {
  this.disconnect(room)
  })
  }

  isConnected(room) {
  const ws = this.connections[room]
  return ws && ws.readyState === WebSocket.OPEN
  }

  getConnections() {
  return Object.keys(this.connections)
  }
  }

  export const wsService = new WebSocketService()
  export default wsService