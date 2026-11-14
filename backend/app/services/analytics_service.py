import re
from functools import lru_cache

import pandas as pd

from app.config import settings


@lru_cache(maxsize=1)
def load_dataset() -> pd.DataFrame:
    if not settings.DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {settings.DATASET_PATH}"
        )

    if not settings.DATASET_PATH.is_file():
        raise ValueError(
            f"Dataset path is not a file: {settings.DATASET_PATH}"
        )

    return pd.read_csv(settings.DATASET_PATH)


def get_dataset_summary() -> dict:
    df = load_dataset()

    price = pd.to_numeric(
        df["price"], errors="coerce"
    ).dropna()

    area = pd.to_numeric(
        df["total_sqft_cleaned"], errors="coerce"
    ).dropna()

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

    if price.empty:
        price_statistics = {
            "average": 0.0,
            "median": 0.0,
            "minimum": 0.0,
            "maximum": 0.0
        }
    else:
        price_statistics = {
            "average": round(float(price.mean()), 2),
            "median": round(float(price.median()), 2),
            "minimum": round(float(price.min()), 2),
            "maximum": round(float(price.max()), 2)
        }

    return {
        "total_listings": int(len(df)),
        "price_statistics": price_statistics,
        "average_area_sqft": (
            round(float(area.mean()), 2)
            if not area.empty else 0.0
        ),
        "area_type_distribution": area_distribution,
        "bhk_distribution": {
            str(key): int(value)
            for key, value in bhk_distribution.items()
        },
        "top_locations": top_locations,
        "price_unit": "INR Lakhs (provisional)"
    }


def normalize_location(location: str) -> str:
    location = location.strip()
    location = re.sub(r"\s+", " ", location)
    return location.strip(" ,")


def get_locations() -> list[dict]:
    df = load_dataset()

    locations = (
        df["location"]
        .dropna()
        .astype(str)
        .apply(normalize_location)
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



def get_location_analytics(location: str) -> dict:
    search_location = normalize_location(location).casefold()

    if not search_location:
        raise ValueError("Location cannot be empty.")

    df = load_dataset()

    normalized_locations = (
        df["location"]
        .fillna("")
        .astype(str)
        .apply(normalize_location)
    )

    location_df = df[
        normalized_locations.str.casefold() == search_location
    ].copy()

    if location_df.empty:
        raise ValueError(
            f"No listings found for location: {location}"
        )

    price = pd.to_numeric(
        location_df["price"], errors="coerce"
    ).dropna()

    area = pd.to_numeric(
        location_df["total_sqft_cleaned"], errors="coerce"
    ).dropna()

    bhk_distribution = (
        location_df["bhk_num"]
        .dropna()
        .value_counts()
        .sort_index()
        .to_dict()
    )

    if price.empty:
        raise ValueError(
            f"No valid price data found for location: {location}"
        )

    return {
        "location": normalize_location(location_df["location"].dropna().iloc[0]),
        "total_listings": int(len(location_df)),
        "price_statistics": {
            "average": round(float(price.mean()), 2),
            "median": round(float(price.median()), 2),
            "minimum": round(float(price.min()), 2),
            "maximum": round(float(price.max()), 2)
        },
        "average_area_sqft": (
            round(float(area.mean()), 2)
            if not area.empty else 0.0
        ),
        "bhk_distribution": {
            str(key): int(value)
            for key, value in bhk_distribution.items()
        },
        "price_unit": "INR Lakhs (provisional)"
    }



def get_bhk_analytics() -> dict:
    df = load_dataset()

    valid_data = df[
        ["bhk_num", "price"]
    ].copy()

    valid_data["bhk_num"] = pd.to_numeric(
        valid_data["bhk_num"], errors="coerce"
    )

    valid_data["price"] = pd.to_numeric(
        valid_data["price"], errors="coerce"
    )

    valid_data = valid_data.dropna(
        subset=["bhk_num", "price"]
    )

    valid_data = valid_data[
        (valid_data["bhk_num"] > 0) &
        (valid_data["price"] > 0)
    ]

    if valid_data.empty:
        raise ValueError(
            "No valid BHK and price data available."
        )

    grouped = valid_data.groupby("bhk_num")["price"]

    analytics = []

    for bhk, prices in grouped:
        analytics.append({
            "bhk": f"{bhk:g} BHK",
            "total_listings": int(prices.count()),
            "average_price": round(float(prices.mean()), 2),
            "median_price": round(float(prices.median()), 2)
        })

    return {
        "total_bhk_categories": len(analytics),
        "bhk_analytics": analytics,
        "price_unit": "INR Lakhs (provisional)"
    }



def get_area_type_analytics() -> dict:
    df = load_dataset()

    valid_data = df[
        ["area_type", "price", "total_sqft_cleaned"]
    ].copy()

    valid_data["price"] = pd.to_numeric(
        valid_data["price"], errors="coerce"
    )

    valid_data["total_sqft_cleaned"] = pd.to_numeric(
        valid_data["total_sqft_cleaned"], errors="coerce"
    )

    valid_data = valid_data.dropna(
        subset=["area_type", "price", "total_sqft_cleaned"]
    )

    valid_data["area_type"] = (
    valid_data["area_type"]
    .astype(str)
    .str.strip()
    .str.replace(r"\s+", " ", regex=True)
    )

    valid_data = valid_data[
        valid_data["area_type"] != ""
    ]

    valid_data = valid_data[
        (valid_data["price"] > 0) &
        (valid_data["total_sqft_cleaned"] > 0)
    ]

    if valid_data.empty:
        raise ValueError(
            "No valid area type, price and area data available."
        )

    grouped = valid_data.groupby("area_type")

    analytics = []

    for area_type, group in grouped:
        analytics.append({
            "area_type": area_type,
            "total_listings": int(len(group)),
            "average_price": round(
                float(group["price"].mean()), 2
            ),
            "median_price": round(
                float(group["price"].median()), 2
            ),
            "average_area_sqft": round(
                float(group["total_sqft_cleaned"].mean()), 2
            )
        })

    return {
        "total_area_types": len(analytics),
        "area_type_analytics": analytics,
        "price_unit": "Dataset unit (unconfirmed)"
    }


def get_budget_tier_analytics() -> dict:
    data = load_dataset()
    valid_data = data[data["price"].notna()]
    total_properties = len(valid_data)

    affordable_count = int((valid_data["price"] < 50).sum())
    mid_count = int(((valid_data["price"] >= 50) & (valid_data["price"] < 100)).sum())
    premium_count = int(((valid_data["price"] >= 100) & (valid_data["price"] < 200)).sum())
    luxury_count = int((valid_data["price"] >= 200).sum())

    tiers = [
        {
            "tier": "Affordable (< ₹50 Lakhs)",
            "count": affordable_count,
            "percentage": round((affordable_count / total_properties) * 100, 2),
            "color": "#38bdf8"
        },
        {
            "tier": "Mid-Market (₹50 Lakhs - ₹1 Crore)",
            "count": mid_count,
            "percentage": round((mid_count / total_properties) * 100, 2),
            "color": "#3b82f6"
        },
        {
            "tier": "Premium (₹1 Crore - ₹2 Crores)",
            "count": premium_count,
            "percentage": round((premium_count / total_properties) * 100, 2),
            "color": "#8b5cf6"
        },
        {
            "tier": "Ultra-Luxury (> ₹2 Crores)",
            "count": luxury_count,
            "percentage": round((luxury_count / total_properties) * 100, 2),
            "color": "#ec4899"
        }
    ]

    return {
        "total_properties": total_properties,
        "tiers": tiers,
        "message": "Budget tier distribution retrieved successfully."
    }
