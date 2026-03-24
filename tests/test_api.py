import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.security import hash_password, verify_password

client = TestClient(app)

class TestHealth:
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "running"

    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

class TestAnalysisEndpoint:
    def test_analyze_empty_query(self):
        """Test analysis with empty query"""
        response = client.post("/analysis/", json={"query": ""})
        assert response.status_code == 400

    def test_analyze_valid_query(self):
        """Test analysis with valid query"""
        response = client.post("/analysis/", json={
            "query": "What causes thermal drift?"
        })
        assert response.status_code == 200
        assert "response" in response.json()

class TestTelemetry:
    def test_get_telemetry_status(self):
        """Test get telemetry status"""
        response = client.get("/telemetry/status/ISS-01")
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert "data" in response.json()

    def test_telemetry_health(self):
        """Test telemetry health"""
        response = client.get("/telemetry/health")
        assert response.status_code == 200

class TestSimulation:
    def test_get_orbital_velocity(self):
        """Test orbital velocity calculation"""
        response = client.get("/simulation/orbital-velocity?altitude=408")
        assert response.status_code == 200
        data = response.json()
        assert data["orbital_velocity"] > 7

    def test_hohmann_transfer_calc(self):
        """Test Hohmann transfer calculation"""
        response = client.get("/simulation/hohmann-transfer?r1=6779&r2=8000")
        assert response.status_code == 200
        assert "delta_v" in response.json()

class TestMission:
    def test_get_active_missions(self):
        """Test get active missions"""
        response = client.get("/mission/active")
        assert response.status_code == 200
        assert "missions" in response.json()

    def test_plan_mission(self):
        """Test mission planning"""
        response = client.post("/mission/plan", json={
            "name": "Test Mission",
            "mission_type": "observation",
            "spacecraft_id": "ISS-01",
            "objectives": ["Scan Earth", "Collect data"]
        })
        assert response.status_code == 200

class TestSecurity:
    def test_password_hash(self):
        """Test password hashing"""
        password = "test_password_123"
        hashed = hash_password(password)
        assert verify_password(password, hashed)
        assert not verify_password("wrong_password", hashed)

class TestWebSocket:
    def test_websocket_telemetry(self):
        """Test WebSocket telemetry connection"""
        # Note: This is a simplified test
        with client.websocket_connect("/ws/telemetry") as websocket:
            # Send command
            websocket.send_json({
                "command": "snapshot",
                "spacecraft_id": "ISS-01"
            })
            # Receive response
            data = websocket.receive_json()
            assert data["type"] == "telemetry_snapshot"

# Benchmark tests
class TestPerformance:
    def test_api_response_time(self):
        """Test API response time is acceptable"""
        import time
        start = time.time()
        response = client.get("/telemetry/status/ISS-01")
        elapsed = time.time() - start
        assert elapsed < 1.0  # Should respond in less than 1 second
        assert response.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
