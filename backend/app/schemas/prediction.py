from pydantic import BaseModel, Field, ConfigDict, field_validator


class PredictionInput(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        allow_inf_nan=False
    )

    area_type: str = Field(min_length=1)
    availability: str = Field(min_length=1)
    location: str = Field(min_length=1)

    bath: float = Field(ge=0)
    balcony: float = Field(ge=0)
    bhk_num: float = Field(gt=0)
    total_sqft_cleaned: float = Field(gt=0)

    @field_validator("area_type", "availability", "location")
    @classmethod
    def validate_text_fields(cls, value: str) -> str:
        if not value:
            raise ValueError("This field cannot be empty.")
        return value


class BatchPredictionInput(BaseModel):
    houses: list[PredictionInput] = Field(
        min_length=1,
        max_length=100
    )