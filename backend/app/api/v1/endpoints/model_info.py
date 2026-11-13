from fastapi import APIRouter, HTTPException

from app.services.model_service import model_service


router = APIRouter()


@router.get("/model-info")
def get_model_info():

    if not model_service.metadata:
        raise HTTPException(
            status_code=503,
            detail="Model information is not available."
        )

    return {
        "model_loaded": model_service.model is not None,
        "model_information": model_service.metadata
    }
