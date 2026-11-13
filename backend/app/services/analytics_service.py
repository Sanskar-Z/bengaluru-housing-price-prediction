import pandas as pd

from functools import lru_cache
from app.config import settings


@lru_cache(maxsize=1)
def load_dataset() -> pd.DataFrame:
    if not settings.DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {settings.DATASET_PATH}"
        )

    return pd.read_csv(settings.DATASET_PATH)


def get_dataset_summary() -> dict:
    df = load_dataset()

    price = df["price"].dropna()

    area_distribution = (
        df["area_type"]
        .fillna("Unknown")
        .value_counts()
        .to_dict()
    )

    bhk_distribution = (
        df["bhk_num"]
        .dropna()
        .value_counts()
        .sort_index()
        .to_dict()
    )

    top_locations = (
        df["location"]
        .fillna("Unknown")
        .value_counts()
        .head(10)
        .to_dict()
    )

    return {
        "total_listings": int(len(df)),
        "price_statistics": {
            "average": round(float(price.mean()), 2),
            "median": round(float(price.median()), 2),
            "minimum": round(float(price.min()), 2),
            "maximum": round(float(price.max()), 2)
        },
        "average_area_sqft": round(
            float(df["total_sqft_cleaned"].mean()), 2
        ),
        "area_type_distribution": area_distribution,
        "bhk_distribution": {
            str(key): int(value)
            for key, value in bhk_distribution.items()
        },
        "top_locations": top_locations,
        "price_unit": "INR Lakhs (provisional)"
    }


def get_locations() -> list[dict]:
    df = load_dataset()

    locations = (
        df["location"]
        .dropna()
        .astype(str)
        .str.strip()
    )

    locations = locations[locations != ""]

    location_counts = locations.value_counts()

    return [
        {
            "location": location,
            "listing_count": int(count)
        }
        for location, count in location_counts.items()
    ]

