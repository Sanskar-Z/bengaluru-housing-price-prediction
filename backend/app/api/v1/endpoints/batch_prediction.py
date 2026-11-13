from fastapi import APIRouter, HTTPException

from app.schemas.prediction import BatchPredictionInput
from app.services.model_service import model_service

router = APIRouter()


@router.post("/predict/batch")
def predict_batch(input_data: BatchPredictionInput):
    try:
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

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Batch prediction failed: {str(error)}"
        )
