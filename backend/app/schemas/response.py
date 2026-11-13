from pydantic import BaseModel


class PredictionResponse(BaseModel):
    predicted_price: float
    currency: str
    message: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    message: str
