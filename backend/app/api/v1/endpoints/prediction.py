from fastapi import APIRouter

from app.schemas.prediction import PredictionInput
from app.schemas.response import PredictionResponse
from app.services.prediction_service import predict_house_price


router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict(input_data: PredictionInput):
    predicted_price = predict_house_price(input_data)

    return PredictionResponse(
        predicted_price=round(predicted_price, 4),
        currency="Dataset unit (unconfirmed)",
        message="House price prediction generated successfully."
    )
