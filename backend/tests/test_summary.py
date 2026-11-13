from fastapi.testclient import TestClient

from app.main import app


def test_dataset_summary():
    with TestClient(app) as client:
        response = client.get("/api/v1/summary")

    assert response.status_code == 200

    data = response.json()

    assert data["total_listings"] > 0
    assert "price_statistics" in data
    assert "average_area_sqft" in data
    assert "area_type_distribution" in data
    assert "bhk_distribution" in data
    assert "top_locations" in data


def test_locations_list():
    with TestClient(app) as client:
        response = client.get("/api/v1/locations")

    assert response.status_code == 200

    data = response.json()

    assert data["total_locations"] > 0
    assert len(data["locations"]) > 0

    first_location = data["locations"][0]

    assert "location" in first_location
    assert "listing_count" in first_location


def test_location_search():
    with TestClient(app) as client:
        response = client.get(
            "/api/v1/locations",
            params={"search": "Whitefield"}
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total_locations"] > 0

    for item in data["locations"]:
        assert "whitefield" in item["location"].lower()


def test_location_analytics():
    with TestClient(app) as client:
        response = client.get(
            "/api/v1/analytics/location/Whitefield"
        )

    assert response.status_code == 200

    data = response.json()

    assert data["location"].lower() == "whitefield"
    assert data["total_listings"] == 500
    assert "price_statistics" in data
    assert "average_area_sqft" in data
    assert "bhk_distribution" in data


def test_location_analytics_not_found():
    with TestClient(app) as client:
        response = client.get(
            "/api/v1/analytics/location/UnknownPlace123"
        )

    assert response.status_code == 404


def test_bhk_analytics():
    with TestClient(app) as client:
        response = client.get("/api/v1/analytics/bhk")

    assert response.status_code == 200

    data = response.json()

    assert data["total_bhk_categories"] > 0
    assert len(data["bhk_analytics"]) == data["total_bhk_categories"]

    for item in data["bhk_analytics"]:
        assert item["total_listings"] > 0
        assert item["average_price"] > 0
        assert item["median_price"] > 0


def test_area_type_analytics():
    with TestClient(app) as client:
        response = client.get("/api/v1/analytics/area-type")

    assert response.status_code == 200

    data = response.json()

    assert data["total_area_types"] == 4
    assert len(data["area_type_analytics"]) == 4

    for item in data["area_type_analytics"]:
        assert item["total_listings"] > 0
        assert item["average_price"] > 0
        assert item["median_price"] > 0
        assert item["average_area_sqft"] > 0
