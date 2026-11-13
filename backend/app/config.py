
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    APP_NAME: str = "Bengaluru Housing Price Prediction API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    MODEL_PATH: Path = BACKEND_DIR / "models" / "housing_model.cbm"
    METADATA_PATH: Path = BACKEND_DIR / "models" / "model_metadata.json"
    DATASET_PATH: Path = BACKEND_DIR / "data" / "cleaned_bengaluru_housing.csv"

    FRONTEND_ORIGINS: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def allowed_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.FRONTEND_ORIGINS.split(",")
            if origin.strip()
        ]


settings = Settings()
