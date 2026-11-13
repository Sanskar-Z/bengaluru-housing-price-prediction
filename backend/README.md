# Backend - Bengaluru Housing Price Prediction

## Overview

The backend is built using **FastAPI** and Python. It provides REST APIs for predicting Bengaluru housing prices using a trained CatBoost Regression model.

It also provides dataset statistics, location-based analytics, BHK analytics, and area-type analytics.

## Technology Stack

- Python 3.13
- FastAPI
- Uvicorn
- CatBoost
- Pandas
- NumPy
- Pydantic
- Pytest
- HTTPX

## Architecture

The backend follows a modular monolithic architecture. Application responsibilities are separated into API endpoints, schemas, services, core utilities, and data/model resources.

### Directory Structure

```text
backend/
│
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── health.py
│   │       │   ├── prediction.py
│   │       │   ├── batch_prediction.py
│   │       │   ├── summary.py
│   │       │   ├── locations.py
│   │       │   └── model_info.py
│   │       └── router.py
│   │
│   ├── core/
│   │   ├── exceptions.py
│   │   └── model_loader.py
│   │
│   ├── schemas/
│   │   ├── prediction.py
│   │   └── response.py
│   │
│   ├── services/
│   │   ├── model_service.py
│   │   ├── prediction_service.py
│   │   └── analytics_service.py
│   │
│   ├── utils/
│   │   └── data_utils.py
│   │
│   ├── config.py
│   └── main.py
│
├── data/
│   └── cleaned_bengaluru_housing.csv
│
├── models/
│   ├── housing_model.cbm
│   └── model_metadata.json
│
├── tests/
├── requirements.txt
├── .env.example
└── README.md
```

## Machine Learning Integration

The backend integrates a trained CatBoost Regressor model.

### Input Features

The prediction model accepts seven features:

1. `area_type`
2. `availability`
3. `location`
4. `bath`
5. `balcony`
6. `bhk_num`
7. `total_sqft_cleaned`

### Model Evaluation

| Metric | Value |
|---|---:|
| R² Score | 0.8087 |
| RMSE | 34.1782 |
| MAE | 19.539 |

The model is loaded during FastAPI application startup using the application lifespan mechanism.

## Installation and Setup

### Prerequisites

- Python 3.13
- pip
- Git

### 1. Create a virtual environment

From the backend directory:

```bash
python -m venv venv
```

### 2. Activate the environment

Windows PowerShell:

```powershell
venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create your local `.env` file:

```powershell
Copy-Item .env.example .env
```

### 5. Run the application

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

`http://127.0.0.1:8000`

## API Endpoints

All version 1 endpoints use the prefix `/api/v1`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/api/v1/health` | API and model health |
| GET | `/api/v1/model-info` | Model metadata |
| POST | `/api/v1/predict` | Single house price prediction |
| POST | `/api/v1/predict/batch` | Batch house price prediction |
| GET | `/api/v1/summary` | Overall housing dataset summary |
| GET | `/api/v1/locations` | List available locations |
| GET | `/api/v1/analytics/location/{location}` | Location-specific analytics |
| GET | `/api/v1/analytics/bhk` | BHK-wise analytics |
| GET | `/api/v1/analytics/area-type` | Area-type analytics |

### Interactive API Documentation

FastAPI automatically generates Swagger documentation.

After starting the backend, visit:

`http://127.0.0.1:8000/docs`

## Testing

The backend uses Pytest and FastAPI TestClient for automated API and service testing.

Run all tests:

```bash
pytest -v
```

Current test status: **20 tests passing**.

## Error Handling and Validation

- Pydantic validates incoming prediction requests.
- Invalid input values are rejected.
- Unknown locations return an appropriate HTTP error.
- Missing model or dataset resources are handled through error responses.
- A global exception handler handles unexpected server errors.

## Configuration

Application configuration is managed through `app/config.py` using Pydantic Settings.

Important configuration variables include:

- `APP_NAME`
- `APP_VERSION`
- `API_V1_PREFIX`
- `MODEL_PATH`
- `METADATA_PATH`
- `DATASET_PATH`
- `FRONTEND_ORIGINS`

Local environment values can be provided through `.env`.

## Future Improvements

- Integrate the React frontend with backend APIs.
- Add interactive housing market visualizations.
- Improve model evaluation with additional validation data.
- Containerize the backend using Docker.
- Deploy the backend to a cloud platform.
