import pytest
from src.main import app
from src.models.user import db, User

@pytest.fixture(scope="module")
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json == {"status": "ok", "message": "Crop Monitoring API is running"}

def test_register_user(client):
    res = client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword", "email": "test@example.com"}
    )
    assert res.status_code == 201
    assert "message" in res.json
    assert res.json["message"] == "User registered successfully"

def test_login_user(client):
    # First, register a user
    client.post(
        "/api/auth/register",
        json={"username": "loginuser", "password": "loginpassword", "email": "login@example.com"}
    )
    
    # Then, try to log in
    res = client.post(
        "/api/auth/login",
        json={"username": "loginuser", "password": "loginpassword"}
    )
    assert res.status_code == 200
    assert "access_token" in res.json

def test_login_invalid_credentials(client):
    res = client.post(
        "/api/auth/login",
        json={"username": "nonexistent", "password": "wrongpassword"}
    )
    assert res.status_code == 401
    assert res.json == {"error": "Invalid username or password"}



