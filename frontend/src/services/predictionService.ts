import api from "./api";

export interface PredictionRequest {
    area_type: string;
    availability: string;
    location: string;
    bath: number;
    balcony: number;
    bhk_num: number;
    total_sqft_cleaned: number;
}

export interface PredictionResponse {
    predicted_price: number;
    currency: string;
    message: string;
}

export interface LocationItem {
    location: string;
    listing_count: number;
}

export interface LocationsResponse {
    total_locations: number;
    locations: LocationItem[];
}

export const predictPropertyPrice = async (
    data: PredictionRequest
): Promise<PredictionResponse> => {
    const response = await api.post<PredictionResponse>(
        "/predict",
        data
    );

    return response.data;
};

export const getLocations = async (): Promise<LocationsResponse> => {
    const response = await api.get<LocationsResponse>("/locations");

    return response.data;
};
