from pathlib import Path

from catboost import CatBoostRegressor


def load_catboost_model(model_path: Path) -> CatBoostRegressor:
    """
    Load a trained CatBoost regression model from a file.
    """

    if not model_path.exists():
        raise FileNotFoundError(
            f"Model file not found: {model_path}"
        )

    if not model_path.is_file():
        raise ValueError(
            f"Model path is not a file: {model_path}"
        )

    if model_path.stat().st_size == 0:
        raise ValueError(
            f"Model file is empty: {model_path}"
        )

    model = CatBoostRegressor()
    model.load_model(str(model_path))

    return model
