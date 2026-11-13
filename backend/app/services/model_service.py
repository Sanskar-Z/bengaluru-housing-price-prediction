import json
from typing import Any

import pandas as pd
from catboost import CatBoostRegressor

from app.config import settings
from app.core.model_loader import load_catboost_model
from app.schemas.prediction import PredictionInput


class ModelService:

    def __init__(self):
        self.model: CatBoostRegressor | None = None
        self.metadata: dict[str, Any] = {}

    def load(self) -> None:
        model = load_catboost_model(settings.MODEL_PATH)

        if not settings.METADATA_PATH.exists():
            raise FileNotFoundError(
                f"Metadata file not found: {settings.METADATA_PATH}"
            )

        if not settings.METADATA_PATH.is_file():
            raise ValueError(
                f"Metadata path is not a file: {settings.METADATA_PATH}"
            )

        with open(
            settings.METADATA_PATH,
            "r",
            encoding="utf-8"
        ) as file:
            metadata = json.load(file)

        if not isinstance(metadata, dict):
            raise ValueError("Model metadata must be a JSON object.")

        metadata_features = metadata.get("features")
        model_features = model.feature_names_

        if not isinstance(metadata_features, list):
            raise ValueError("Invalid feature information in metadata.")

        if metadata_features != model_features:
            raise ValueError(
                "Model features do not match metadata features."
            )

        self.model = model
        self.metadata = metadata

    def _prepare_dataframe(
        self,
        input_data: list[PredictionInput]
    ) -> pd.DataFrame:

        if self.model is None:
            raise RuntimeError("Model has not been loaded.")

        feature_names = self.model.feature_names_

        input_rows = [
            house.model_dump()
            for house in input_data
        ]

        input_df = pd.DataFrame(input_rows)

        input_df = input_df[feature_names]

        return input_df

    def predict(self, input_data: PredictionInput) -> float:

        input_df = self._prepare_dataframe([input_data])

        if self.model is None:
            raise RuntimeError("Model has not been loaded.")

        prediction = self.model.predict(input_df)

        return float(prediction[0])

    def predict_batch(
        self,
        input_data: list[PredictionInput]
    ) -> list[float]:

        if not input_data:
            raise ValueError("At least one house is required.")

        input_df = self._prepare_dataframe(input_data)

        if self.model is None:
            raise RuntimeError("Model has not been loaded.")

        predictions = self.model.predict(input_df)

        return [float(price) for price in predictions]


model_service = ModelService()
