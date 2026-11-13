from fastapi import APIRouter

from app.schemas.response import HealthResponse
from app.services.model_service import model_service


router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check():

    model_loaded = model_service.model is not None

    return HealthResponse(
        status="healthy" if model_loaded else "unhealthy",
        model_loaded=model_loaded,
        message=(
            "API and ML model are running successfully."
            if model_loaded
            else "ML model is not loaded."
        )
    )
