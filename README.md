# Bengaluru Housing Price Prediction

**EstateIQ — Machine Learning-Based Real Estate Price Prediction and Interactive Housing Analytics Dashboard for Bengaluru.**

## Overview

Bengaluru Housing Price Prediction is a machine learning-based project designed to estimate residential property prices in Bengaluru using property-related features.

The project combines a trained CatBoost regression model, a FastAPI backend, and a Next.js frontend to provide property price predictions and interactive housing market analytics.

The application, called **EstateIQ**, allows users to explore housing market statistics, analyze individual locations, understand model performance, and estimate property prices using their property details.

## Key Features

- **House Price Prediction:** Estimate residential property prices using property characteristics.
- **Interactive Prediction Form:** Enter property details and select locations using a searchable dropdown.
- **Batch Prediction:** Generate predictions for multiple properties through the backend API.
- **Housing Market Analytics:** Explore overall dataset statistics and housing distributions.
- **Location Analytics:** Analyze listing counts, price statistics, and BHK distributions for individual locations.
- **BHK Analytics:** Explore the distribution of properties across different BHK configurations.
- **Area Type Analytics:** Compare property listings across different area types.
- **Location Search:** Browse available Bengaluru housing locations.
- **Model Performance:** View model information, evaluation metrics, and training details.

## Technology Stack

| Component | Technologies |
|---|---|
| Machine Learning | Python, CatBoost |
| Backend | FastAPI, Uvicorn |
| Data Processing | Pandas, NumPy |
| Validation | Pydantic |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS |
| Data Visualization | Recharts |
| HTTP Client | Axios |
| Icons | Lucide React |
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
│   ├── app/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── docs/
├── .gitignore
└── README.md
```

## Machine Learning Model

The project uses a **CatBoost Regressor** trained on the Bengaluru housing dataset.

### Input Features

The model uses seven property-related features:

1. Area Type
2. Availability
3. Location
4. Bathroom Count
5. Balcony Count
6. BHK Configuration
7. Total Square Feet

### Model Evaluation Results

| Metric | Value |
|---|---:|
| R² Score | 0.8087 |
| RMSE | 34.1782 |
| MAE | 19.539 |

**Evaluation note:** The test partition participated in model selection. Therefore, these metrics should be treated as indicative rather than as a fully independent estimate of generalization performance. Further evaluation using an untouched holdout dataset is recommended.

**Price unit:** The price unit has not yet been independently verified against the dataset documentation.

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

If the backend provides an `.env.example` file, copy it to `.env` and configure the required values.

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

## Frontend Setup

### Prerequisites

- Node.js
- npm

### 1. Navigate to the frontend

Open a new terminal from the project root:

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

This variable specifies the FastAPI backend URL used by the frontend.

### 4. Start the development server

```bash
npm run dev
```

The frontend will run at:

`http://localhost:3000`

**Important:** Run the backend and frontend in separate terminals.

## API Documentation

FastAPI provides interactive API documentation through Swagger UI.

Once the backend server is running, visit:

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

From the backend directory, activate the virtual environment and execute:

```bash
pytest -v
```

The backend test suite previously reported **20 passing automated tests**.

## Future Enhancements

- Evaluate the model using an untouched holdout dataset or nested cross-validation.
- Improve prediction accuracy and robustness through additional feature engineering.
- Add more detailed housing market visualizations and comparisons.
- Improve application deployment and production configuration.
- Explore containerization and cloud deployment.

## Project Status

- Machine learning model trained and integrated.
- FastAPI backend and REST API endpoints implemented.
- Backend automated tests implemented.
- Next.js frontend dashboard implemented.
- Property price prediction interface implemented.
- Market analytics and location analytics pages implemented.
- Model performance page implemented.
- Deployment and further model evaluation remain future improvements.

## License

Add the project's chosen license before distributing the project.