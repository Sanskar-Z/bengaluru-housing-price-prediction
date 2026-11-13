import logging

from fastapi import APIRouter, HTTPException, Query

from app.schemas.response import LocationListResponse
from app.services.analytics_service import get_locations


router = APIRouter()

logger = logging.getLogger(__name__)


@router.get(
    "/locations",
    response_model=LocationListResponse
)
def locations_list(
    search: str | None = Query(default=None, min_length=1)
):
    try:
        locations = get_locations()

        if search:
            search_term = search.strip().lower()

            locations = [
                item for item in locations
                if search_term in item["location"].lower()
            ]

        return {
            "total_locations": len(locations),
            "locations": locations
        }

    except FileNotFoundError:
        logger.exception("Dataset file is missing.")

        raise HTTPException(
            status_code=503,
            detail="Housing dataset is currently unavailable."
        )

    except Exception:
        logger.exception("Failed to retrieve locations.")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve locations."
        )
