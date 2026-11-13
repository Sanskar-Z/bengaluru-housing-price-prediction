from fastapi import APIRouter

from app.schemas.prediction import BatchPredictionInput
from app.schemas.response import BatchPredictionResponse
from app.services.model_service import model_service


router = APIRouter()


@router.post(
    "/predict/batch",
    response_model=BatchPredictionResponse
)
def predict_batch(input_data: BatchPredictionInput):
    predictions = model_service.predict_batch(input_data.houses)

    results = [
        {
            "house_number": index + 1,
            "predicted_price": round(price, 4)
        }
        for index, price in enumerate(predictions)
    ]

    return {
        "total_predictions": len(results),
        "currency": "Dataset unit (unconfirmed)",
        "results": results,
        "message": "Batch predictions generated successfully."
    }
