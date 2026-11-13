# Bengaluru Housing Price Prediction

**Machine Learning-Based Real Estate Price Prediction and Interactive Dashboard for the Bengaluru Housing Market.**

## Overview

Bengaluru Housing Price Prediction is a machine learning-based project designed to estimate residential property prices in Bengaluru using property-related features.

The project combines a trained CatBoost regression model with a FastAPI backend to provide housing price predictions, batch predictions, and housing market analytics through REST APIs.

An interactive dashboard built with React is planned as the frontend interface for exploring predictions and market insights.

## Key Features

- **House Price Prediction:** Predict estimated property prices using property characteristics.
- **Batch Prediction:** Generate predictions for multiple properties in a single request.
- **Housing Market Analytics:** Explore dataset-level statistics and price distributions.
- **Location Analytics:** Analyze housing listings and price statistics for individual locations.
- **BHK Analytics:** Compare listing counts and price statistics across BHK categories.
- **Area Type Analytics:** Explore price and area statistics across different property area types.
- **Location Search:** Search available Bengaluru housing locations.

## Technology Stack

| Component | Technologies |
|---|---|
| Machine Learning | Python, CatBoost |
| Backend | FastAPI, Uvicorn |
| Data Processing | Pandas, NumPy |
| Validation | Pydantic |
| Frontend | React, JavaScript |
| Testing | Pytest, HTTPX |

## Project Structure

```text
bengaluru-housing-price-prediction/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── data/
│   ├── models/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│
├── docs/
│
├── .gitignore
└── README.md
```

## Machine Learning Model

The project uses a CatBoost Regressor trained on the Bengaluru housing dataset.

The model uses the following input features:

- Area Type
- Availability
- Location
- Bathroom Count
- Balcony Count
- BHK Configuration
- Total Square Feet

**Model Evaluation Results:**

| Metric | Value |
|---|---:|
| R² Score | 0.8087 |
| RMSE | 34.1782 |
| MAE | 19.539 |

*Note: The price unit is not yet independently verified against the dataset documentation.*

## Backend Setup

### Prerequisites

- Python 3.13
- pip
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Sanskar-Z/bengaluru-housing-price-prediction.git
```

```bash
cd bengaluru-housing-price-prediction
```

### 2. Navigate to the backend

```bash
cd backend
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

**Windows PowerShell:**

```powershell
venv\Scripts\Activate.ps1
```

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

### 6. Configure environment variables

Copy `.env.example` to `.env` and update the values if necessary.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

### 7. Start the FastAPI server

```bash
uvicorn app.main:app --reload
```

The backend will run at:

`http://127.0.0.1:8000`

## API Documentation

FastAPI provides interactive API documentation through Swagger UI.

Once the server is running, visit:

`http://127.0.0.1:8000/docs`

### Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/api/v1/health` | Check API and model health |
| GET | `/api/v1/model-info` | Retrieve model metadata |
| POST | `/api/v1/predict` | Predict an individual house price |
| POST | `/api/v1/predict/batch` | Predict prices for multiple houses |
| GET | `/api/v1/summary` | Retrieve overall dataset statistics |
| GET | `/api/v1/locations` | Retrieve available locations |
| GET | `/api/v1/analytics/location/{location}` | Retrieve location-specific analytics |
| GET | `/api/v1/analytics/bhk` | Retrieve BHK analytics |
| GET | `/api/v1/analytics/area-type` | Retrieve area-type analytics |

## Running Tests

From the backend directory:

```bash
pytest -v
```

The backend currently has **20 passing automated tests**.

## Future Enhancements

- Develop an interactive React dashboard.
- Add visualizations for housing price trends and distributions.
- Integrate frontend forms with prediction APIs.
- Improve model evaluation using additional validation data.
- Prepare the application for containerization and deployment.

## Project Status

Backend API and machine learning integration implemented. Frontend development and deployment are planned.

## License

Add the project's chosen license here before distributing the project.
