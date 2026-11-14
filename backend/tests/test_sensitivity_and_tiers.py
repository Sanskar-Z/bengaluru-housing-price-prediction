from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_sensitivity_curve_endpoint():
    payload = {
        "area_type": "Super built-up  Area",
        "availability": "Ready To Move",
        "location": "Whitefield",
        "bath": 2.0,
        "balcony": 1.0,
        "bhk_num": 2.0,
        "current_sqft": 1200.0
    }
    response = client.post("/api/v1/predict/sensitivity", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["location"] == "Whitefield"
    assert "current_point" in data
    assert data["current_point"]["sqft"] == 1200.0
    assert data["current_point"]["predicted_price"] > 0
    assert len(data["curve"]) == 11
    assert data["curve"][0]["sqft"] == 500.0
    assert data["curve"][-1]["sqft"] == 4000.0


def test_budget_tier_analytics_endpoint():
    response = client.get("/api/v1/analytics/budget-tiers")
    assert response.status_code == 200
    data = response.json()
    assert data["total_properties"] > 10000
    assert len(data["tiers"]) == 4
    tier_names = [t["tier"] for t in data["tiers"]]
    assert "Affordable (< ₹50 Lakhs)" in tier_names
    assert "Mid-Market (₹50 Lakhs - ₹1 Crore)" in tier_names
    assert "Premium (₹1 Crore - ₹2 Crores)" in tier_names
    assert "Ultra-Luxury (> ₹2 Crores)" in tier_names
    total_percentage = sum(t["percentage"] for t in data["tiers"])
    assert 99.0 <= total_percentage <= 101.0

