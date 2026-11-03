"""The API starts and the health endpoint matches SRS API-26."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok_without_personal_data():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert set(body) == {"status", "activeDataVersion", "dataStatus", "modelVersion"}
    assert body["status"] == "ok"
    assert body["activeDataVersion"] == "demo_v1"
    assert body["dataStatus"] == "DRAFT"


def test_unknown_route_is_404():
    assert client.get("/api/v1/does-not-exist").status_code == 404
