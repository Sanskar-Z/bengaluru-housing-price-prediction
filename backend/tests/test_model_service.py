import json
from types import SimpleNamespace

import pytest

from app.config import settings
from app.services.model_service import ModelService


def test_model_metadata_feature_mismatch(monkeypatch, tmp_path):
    metadata_path = tmp_path / "metadata.json"

    metadata = {
        "features": ["incorrect_feature"]
    }

    metadata_path.write_text(
        json.dumps(metadata),
        encoding="utf-8"
    )

    fake_model = SimpleNamespace(
        feature_names_=["area_type", "location"]
    )

    monkeypatch.setattr(
        settings,
        "METADATA_PATH",
        metadata_path
    )

    monkeypatch.setattr(
        "app.services.model_service.load_catboost_model",
        lambda path: fake_model
    )

    service = ModelService()

    with pytest.raises(ValueError, match="do not match"):
        service.load()

    assert service.model is None
    assert service.metadata == {}


def test_model_metadata_missing_features(monkeypatch, tmp_path):
    metadata_path = tmp_path / "metadata.json"

    metadata_path.write_text(
        json.dumps({"model_name": "CatBoostRegressor"}),
        encoding="utf-8"
    )

    fake_model = SimpleNamespace(
        feature_names_=["area_type", "location"]
    )

    monkeypatch.setattr(
        settings,
        "METADATA_PATH",
        metadata_path
    )

    monkeypatch.setattr(
        "app.services.model_service.load_catboost_model",
        lambda path: fake_model
    )

    service = ModelService()

    with pytest.raises(ValueError, match="Invalid feature"):
        service.load()

    assert service.model is None


def test_model_metadata_success(monkeypatch, tmp_path):
    metadata_path = tmp_path / "metadata.json"

    expected_features = [
        "area_type",
        "availability",
        "location",
        "bath",
        "balcony",
        "bhk_num",
        "total_sqft_cleaned"
    ]

    metadata_path.write_text(
        json.dumps({"features": expected_features}),
        encoding="utf-8"
    )

    fake_model = SimpleNamespace(
        feature_names_=expected_features
    )

    monkeypatch.setattr(
        settings,
        "METADATA_PATH",
        metadata_path
    )

    monkeypatch.setattr(
        "app.services.model_service.load_catboost_model",
        lambda path: fake_model
    )

    service = ModelService()
    service.load()

    assert service.model is fake_model
    assert service.metadata["features"] == expected_features
