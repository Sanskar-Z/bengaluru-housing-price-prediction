"use client";

import { useEffect, useState } from "react";

import {
    BrainCircuit,
    Target,
    TrendingUp,
    Activity,
    Database,
    Layers,
    Settings,
    CalendarDays,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Code2,
} from "lucide-react";

import {
    getModelInformation,
    type ModelInformation,
} from "../../src/services/modelService";

export default function ModelPerformancePage() {
    const [model, setModel] = useState<ModelInformation | null>(null);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchModelInfo = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getModelInformation();

                setModelLoaded(response.model_loaded);
                setModel(response.model_information);
            } catch (err) {
                console.error("Model information error:", err);
                setError("Unable to load model information.");
            } finally {
                setLoading(false);
            }
        };

        fetchModelInfo();
    }, []);

    const formatNumber = (value: number) =>
        value.toLocaleString("en-IN", {
            maximumFractionDigits: 4,
        });

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-500">
                <Loader2 size={24} className="animate-spin" />
                Loading model performance...
            </div>
        );
    }

    if (error || !model) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                <AlertCircle size={22} />
                {error || "Model information is unavailable."}
            </div>
        );
    }

    const datasetSplit = [
        {
            label: "Training Records",
            value: model.training_records,
            percentage:
                (model.training_records / model.dataset_records) * 100,
            color: "bg-blue-600",
        },
        {
            label: "Testing Records",
            value: model.testing_records,
            percentage:
                (model.testing_records / model.dataset_records) * 100,
            color: "bg-purple-600",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8">

            {/* Page Heading */}

            <section>
                <p className="text-sm font-semibold tracking-wider text-blue-600">
                    MACHINE LEARNING
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Model Performance
                </h1>

                <p className="mt-2 text-slate-500">
                    Understand the CatBoost model, its evaluation
                    metrics, training configuration and dataset.
                </p>
            </section>

            {/* Model Status */}

            <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700">
                        <BrainCircuit size={25} />
                    </div>

                    <div>
                        <h2 className="font-bold text-emerald-900">
                            {model.model_name}
                        </h2>

                        <p className="text-sm text-emerald-700">
                            Machine learning regression model
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
                    {modelLoaded ? (
                        <>
                            <CheckCircle2 size={17} />
                            Model Loaded
                        </>
                    ) : (
                        <>
                            <AlertCircle size={17} />
                            Model Not Loaded
                        </>
                    )}
                </div>
            </section>

            {/* Evaluation Metrics */}

            <section>
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900">
                        Evaluation Metrics
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Recorded test metrics for the trained model.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                    {/* R2 */}

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                R² Score
                            </p>

                            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                                <Target size={21} />
                            </div>
                        </div>

                        <h3 className="mt-4 text-3xl font-bold text-slate-900">
                            {(model.test_metrics.r2 * 100).toFixed(2)}%
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Coefficient of determination
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-blue-600"
                                style={{
                                    width: `${Math.max(
                                        0,
                                        Math.min(
                                            model.test_metrics.r2 * 100,
                                            100
                                        )
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* RMSE */}

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                RMSE
                            </p>

                            <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                                <Activity size={21} />
                            </div>
                        </div>

                        <h3 className="mt-4 text-3xl font-bold text-slate-900">
                            {formatNumber(model.test_metrics.rmse)}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Root Mean Squared Error
                        </p>
                    </div>

                    {/* MAE */}

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                MAE
                            </p>

                            <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                <TrendingUp size={21} />
                            </div>
                        </div>

                        <h3 className="mt-4 text-3xl font-bold text-slate-900">
                            {formatNumber(model.test_metrics.mae)}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Mean Absolute Error
                        </p>
                    </div>

                </div>

                <p className="mt-3 text-xs text-slate-400">
                    MAE and RMSE are expressed in the target variable's
                    dataset unit, which has not yet been independently
                    confirmed.
                </p>
            </section>

            {/* Metric Explanations */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-lg font-bold text-slate-900">
                    Understanding the Metrics
                </h2>

                <div className="mt-5 grid gap-5 md:grid-cols-3">

                    <div>
                        <h3 className="font-semibold text-blue-700">
                            R² Score
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Measures how much of the variation in
                            property prices is explained by the model.
                            A higher value generally indicates a better fit.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-purple-700">
                            RMSE
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Measures the square root of the average
                            squared prediction error. Larger errors
                            receive more weight.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-green-700">
                            MAE
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Measures the average absolute difference
                            between actual and predicted property prices.
                        </p>
                    </div>

                </div>
            </section>

            {/* Dataset Information */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                        <Database size={22} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Dataset Information
                        </h2>

                        <p className="text-sm text-slate-500">
                            Dataset records used during model development.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">

                    <div className="rounded-lg bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">
                            Total Records
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-slate-900">
                            {formatNumber(model.dataset_records)}
                        </h3>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-5">
                        <p className="text-sm text-blue-600">
                            Training Records
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-blue-700">
                            {formatNumber(model.training_records)}
                        </h3>
                    </div>

                    <div className="rounded-lg bg-purple-50 p-5">
                        <p className="text-sm text-purple-600">
                            Testing Records
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-purple-700">
                            {formatNumber(model.testing_records)}
                        </h3>
                    </div>

                </div>

                {/* Dataset Split */}

                <div className="mt-7">
                    <div className="mb-3 flex justify-between text-sm">
                        <span className="font-semibold text-slate-700">
                            Dataset Split
                        </span>

                        <span className="text-slate-500">
                            {formatNumber(model.dataset_records)} records
                        </span>
                    </div>

                    <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
                        {datasetSplit.map((item) => (
                            <div
                                key={item.label}
                                className={item.color}
                                style={{
                                    width: `${item.percentage}%`,
                                }}
                                title={`${item.label}: ${item.value}`}
                            />
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-6">
                        {datasetSplit.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-2"
                            >
                                <span
                                    className={`h-3 w-3 rounded-sm ${item.color}`}
                                />

                                <span className="text-sm text-slate-600">
                                    {item.label}:{" "}
                                    {item.value.toLocaleString("en-IN")} (
                                    {item.percentage.toFixed(2)}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                        <Layers size={22} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Model Features
                        </h2>

                        <p className="text-sm text-slate-500">
                            Input variables used by the prediction model.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    {/* Categorical Features */}

                    <div>
                        <h3 className="mb-4 font-semibold text-slate-800">
                            Categorical Features
                        </h3>

                        <div className="space-y-3">
                            {model.categorical_features.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3"
                                >
                                    <span className="text-sm font-medium text-slate-700">
                                        {feature}
                                    </span>

                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                        Categorical
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Numeric Features */}

                    <div>
                        <h3 className="mb-4 font-semibold text-slate-800">
                            Numeric Features
                        </h3>

                        <div className="space-y-3">
                            {model.numeric_features.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3"
                                >
                                    <span className="text-sm font-medium text-slate-700">
                                        {feature}
                                    </span>

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        Numeric
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                        <strong>Target variable:</strong>{" "}
                        {model.target}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                        <strong>Total input features:</strong>{" "}
                        {model.features.length}
                    </p>
                </div>
            </section>

            {/* Hyperparameters */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                        <Settings size={22} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Model Hyperparameters
                        </h2>

                        <p className="text-sm text-slate-500">
                            Configuration used to train CatBoost.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                                <th className="py-3 pr-4 font-medium">
                                    Parameter
                                </th>

                                <th className="py-3 font-medium">
                                    Value
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {Object.entries(model.hyperparameters).map(
                                ([key, value]) => (
                                    <tr
                                        key={key}
                                        className="border-b border-slate-100 last:border-0"
                                    >
                                        <td className="py-3 pr-4 font-medium text-slate-700">
                                            {key}
                                        </td>

                                        <td className="py-3 text-slate-600">
                                            {String(value)}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Software Versions */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                        <Code2 size={22} />
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                        Technology Versions
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                            CatBoost
                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900">
                            {model.versions.catboost}
                        </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                            Scikit-learn
                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900">
                            {model.versions.scikit_learn}
                        </p>
                    </div>

                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={17} />

                    Model created:{" "}
                    {new Date(model.created_at_utc).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "UTC",
                    })} UTC
                </div>
            </section>

            {/* Evaluation Limitation */}

            <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">

                <h3 className="font-semibold text-amber-900">
                    Evaluation Notes and Limitations
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-800">
                    <li>
                        The reported metrics are test metrics from the
                        current model development process.
                    </li>

                    <li>
                        The test partition participated in model selection.
                        Therefore, these metrics should not be described as
                        an untouched final generalization estimate.
                    </li>

                    <li>
                        A separate untouched holdout set or nested
                        cross-validation is recommended for a more
                        independent evaluation.
                    </li>

                    <li>
                        MAE and RMSE use the target variable's original
                        dataset unit. That unit still requires verification.
                    </li>

                    <li>
                        Feature importance and actual-versus-predicted
                        observations are not included in the current
                        model-info API response.
                    </li>
                </ul>
            </section>

        </div>
    );
}
