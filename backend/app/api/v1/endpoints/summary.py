import logging

from fastapi import APIRouter, HTTPException

from app.schemas.response import (
    DatasetSummaryResponse,
    LocationAnalyticsResponse,
    BHKAnalyticsResponse,
    AreaTypeAnalyticsResponse
)

from app.services.analytics_service import (
    get_dataset_summary,
    get_location_analytics,
    get_bhk_analytics,
    get_area_type_analytics
)


router = APIRouter()

logger = logging.getLogger(__name__)


@router.get(
    "/summary",
    response_model=DatasetSummaryResponse
)
def dataset_summary():
    try:
        return get_dataset_summary()

    except FileNotFoundError:
        logger.exception("Dataset file is missing.")
        raise HTTPException(
            status_code=503,
            detail="Housing dataset is currently unavailable."
        )

    except Exception:
        logger.exception("Failed to generate dataset summary.")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate dataset summary."
        )


@router.get(
    "/analytics/location/{location}",
    response_model=LocationAnalyticsResponse
)
def location_analytics(location: str):
    try:
        return get_location_analytics(location)

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except FileNotFoundError:
        logger.exception("Dataset file is missing.")
        raise HTTPException(
            status_code=503,
            detail="Housing dataset is currently unavailable."
        )

    except Exception:
        logger.exception("Failed to generate location analytics.")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate location analytics."
        )


@router.get(
    "/analytics/bhk",
    response_model=BHKAnalyticsResponse
)
def bhk_analytics():
    try:
        return get_bhk_analytics()

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except FileNotFoundError:
        logger.exception("Dataset file is missing.")
        raise HTTPException(
            status_code=503,
            detail="Housing dataset is currently unavailable."
        )

    except Exception:
        logger.exception("Failed to generate BHK analytics.")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate BHK analytics."
        )


@router.get(
    "/analytics/area-type",
    response_model=AreaTypeAnalyticsResponse
)
def area_type_analytics():
    try:
        return get_area_type_analytics()

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except FileNotFoundError:
        logger.exception("Dataset file is missing.")
        raise HTTPException(
            status_code=503,
            detail="Housing dataset is currently unavailable."
        )

    except Exception:
        logger.exception("Failed to generate area type analytics.")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate area type analytics."
        )
