from fastapi import APIRouter, HTTPException

from app.services.analytics_service import get_dataset_summary


router = APIRouter()


@router.get("/summary")
def dataset_summary():

    try:
        return get_dataset_summary()

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate dataset summary."
        )
