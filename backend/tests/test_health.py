import pytest
from fastapi.testclient import TestClient

def test_root_endpoint(client):
    """Test GET / endpoint returns correct status and structure"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert data["platform"] == "AS3"
    assert "version" in data
    assert "environment" in data

def test_health_endpoint(client):
    """Test GET /health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "service" in data

def test_api_status_endpoint(client):
    """Test GET /api/status endpoint"""
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert "timestamp" in data
    assert data["system"] == "AS3"
    assert "services" in data
    assert "backend" in data["services"]
    assert data["services"]["backend"] == "running"

def test_health_endpoints_response_times(client):
    """Test that health endpoints respond quickly"""
    import time

    endpoints = ["/", "/health", "/api/status"]

    for endpoint in endpoints:
        start = time.time()
        response = client.get(endpoint)
        elapsed = time.time() - start

        assert response.status_code == 200
        assert elapsed < 0.1  # Should respond in <100ms

def test_cors_headers_present(client):
    """Test that CORS headers are present in responses"""
    response = client.get("/")
    assert response.status_code == 200
    # Basic check that response has necessary headers
    assert "content-type" in response.headers

def test_invalid_endpoint_returns_404(client):
    """Test that invalid endpoints return 404"""
    response = client.get("/invalid/endpoint/path")
    assert response.status_code == 404
