import { useEffect, useState, useRef, useCallback } from 'react'
import wsService from '../services/websocket'

export const useWebSocket = (room, onMessage) => {
const [connected, setConnected] = useState(false)
const [error, setError] = useState(null)
const retryCountRef = useRef(0)

useEffect(() => {
const handleMessage = (data) => {
if (onMessage) {
onMessage(data)
}
}

const handleError = (err) => {
setError(err.message || 'WebSocket error')
}

const handleClose = () => {
setConnected(false)
}

wsService
.connect(room, handleMessage, handleError, handleClose)
.then(() => {
setConnected(true)
setError(null)
retryCountRef.current = 0
})
.catch((err) => {
setError(err.message || 'Connection failed')
setConnected(false)
})

return () => {
wsService.disconnect(room)
}
}, [room, onMessage])

const send = useCallback(
(message) => {
return wsService.send(room, message)
},
[room]
)

return {
connected,
error,
send,
isConnected: connected,
}
}

export default useWebSocket