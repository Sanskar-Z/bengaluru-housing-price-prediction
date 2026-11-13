from app.services.model_service import model_service
from app.schemas.prediction import PredictionInput


def predict_house_price(input_data: PredictionInput) -> float:
    """
    Generate a house price prediction using the trained model.
    """
    return model_service.predict(input_data)