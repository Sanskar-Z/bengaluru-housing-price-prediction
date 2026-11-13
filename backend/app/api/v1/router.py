from fastapi import APIRouter

from app.api.v1.endpoints import (
    prediction,
    health,
    model_info,
    summary,
    locations,
    batch_prediction
)

api_router = APIRouter()

api_router.include_router(prediction.router, tags=["Prediction"])
api_router.include_router(batch_prediction.router, tags=["Batch Prediction"])
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(model_info.router, tags=["Model Information"])
api_router.include_router(summary.router, tags=["Analytics"])
api_router.include_router(locations.router, tags=["Locations"])
