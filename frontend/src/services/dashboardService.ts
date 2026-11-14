import api from "./api";
import type { DashboardSummary } from "../types/dashboard";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/summary");

    return response.data;
};
