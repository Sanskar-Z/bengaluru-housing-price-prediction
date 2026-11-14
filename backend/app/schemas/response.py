from pydantic import BaseModel


class PredictionResponse(BaseModel):
    predicted_price: float
    currency: str
    message: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    message: str


class PriceStatistics(BaseModel):
    average: float
    median: float
    minimum: float
    maximum: float


class DatasetSummaryResponse(BaseModel):
    total_listings: int
    price_statistics: PriceStatistics
    average_area_sqft: float
    area_type_distribution: dict[str, int]
    bhk_distribution: dict[str, int]
    top_locations: dict[str, int]
    price_unit: str


class LocationItem(BaseModel):
    location: str
    listing_count: int


class LocationListResponse(BaseModel):
    total_locations: int
    locations: list[LocationItem]



class BatchPredictionItem(BaseModel):
    house_number: int
    predicted_price: float


class BatchPredictionResponse(BaseModel):
    total_predictions: int
    currency: str
    results: list[BatchPredictionItem]
    message: str


class LocationPriceStatistics(BaseModel):
    average: float
    median: float
    minimum: float
    maximum: float


class LocationAnalyticsResponse(BaseModel):
    location: str
    total_listings: int
    price_statistics: LocationPriceStatistics
    average_area_sqft: float
    bhk_distribution: dict[str, int]
    price_unit: str


class BHKAnalyticsItem(BaseModel):
    bhk: str
    total_listings: int
    average_price: float
    median_price: float


class BHKAnalyticsResponse(BaseModel):
    total_bhk_categories: int
    bhk_analytics: list[BHKAnalyticsItem]
    price_unit: str



class AreaTypeAnalyticsItem(BaseModel):
    area_type: str
    total_listings: int
    average_price: float
    median_price: float
    average_area_sqft: float


class AreaTypeAnalyticsResponse(BaseModel):
    total_area_types: int
    area_type_analytics: list[AreaTypeAnalyticsItem]
    price_unit: str


class BudgetTierItem(BaseModel):
    tier: str
    count: int
    percentage: float
    color: str


class BudgetTierResponse(BaseModel):
    total_properties: int
    tiers: list[BudgetTierItem]
    message: str = "Budget tier distribution retrieved successfully."
