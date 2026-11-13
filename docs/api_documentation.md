# API Documentation
## Bengaluru Housing Price Prediction

## 1. Overview

The Bengaluru Housing Price Prediction API is a RESTful backend built using FastAPI. It provides machine learning-based house price predictions and analytical insights from the Bengaluru housing dataset.

**Base URL (local development):**

```text
http://127.0.0.1:8000
```

**API Version:** v1

**API Prefix:**

```text
/api/v1
```

**Interactive Documentation:**

```text
http://127.0.0.1:8000/docs
```

All API responses use JSON format.

---

## 2. API Endpoints

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
| GET | `/api/v1/analytics/bhk` | Retrieve BHK-wise analytics |
| GET | `/api/v1/analytics/area-type` | Retrieve area-type analytics |

---

## 3. General Endpoints

### 3.1 Root Endpoint

**Endpoint:** `GET /`

Returns the API welcome message and documentation URL.

Example response:

```json
{
  "message": "Bengaluru Housing Price Prediction API",
  "docs": "/docs",
  "version": "1.0.0"
}
```

### 3.2 Health Check

**Endpoint:** `GET /api/v1/health`

Checks whether the API and machine learning model are available.

Example response:

```json
{
  "status": "healthy",
  "model_loaded": true,
  "message": "API and ML model are running successfully."
}
```

### 3.3 Model Information

**Endpoint:** `GET /api/v1/model-info`

Returns information about the trained machine learning model.

Example response structure:

```json
{
  "model_loaded": true,
  "model_information": {
    "features": [
      "area_type",
      "availability",
      "location",
      "bath",
      "balcony",
      "bhk_num",
      "total_sqft_cleaned"
    ]
  }
}
```

The actual metadata response may contain additional model information.

---

## 4. Prediction Endpoints

### 4.1 Single House Price Prediction

**Endpoint:** `POST /api/v1/predict`

Generates a predicted house price using the trained CatBoost Regression model.

**Request Body:**

```json
{
  "area_type": "Super built-up Area",
  "availability": "Ready To Move",
  "location": "Whitefield",
  "bath": 2,
  "balcony": 1,
  "bhk_num": 2,
  "total_sqft_cleaned": 1200
}
```

**Input Parameters:**

| Parameter | Data Type | Validation |
|---|---|---|
| area_type | String | Cannot be empty |
| availability | String | Cannot be empty |
| location | String | Cannot be empty |
| bath | Float | Greater than or equal to 0 |
| balcony | Float | Greater than or equal to 0 |
| bhk_num | Float | Greater than 0 |
| total_sqft_cleaned | Float | Greater than 0 |

**Example Response:**

```json
{
  "predicted_price": 80.3831,
  "currency": "Dataset unit (unconfirmed)",
  "message": "House price prediction generated successfully."
}
```

The predicted price is returned in the numerical unit used by the training dataset. Its currency and scale must be verified against the dataset documentation before being presented as a confirmed monetary amount.

### 4.2 Batch House Price Prediction

**Endpoint:** `POST /api/v1/predict/batch`

Generates predictions for multiple houses in a single request.

**Request Body:**

```json
{
  "houses": [
    {
      "area_type": "Super built-up Area",
      "availability": "Ready To Move",
      "location": "Whitefield",
      "bath": 2,
      "balcony": 1,
      "bhk_num": 2,
      "total_sqft_cleaned": 1200
    },
    {
      "area_type": "Built-up Area",
      "availability": "Ready To Move",
      "location": "Electronic City",
      "bath": 3,
      "balcony": 2,
      "bhk_num": 3,
      "total_sqft_cleaned": 1500
    }
  ]
}
```

**Validation:**

- At least one house is required.
- A maximum of 100 houses is allowed per request.
- Each house must satisfy the single prediction input validation rules.

**Example Response:**

```json
{
  "total_predictions": 2,
  "currency": "Dataset unit (unconfirmed)",
  "results": [
    {
      "house_number": 1,
      "predicted_price": 80.3831
    },
    {
      "house_number": 2,
      "predicted_price": 95.2500
    }
  ],
  "message": "Batch predictions generated successfully."
}
```

The numerical prediction values above are illustrative response values.

---

## 5. Dataset and Analytics Endpoints

### 5.1 Dataset Summary

**Endpoint:** `GET /api/v1/summary`

Returns an overview of the cleaned Bengaluru housing dataset.

**Response Fields:**

| Field | Description |
|---|---|
| total_listings | Total number of housing listings |
| price_statistics | Average, median, minimum and maximum prices |
| average_area_sqft | Average property area |
| area_type_distribution | Listing counts by area type |
| bhk_distribution | Listing counts by BHK category |
| top_locations | Top locations by listing count |
| price_unit | Dataset price unit description |

### 5.2 Available Locations

**Endpoint:** `GET /api/v1/locations`

Returns the available locations and their listing counts.

**Optional Query Parameter:**

| Parameter | Type | Description |
|---|---|---|
| search | String | Filters locations by a search term |

**Example Request:**

```text
GET /api/v1/locations?search=Whitefield
```

**Example Response:**

```json
{
  "total_locations": 1,
  "locations": [
    {
      "location": "Whitefield",
      "listing_count": 500
    }
  ]
}
```

The example shows a filtered response; actual results depend on the dataset.

### 5.3 Location Analytics

**Endpoint:**

```text
GET /api/v1/analytics/location/{location}
```

Returns housing statistics for a specific location.

**Example Request:**

```text
GET /api/v1/analytics/location/Whitefield
```

**Response Fields:**

- `location`: Location name.
- `total_listings`: Total listings for the location.
- `price_statistics`: Average, median, minimum and maximum prices.
- `average_area_sqft`: Average property area.
- `bhk_distribution`: Distribution of BHK categories.
- `price_unit`: Dataset price unit description.

An unknown location returns HTTP 404.

### 5.4 BHK Analytics

**Endpoint:** `GET /api/v1/analytics/bhk`

Provides price statistics grouped by BHK configuration.

**Response Fields:**

| Field | Description |
|---|---|
| total_bhk_categories | Number of BHK categories |
| bhk | BHK category |
| total_listings | Number of listings in the category |
| average_price | Average price |
| median_price | Median price |
| price_unit | Dataset price unit description |

### 5.5 Area Type Analytics

**Endpoint:** `GET /api/v1/analytics/area-type`

Provides housing statistics grouped by property area type.

**Response Fields:**

| Field | Description |
|---|---|
| total_area_types | Number of area types |
| area_type | Property area type |
| total_listings | Number of listings |
| average_price | Average price |
| median_price | Median price |
| average_area_sqft | Average property area |
| price_unit | Dataset price unit description |

---

## 6. HTTP Status Codes and Error Handling

The API uses standard HTTP status codes.

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 404 | Requested location or resource not found |
| 422 | Request validation failed |
| 500 | Internal server error |
| 503 | Model or dataset resource unavailable |

### Validation Error

Invalid input data is rejected by Pydantic validation.

Example:

```json
{
  "detail": [
    {
      "type": "greater_than",
      "loc": ["body", "bhk_num"],
      "msg": "Input should be greater than 0"
    }
  ]
}
```

The exact validation response depends on the invalid field.

### Resource Not Found

Example:

```json
{
  "detail": "Location not found in the dataset."
}
```

The exact error message depends on the endpoint.

### Internal Server Error

The global exception handler returns:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected server error occurred."
  }
}
```

---

## 7. Testing the API

The API can be tested using:

- Swagger UI
- Postman
- FastAPI TestClient
- Pytest

To execute automated backend tests, run the following command from the backend directory:

```bash
pytest -v
```

---

## 8. Frontend Integration

The React frontend can communicate with the backend using HTTP requests.

The local development API base URL is:

```text
http://127.0.0.1:8000/api/v1
```

The frontend can use the following endpoints:

- `/predict` for individual price predictions.
- `/predict/batch` for multiple predictions.
- `/summary` for dashboard statistics.
- `/locations` for location search.
- `/analytics/location/{location}` for location insights.
- `/analytics/bhk` for BHK comparisons.
- `/analytics/area-type` for area type comparisons.

The backend CORS configuration allows the local frontend origins configured in the application settings.

---

## 9. Notes

- The API uses a trained CatBoost Regression model.
- The model is loaded during application startup.
- Prediction inputs must follow the model's expected feature structure.
- The batch prediction endpoint accepts a maximum of 100 houses per request.
- Price units are currently marked as unconfirmed.
- API documentation is also available through the automatically generated Swagger UI.

