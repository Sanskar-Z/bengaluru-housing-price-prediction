export interface DashboardSummary {
    total_listings: number;

    price_statistics: {
        average: number;
        median: number;
        minimum: number;
        maximum: number;
    };

    average_area_sqft: number;

    area_type_distribution: Record<string, number>;

    bhk_distribution: Record<string, number>;

    top_locations: Record<string, number>;

    price_unit: string;
}
