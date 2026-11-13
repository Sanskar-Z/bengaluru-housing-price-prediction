from fastapi import APIRouter, HTTPException, Query

from app.services.analytics_service import get_locations


router = APIRouter()


@router.get("/locations")
def locations_list(
    search: str | None = Query(default=None, min_length=1)
):
    try:
        locations = get_locations()

        if search:
            locations = [
                item for item in locations
                if search.strip().lower() in item["location"].lower()
            ]

        return {
            "total_locations": len(locations),
            "locations": locations
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Dataset not found."
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve locations."
        )
