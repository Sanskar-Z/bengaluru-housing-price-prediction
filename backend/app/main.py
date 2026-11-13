from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import api_router
from app.services.model_service import model_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the trained model when the application starts.
    model_service.load()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Machine Learning Based Bengaluru Housing Price Prediction API",
    lifespan=lifespan
)


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


@app.get("/")
def root():
    return {
        "message": "Bengaluru Housing Price Prediction API",
        "docs": "/docs",
        "version": settings.APP_VERSION
    }
