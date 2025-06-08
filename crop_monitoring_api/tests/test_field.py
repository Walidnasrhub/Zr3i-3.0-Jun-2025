import pytest
from src.main import app
from src.models.user import db, User, Field, SatelliteImage
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

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

@pytest.fixture(scope="module")
def auth_headers(client):
    with app.app_context():
        hashed_password = generate_password_hash("testuserpassword", method="pbkdf2:sha256")
        user = User(username="testuser", email="test@example.com", password_hash=hashed_password)
        db.session.add(user)
        db.session.commit()
        access_token = create_access_token(identity=str(user.id))
        return {"Authorization": f"Bearer {access_token}"}

def test_add_field(client, auth_headers):
    res = client.post(
        "/api/fields/",
        headers=auth_headers,
        json={
            "name": "Test Field",
            "crop_type": "Wheat",
            "description": "A test field for wheat",
            "boundary": {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-74.0, 40.0], [-74.1, 40.0], [-74.1, 40.1], [-74.0, 40.1], [-74.0, 40.0]]]
                }
            }
        }
    )
    print(f"test_add_field status_code: {res.status_code}")
    print(f"test_add_field data: {res.data}")
    assert res.status_code == 201
    assert res.json["name"] == "Test Field"

def test_get_fields(client, auth_headers):
    # Add a field first
    client.post(
        "/api/fields/",
        headers=auth_headers,
        json={
            "name": "Another Field",
            "crop_type": "Corn",
            "description": "A test field for corn",
            "boundary": {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-73.0, 41.0], [-73.1, 41.0], [-73.1, 41.1], [-73.0, 41.1], [-73.0, 41.0]]]
                }
            }
        }
    )
    
    res = client.get("/api/fields/", headers=auth_headers)
    print(f"test_get_fields status_code: {res.status_code}")
    print(f"test_get_fields data: {res.data}")
    assert res.status_code == 200
    assert len(res.json) > 0
    field_names = [field["name"] for field in res.json]
    assert "Another Field" in field_names



