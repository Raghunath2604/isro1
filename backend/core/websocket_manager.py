from typing import Set, Dict, List
from fastapi import WebSocket
import asyncio
import json

class ConnectionManager:
    """
    Manages WebSocket connections
    Handles multiple connection rooms and broadcasting
    """

    def __init__(self):
        # Store connections grouped by room
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Store connection metadata
        self.connection_data: Dict[WebSocket, Dict] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        """
        Add new WebSocket connection to a room

        Args:
            websocket: WebSocket connection
            room_id: Room identifier (telemetry, simulation, analysis, etc)
        """
        await websocket.accept()

        if room_id not in self.active_connections:
            self.active_connections[room_id] = set()

        self.active_connections[room_id].add(websocket)
        self.connection_data[websocket] = {
            "room_id": room_id,
            "connected_at": asyncio.get_event_loop().time()
        }

        print(f"Client connected to room '{room_id}'. Total connections: {len(self.active_connections[room_id])}")

    def disconnect(self, websocket: WebSocket):
        """
        Remove WebSocket connection from a room

        Args:
            websocket: WebSocket connection to remove
        """
        if websocket in self.connection_data:
            room_id = self.connection_data[websocket]["room_id"]

            if room_id in self.active_connections:
                self.active_connections[room_id].discard(websocket)

                # Clean up empty rooms
                if not self.active_connections[room_id]:
                    del self.active_connections[room_id]

            del self.connection_data[websocket]
            print(f"Client disconnected from room '{room_id}'")

    async def broadcast(self, room_id: str, message: Dict):
        """
        Send message to all connections in a room

        Args:
            room_id: Target room
            message: Message dictionary to send
        """
        if room_id not in self.active_connections:
            return

        # Create tasks for all connections
        tasks = []
        for connection in list(self.active_connections[room_id]):
            tasks.append(self._send_to_connection(connection, message))

        # Execute all send operations concurrently
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _send_to_connection(self, connection: WebSocket, message: Dict):
        """Send message to a specific connection"""
        try:
            await connection.send_json(message)
        except Exception as e:
            print(f"Error sending message to connection: {str(e)}")
            self.disconnect(connection)

    async def send_personal(self, connection: WebSocket, message: Dict):
        """
        Send message to a specific connection

        Args:
            connection: Target WebSocket connection
            message: Message dictionary
        """
        try:
            await connection.send_json(message)
        except Exception as e:
            print(f"Error sending personal message: {str(e)}")
            self.disconnect(connection)

    def get_room_connections(self, room_id: str) -> int:
        """Get count of connections in a room"""
        return len(self.active_connections.get(room_id, set()))

    def get_all_rooms(self) -> List[str]:
        """Get list of all active rooms"""
        return list(self.active_connections.keys())

    def get_total_connections(self) -> int:
        """Get total active connections across all rooms"""
        return len(self.connection_data)


# Global connection manager instance
manager = ConnectionManager()
