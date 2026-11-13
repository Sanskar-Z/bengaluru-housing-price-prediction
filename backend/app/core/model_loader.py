from pathlib import Path

from catboost import CatBoostRegressor


def load_catboost_model(model_path: Path) -> CatBoostRegressor:
    if not model_path.exists():
        raise FileNotFoundError(
            f"Model file not found: {model_path}"
        )

    model = CatBoostRegressor()
    model.load_model(str(model_path))

    return model
