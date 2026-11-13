import json
import pandas as pd

from catboost import CatBoostRegressor

from app.config import settings
from app.core.model_loader import load_catboost_model
from app.schemas.prediction import PredictionInput


class ModelService:

    def __init__(self):
        self.model: CatBoostRegressor | None = None
        self.metadata: dict = {}

    def load(self):
        self.model = load_catboost_model(settings.MODEL_PATH)

        if not settings.METADATA_PATH.exists():
            raise FileNotFoundError(
                f"Metadata file not found: {settings.METADATA_PATH}"
            )

        with open(settings.METADATA_PATH, "r", encoding="utf-8") as file:
            self.metadata = json.load(file)

    def predict(self, input_data: PredictionInput) -> float:
        if self.model is None:
            raise RuntimeError("Model has not been loaded.")

        input_dict = input_data.model_dump()

        feature_names = self.model.feature_names_

        input_df = pd.DataFrame(
            [[input_dict[feature] for feature in feature_names]],
            columns=feature_names
        )

        prediction = self.model.predict(input_df)

        return float(prediction[0])

    def predict_batch(self, input_data: list[PredictionInput]) -> list[float]:
        if self.model is None:
            raise RuntimeError("Model has not been loaded.")

        feature_names = self.model.feature_names_

        input_rows = [
            [
                house.model_dump()[feature]
                for feature in feature_names
            ]
            for house in input_data
        ]

        input_df = pd.DataFrame(
            input_rows,
            columns=feature_names
        )

        predictions = self.model.predict(input_df)

        return [float(price) for price in predictions]

model_service = ModelService()
