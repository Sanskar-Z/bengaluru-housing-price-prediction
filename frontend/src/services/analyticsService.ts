import api from "./api";

export interface LocationItem {
    location: string;
    listing_count: number;
}

export interface LocationsResponse {
    total_locations: number;
    locations: LocationItem[];
}

export interface LocationAnalytics {
    location: string;
    total_listings: number;
    price_statistics: {
        average: number;
        median: number;
        minimum: number;
        maximum: number;
    };
    average_area_sqft: number;
    bhk_distribution: Record<string, number>;
    price_unit: string;
}

export const getLocations = async (): Promise<LocationsResponse> => {
    const response = await api.get<LocationsResponse>("/locations");
    return response.data;
};

export const getLocationAnalytics = async (
    location: string
): Promise<LocationAnalytics> => {
    const response = await api.get<LocationAnalytics>(
        `/analytics/location/${encodeURIComponent(location)}`
    );

    return response.data;
};

export interface BudgetTierItem {
    tier: string;
    count: number;
    percentage: number;
    color: string;
}

export interface BudgetTierResponse {
    total_properties: number;
    tiers: BudgetTierItem[];
    message: string;
}

export const getBudgetTierAnalytics = async (): Promise<BudgetTierResponse> => {
    const response = await api.get<BudgetTierResponse>("/analytics/budget-tiers");
    return response.data;
};
