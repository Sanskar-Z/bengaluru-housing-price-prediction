from app.services.model_service import model_service
from app.schemas.prediction import (
    PredictionInput,
    SensitivityRequest,
    SensitivityPoint,
    SensitivityResponse,
)


def predict_house_price(input_data: PredictionInput) -> float:
    """
    Generate a house price prediction using the trained model.
    """
    return model_service.predict(input_data)


def predict_sensitivity_curve(input_data: SensitivityRequest) -> SensitivityResponse:
    """
    Generate an 11-point price sensitivity curve across square footages (500 to 4000 sqft)
    using the model's batch prediction capabilities, highlighting current property dimensions.
    """
    sqft_steps = [500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 3500, 4000]

    batch_inputs = [
        PredictionInput(
            area_type=input_data.area_type,
            availability=input_data.availability,
            location=input_data.location,
            bath=input_data.bath,
            balcony=input_data.balcony,
            bhk_num=input_data.bhk_num,
            total_sqft_cleaned=float(s),
        )
        for s in sqft_steps
    ]

    predicted_prices = model_service.predict_batch(batch_inputs)

    curve_points = [
        SensitivityPoint(sqft=float(s), predicted_price=round(p, 4))
        for s, p in zip(sqft_steps, predicted_prices)
    ]

    current_price = model_service.predict(
        PredictionInput(
            area_type=input_data.area_type,
            availability=input_data.availability,
            location=input_data.location,
            bath=input_data.bath,
            balcony=input_data.balcony,
            bhk_num=input_data.bhk_num,
            total_sqft_cleaned=float(input_data.current_sqft),
        )
    )

    return SensitivityResponse(
        location=input_data.location,
        current_point=SensitivityPoint(
            sqft=float(input_data.current_sqft),
            predicted_price=round(current_price, 4),
        ),
        curve=curve_points,
        message="Price sensitivity curve calculated successfully."
    )