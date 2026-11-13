import pytest

from app.core.model_loader import load_catboost_model


def test_model_file_not_found(tmp_path):
    model_path = tmp_path / "missing_model.cbm"

    with pytest.raises(FileNotFoundError):
        load_catboost_model(model_path)


def test_model_path_is_directory(tmp_path):
    model_path = tmp_path / "model_directory"
    model_path.mkdir()

    with pytest.raises(ValueError, match="not a file"):
        load_catboost_model(model_path)


def test_model_file_is_empty(tmp_path):
    model_path = tmp_path / "empty_model.cbm"
    model_path.touch()

    with pytest.raises(ValueError, match="empty"):
        load_catboost_model(model_path)
