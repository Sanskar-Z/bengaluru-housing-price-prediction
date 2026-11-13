from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionInput
from app.schemas.response import PredictionResponse
from app.services.prediction_service import predict_house_price


router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict(input_data: PredictionInput):

    try:
        predicted_price = predict_house_price(input_data)

        return PredictionResponse(
            predicted_price=round(predicted_price, 4),
            currency="Dataset unit (unconfirmed)",
            message="House price prediction generated successfully."
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )
