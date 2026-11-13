from fastapi.testclient import TestClient

from app.main import app


def test_batch_prediction():
    payload = {
        "houses": [
            {
                "area_type": "Super built-up  Area",
                "availability": "Ready To Move",
                "location": "Whitefield",
                "bath": 2,
                "balcony": 1,
                "bhk_num": 2,
                "total_sqft_cleaned": 1200
            },
            {
                "area_type": "Super built-up  Area",
                "availability": "Ready To Move",
                "location": "Electronic City",
                "bath": 3,
                "balcony": 2,
                "bhk_num": 3,
                "total_sqft_cleaned": 1500
            }
        ]
    }

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/predict/batch",
            json=payload
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total_predictions"] == 2
    assert len(data["results"]) == 2

    for result in data["results"]:
        assert isinstance(result["predicted_price"], (int, float))
        assert result["predicted_price"] > 0

    assert data["results"][0]["house_number"] == 1
    assert data["results"][1]["house_number"] == 2
