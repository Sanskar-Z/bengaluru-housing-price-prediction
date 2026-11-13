from fastapi.testclient import TestClient

from app.main import app


def test_prediction_with_missing_field():
    payload = {
        "area_type": "Super built-up  Area",
        "availability": "Ready To Move",
        "location": "Whitefield",
        "bath": 2,
        "balcony": 1,
        "bhk_num": 2
    }

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/predict",
            json=payload
        )

    assert response.status_code == 422


def test_prediction_with_invalid_values():
    payload = {
        "area_type": "Super built-up  Area",
        "availability": "Ready To Move",
        "location": "Whitefield",
        "bath": -2,
        "balcony": 1,
        "bhk_num": 2,
        "total_sqft_cleaned": 1200
    }

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/predict",
            json=payload
        )

    assert response.status_code == 422


def test_batch_prediction_with_empty_list():
    payload = {
        "houses": []
    }

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/predict/batch",
            json=payload
        )

    assert response.status_code == 422
