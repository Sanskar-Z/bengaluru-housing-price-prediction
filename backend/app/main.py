from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import api_router
from app.services.model_service import model_service
from app.core.exceptions import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_service.load()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Machine Learning Based Bengaluru Housing Price Prediction API. "
        "Provides house price predictions, batch predictions, "
        "dataset analytics, BHK analytics, area-type analytics, "
        "and location-based property insights."
    ),
    lifespan=lifespan
)

register_exception_handlers(app)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(
    api_router,
    prefix=settings.API_V1_PREFIX
)


@app.get("/", tags=["General"])
def root():
    return {
        "message": "Bengaluru Housing Price Prediction API",
        "docs": "/docs",
        "version": settings.APP_VERSION
    }
