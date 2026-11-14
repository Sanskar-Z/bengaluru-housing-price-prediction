from fastapi import APIRouter

from app.schemas.prediction import PredictionInput, SensitivityRequest, SensitivityResponse
from app.schemas.response import PredictionResponse
from app.services.prediction_service import predict_house_price, predict_sensitivity_curve


router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict(input_data: PredictionInput):
    predicted_price = predict_house_price(input_data)

    return PredictionResponse(
        predicted_price=round(predicted_price, 4),
        currency="Dataset unit (unconfirmed)",
        message="House price prediction generated successfully."
    )


@router.post("/predict/sensitivity", response_model=SensitivityResponse)
def predict_sensitivity(input_data: SensitivityRequest):
    """
    Generate real-time multi-point sensitivity curve across square footages (500 - 4000 sqft).
    """
    return predict_sensitivity_curve(input_data)
