import api from "./api";

export interface ModelInformation {
    model_name: string;
    model_type: string;
    target: string;
    features: string[];
    categorical_features: string[];
    numeric_features: string[];
    hyperparameters: {
        iterations: number;
        learning_rate: number;
        depth: number;
        loss_function: string;
        random_seed: number;
    };
    test_metrics: {
        r2: number;
        rmse: number;
        mae: number;
    };
    dataset_records: number;
    training_records: number;
    testing_records: number;
    versions: {
        catboost: string;
        scikit_learn: string;
    };
    created_at_utc: string;
}

export interface ModelInfoResponse {
    model_loaded: boolean;
    model_information: ModelInformation;
}

export const getModelInformation = async (): Promise<ModelInfoResponse> => {
    const response = await api.get<ModelInfoResponse>("/model-info");
    return response.data;
};
