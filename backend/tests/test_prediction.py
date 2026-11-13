from fastapi.testclient import TestClient

from app.main import app


def test_single_prediction():
    payload = {
        "area_type": "Super built-up  Area",
        "availability": "Ready To Move",
        "location": "Whitefield",
        "bath": 2,
        "balcony": 1,
        "bhk_num": 2,
        "total_sqft_cleaned": 1200
    }

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/predict",
            json=payload
        )

    assert response.status_code == 200

    data = response.json()

    assert "predicted_price" in data
    assert isinstance(data["predicted_price"], (int, float))
    assert data["predicted_price"] > 0
    assert data["message"] == (
        "House price prediction generated successfully."
    )
