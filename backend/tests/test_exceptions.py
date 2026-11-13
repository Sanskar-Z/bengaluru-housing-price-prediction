from fastapi.testclient import TestClient

from app.main import app


def test_global_exception_handler():
    @app.get("/test-error")
    def trigger_error():
        raise RuntimeError("Internal database error")

    with TestClient(
        app,
        raise_server_exceptions=False
    ) as client:
        response = client.get("/test-error")

    assert response.status_code == 500

    data = response.json()

    assert data["success"] is False
    assert data["error"]["code"] == "INTERNAL_SERVER_ERROR"
    assert data["error"]["message"] == (
        "An unexpected server error occurred."
    )

    assert "Internal database error" not in response.text
