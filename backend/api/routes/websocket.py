from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from backend.core.websocket_manager import manager
from backend.services.telemetry_service import telemetry_service
from backend.services.simulation_service import simulation_service
import asyncio
import json

router = APIRouter()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """
    Main WebSocket endpoint for real-time communication

    Rooms:
    - telemetry: Live spacecraft telemetry
    - simulation: Orbital simulation updates
    - analysis: AI agent analysis streaming
    - mission: Mission status updates

    Args:
        websocket: WebSocket connection
        room_id: Room identifier for connection grouping
    """
    await manager.connect(websocket, room_id)

    try:
        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            message = json.loads(data)

            # Route based on room
            if room_id == "telemetry":
                await handle_telemetry_message(websocket, message)
            elif room_id == "simulation":
                await handle_simulation_message(websocket, message)
            elif room_id == "analysis":
                await handle_analysis_message(websocket, message)
            elif room_id == "mission":
                await handle_mission_message(websocket, message)
            else:
                await manager.send_personal(
                    websocket,
                    {"type": "error", "message": f"Unknown room: {room_id}"}
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket)


async def handle_telemetry_message(websocket: WebSocket, message: dict):
    """Handle telemetry WebSocket messages"""
    command = message.get("command")

    if command == "stream":
        spacecraft_id = message.get("spacecraft_id", "ISS-01")
        # Stream telemetry at regular intervals
        try:
            for _ in range(100):  # Stream for 100 updates (~5 minutes at 2s interval)
                telemetry = await telemetry_service.get_current_telemetry(spacecraft_id)
                await manager.broadcast("telemetry", {
                    "type": "telemetry_update",
                    "data": telemetry.model_dump(),
                    "timestamp": telemetry.timestamp.isoformat()
                })
                await asyncio.sleep(2)
        except Exception as e:
            await manager.send_personal(websocket, {
                "type": "error",
                "message": f"Telemetry error: {str(e)}"
            })

    elif command == "snapshot":
        spacecraft_id = message.get("spacecraft_id", "ISS-01")
        telemetry = await telemetry_service.get_current_telemetry(spacecraft_id)
        await manager.send_personal(websocket, {
            "type": "telemetry_snapshot",
            "data": telemetry.model_dump()
        })

    elif command == "check_anomalies":
        spacecraft_id = message.get("spacecraft_id", "ISS-01")
        telemetry = await telemetry_service.get_current_telemetry(spacecraft_id)
        anomalies = await telemetry_service.check_anomalies(telemetry)
        await manager.send_personal(websocket, {
            "type": "anomalies",
            "spacecraft_id": spacecraft_id,
            "anomalies": anomalies
        })


async def handle_simulation_message(websocket: WebSocket, message: dict):
    """Handle simulation WebSocket messages"""
    command = message.get("command")

    if command == "start":
        spacecraft_id = message.get("spacecraft_id", "ISS-01")
        maneuver_data = message.get("maneuver")
        duration = message.get("duration", 3600)

        try:
            from backend.models.simulation_model import Maneuver, ManeuverType
            maneuver = Maneuver(
                maneuver_type=ManeuverType(maneuver_data["maneuver_type"]),
                delta_v=maneuver_data["delta_v"],
                duration=maneuver_data["duration"]
            )

            await simulation_service.start_simulation(spacecraft_id, maneuver, duration)

            # Stream simulation updates
            async for state in simulation_service.run_simulation(spacecraft_id, duration):
                await manager.broadcast("simulation", {
                    "type": "simulation_update",
                    "spacecraft_id": spacecraft_id,
                    "status": state.status.value,
                    "current_time": state.current_time,
                    "current_position": state.current_position,
                    "trajectory_count": len(state.trajectory),
                    "progress": state.progress
                })
                await asyncio.sleep(0.1)

        except Exception as e:
            await manager.broadcast("simulation", {
                "type": "error",
                "message": f"Simulation error: {str(e)}"
            })

    elif command == "pause":
        spacecraft_id = message.get("spacecraft_id", "ISS-01")
        success = await simulation_service.pause_simulation(spacecraft_id)
        await manager.send_personal(websocket, {
            "type": "simulation_paused",
            "spacecraft_id": spacecraft_id,
            "success": success
        })

    elif command == "resume":
        spacecraft_id = message.get("spacecraft_id", "ISS-01")
        success = await simulation_service.resume_simulation(spacecraft_id)
        await manager.send_personal(websocket, {
            "type": "simulation_resumed",
            "spacecraft_id": spacecraft_id,
            "success": success
        })

    elif command == "stop":
        spacecraft_id = message.get("spacecraft_id", "ISS-01")
        success = await simulation_service.stop_simulation(spacecraft_id)
        await manager.send_personal(websocket, {
            "type": "simulation_stopped",
            "spacecraft_id": spacecraft_id,
            "success": success
        })


async def handle_analysis_message(websocket: WebSocket, message: dict):
    """Handle analysis/reasoning WebSocket messages"""
    command = message.get("command")

    if command == "analyze":
        query = message.get("query")

        # Import here to avoid circular imports
        from backend.services.rag_service import get_context
        from backend.services.reasoning_service import run_analysis

        try:
            # Stream RAG retrieval
            await manager.send_personal(websocket, {
                "type": "analysis_stage",
                "stage": "retrieving_context",
                "message": "Searching knowledge base..."
            })
            context = get_context(query)

            await manager.send_personal(websocket, {
                "type": "analysis_stage",
                "stage": "retrieved",
                "context_count": len(context),
                "message": f"Found {len(context)} relevant documents"
            })

            # Stream agent analysis
            await manager.send_personal(websocket, {
                "type": "analysis_stage",
                "stage": "agent_analyzing",
                "message": "AI agent analyzing..."
            })

            result = run_analysis(query, context)

            await manager.send_personal(websocket, {
                "type": "analysis_complete",
                "query": query,
                "result": result,
                "context_count": len(context)
            })

        except Exception as e:
            await manager.send_personal(websocket, {
                "type": "error",
                "message": f"Analysis error: {str(e)}"
            })


async def handle_mission_message(websocket: WebSocket, message: dict):
    """Handle mission WebSocket messages"""
    command = message.get("command")

    if command == "status":
        # Send current mission status (placeholder)
        await manager.send_personal(websocket, {
            "type": "mission_status",
            "active_missions": 3,
            "total_objectives": 12,
            "completed_objectives": 8
        })


@router.get("/ws/status")
async def websocket_status():
    """Get WebSocket connection statistics"""
    return {
        "status": "active",
        "total_connections": manager.get_total_connections(),
        "rooms": {room: manager.get_room_connections(room) for room in manager.get_all_rooms()},
        "active_rooms": manager.get_all_rooms()
    }
