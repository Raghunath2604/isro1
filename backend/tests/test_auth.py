import pytest
from fastapi import status

def test_register_user(client, db):
    """Test user registration"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "role": "user"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert data["role"] == "user"
    # Password should not be returned
    assert "password" not in data

def test_register_duplicate_username(client, db):
    """Test that duplicate username registration fails"""
    user_data = {
        "username": "testuser",
        "email": "test1@example.com",
        "password": "testpass123",
        "role": "user"
    }
    # First registration should succeed
    response1 = client.post("/auth/register", json=user_data)
    assert response1.status_code == 200

    # Second registration with same username should fail
    user_data["email"] = "test2@example.com"
    response2 = client.post("/auth/register", json=user_data)
    assert response2.status_code == 400
    assert "already registered" in response2.json()["detail"].lower()

def test_register_duplicate_email(client, db):
    """Test that duplicate email registration fails"""
    user_data = {
        "username": "user1",
        "email": "test@example.com",
        "password": "testpass123",
        "role": "user"
    }
    # First registration should succeed
    response1 = client.post("/auth/register", json=user_data)
    assert response1.status_code == 200

    # Second registration with same email should fail
    user_data["username"] = "user2"
    response2 = client.post("/auth/register", json=user_data)
    assert response2.status_code == 400
    assert "already registered" in response2.json()["detail"].lower()

def test_login_user(client, db):
    """Test user login"""
    # First register a user
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "role": "user"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200

    # Now try to login
    login_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client, db):
    """Test login with wrong password fails"""
    # Register a user
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "role": "user"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200

    # Try to login with wrong password
    login_data = {
        "username": "testuser",
        "password": "wrongpassword"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 401

def test_login_nonexistent_user(client):
    """Test login with non-existent user fails"""
    login_data = {
        "username": "nonexistent",
        "password": "anypassword"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 401

def test_register_with_missing_fields(client):
    """Test registration fails with missing required fields"""
    # Missing email
    user_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 422  # Validation error

def test_register_with_invalid_email(client):
    """Test registration fails with invalid email"""
    user_data = {
        "username": "testuser",
        "email": "not-an-email",
        "password": "testpass123"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 422  # Validation error
