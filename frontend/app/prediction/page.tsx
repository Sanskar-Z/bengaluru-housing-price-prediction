"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Calculator,
    Home,
    MapPin,
    Bath,
    Ruler,
    Loader2,
    AlertCircle,
    CheckCircle2,
    RotateCcw,
    Search,
    ChevronDown,
} from "lucide-react";

import {
    predictPropertyPrice,
    getLocations,
    type PredictionResponse,
    type LocationItem,
} from "../../src/services/predictionService";

interface PredictionForm {
    area_type: string;
    availability: string;
    location: string;
    bath: number;
    balcony: number;
    bhk_num: number;
    total_sqft_cleaned: number;
}

const initialForm: PredictionForm = {
    area_type: "Super built-up Area",
    availability: "Ready To Move",
    location: "Whitefield",
    bath: 2,
    balcony: 1,
    bhk_num: 2,
    total_sqft_cleaned: 1200,
};

export default function PredictionPage() {
    const [form, setForm] = useState<PredictionForm>(initialForm);

    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [locationQuery, setLocationQuery] = useState("Whitefield");
    const [showLocationOptions, setShowLocationOptions] = useState(false);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [locationsError, setLocationsError] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<PredictionResponse | null>(null);

    // Fetch supported locations from FastAPI
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setLocationsLoading(true);
                setLocationsError("");

                const response = await getLocations();

                setLocations(response.locations);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
                setLocationsError("Unable to load locations. Please refresh the page.");
            } finally {
                setLocationsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // Filter locations as the user types
    const filteredLocations = useMemo(() => {
        const query = locationQuery.trim().toLowerCase();

        if (!query) {
            return locations.slice(0, 30);
        }

        return locations
            .filter((item) =>
                item.location.toLowerCase().includes(query)
            )
            .slice(0, 30);
    }, [locations, locationQuery]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                name === "area_type" ||
                    name === "availability"
                    ? value
                    : Number(value),
        }));

        setResult(null);
        setError("");
    };

    const handleLocationSearch = (value: string) => {
        setLocationQuery(value);

        // A typed value is not accepted until a dropdown option is selected.
        setForm((previous) => ({
            ...previous,
            location: "",
        }));

        setShowLocationOptions(true);
        setResult(null);
        setError("");
    };

    const handleLocationSelect = (item: LocationItem) => {
        setForm((previous) => ({
            ...previous,
            location: item.location,
        }));

        setLocationQuery(item.location);
        setShowLocationOptions(false);
        setResult(null);
        setError("");
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setResult(null);

        if (!form.location) {
            setError("Please select a location from the dropdown.");
            return;
        }

        if (
            form.bhk_num < 1 ||
            form.bath < 1 ||
            form.balcony < 0 ||
            form.total_sqft_cleaned <= 0
        ) {
            setError("Please enter valid property details. BHK and bathrooms must be at least 1, balconies cannot be negative, and total area must be greater than 0.");
            return;
        }

        setLoading(true);


        try {
            const response = await predictPropertyPrice(form);

            setResult(response);
        } catch (err: unknown) {
            console.error("Prediction failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to predict property price.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(initialForm);
        setLocationQuery(initialForm.location);
        setShowLocationOptions(false);
        setResult(null);
        setError("");
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8">

            {/* Page Heading */}

            <section>
                <p className="text-sm font-semibold tracking-wider text-blue-600">
                    MACHINE LEARNING
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Property Price Prediction
                </h1>

                <p className="mt-2 text-slate-500">
                    Estimate Bengaluru property prices using our CatBoost
                    machine learning model.
                </p>
            </section>

            {/* Prediction Form */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Calculator size={25} />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Property Details
                        </h2>

                        <p className="text-sm text-slate-500">
                            Enter the property characteristics below.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Area Type and Availability */}

                    <div className="grid gap-6 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Area Type
                            </label>

                            <select
                                name="area_type"
                                value={form.area_type}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="Super built-up Area">
                                    Super built-up Area
                                </option>

                                <option value="Built-up Area">
                                    Built-up Area
                                </option>

                                <option value="Plot Area">
                                    Plot Area
                                </option>

                                <option value="Carpet Area">
                                    Carpet Area
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Availability
                            </label>

                            <select
                                name="availability"
                                value={form.availability}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="Ready To Move">
                                    Ready To Move
                                </option>

                                <option value="Immediate Possession">
                                    Immediate Possession
                                </option>

                                <option value="Not Ready">
                                    Not Ready
                                </option>
                            </select>
                        </div>

                    </div>

                    {/* Searchable Location Dropdown */}

                    <div className="relative">
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <MapPin size={16} />
                            Bengaluru Location
                        </label>

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={locationQuery}
                                onChange={(event) =>
                                    handleLocationSearch(event.target.value)
                                }
                                onFocus={() => setShowLocationOptions(true)}
                                placeholder="Search Bengaluru location..."
                                autoComplete="off"
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <ChevronDown
                                size={18}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>

                        {showLocationOptions && (
                            <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">

                                {locationsLoading ? (
                                    <div className="flex items-center gap-2 p-4 text-sm text-slate-500">
                                        <Loader2 size={16} className="animate-spin" />
                                        Loading locations...
                                    </div>
                                ) : locationsError ? (
                                    <p className="p-4 text-sm text-red-600">
                                        {locationsError}
                                    </p>
                                ) : filteredLocations.length > 0 ? (
                                    <>
                                        {filteredLocations.map((item) => (
                                            <button
                                                key={item.location}
                                                type="button"
                                                onClick={() =>
                                                    handleLocationSelect(item)
                                                }
                                                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-blue-50 ${form.location === item.location
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-slate-700"
                                                    }`}
                                            >
                                                <span>{item.location}</span>

                                                <span className="shrink-0 text-xs text-slate-400">
                                                    {item.listing_count} listings
                                                </span>
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <p className="p-4 text-sm text-slate-500">
                                        No matching locations found.
                                    </p>
                                )}

                                {!locationsLoading && filteredLocations.length > 0 && (
                                    <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
                                        Showing up to 30 matching locations
                                    </p>
                                )}
                            </div>
                        )}

                        <p className="mt-1 text-xs text-slate-400">
                            {form.location
                                ? `Selected: ${form.location}`
                                : "Select a location from the search results."}
                        </p>

                        {locationsError && !showLocationOptions && (
                            <p className="mt-1 text-xs text-red-600">
                                {locationsError}
                            </p>
                        )}
                    </div>

                    {/* BHK, Bathrooms and Balconies */}

                    <div className="grid gap-6 sm:grid-cols-3">

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                <Home size={16} />
                                BHK
                            </label>

                            <input
                                type="number"
                                name="bhk_num"
                                min="1"
                                max="27"
                                step="1"
                                value={form.bhk_num}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                <Bath size={16} />
                                Bathrooms
                            </label>

                            <input
                                type="number"
                                name="bath"
                                min="1"
                                max="30"
                                step="1"
                                value={form.bath}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Balconies
                            </label>

                            <input
                                type="number"
                                name="balcony"
                                min="0"
                                max="10"
                                step="1"
                                value={form.balcony}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                    </div>

                    {/* Total Area */}

                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <Ruler size={16} />
                            Total Area (sq. ft.)
                        </label>

                        <input
                            type="number"
                            name="total_sqft_cleaned"
                            min="1"
                            step="0.01"
                            value={form.total_sqft_cleaned}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Error */}

                    {error && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Actions */}

                    <div className="flex flex-col gap-3 sm:flex-row">

                        <button
                            type="submit"
                            disabled={loading || locationsLoading}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
                                    Predicting...
                                </>
                            ) : (
                                <>
                                    <Calculator size={19} />
                                    Predict Property Price
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            <RotateCcw size={17} />
                            Reset
                        </button>

                    </div>

                </form>
            </section>

            {/* Prediction Result */}

            {result && (
                <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">

                    {/* Success Header */}

                    <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 size={22} />

                        <span className="text-sm font-semibold">
                            Prediction Generated Successfully
                        </span>
                    </div>

                    {/* Predicted Price */}

                    <div className="mt-5 rounded-xl bg-emerald-50 p-6">
                        <p className="text-sm font-medium text-emerald-700">
                            Estimated Property Price
                        </p>

                        <h2 className="mt-2 text-4xl font-bold text-emerald-800">
                            {result.predicted_price.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                            })}
                        </h2>

                        <p className="mt-2 text-sm text-emerald-700">
                            Unit: {result.currency}
                        </p>
                    </div>

                    {/* Property Summary */}

                    <div className="mt-7">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Property Summary
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Details used for this price prediction.
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-xs text-slate-500">Location</p>
                                <p className="mt-1 font-semibold text-slate-800">
                                    {form.location}
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-xs text-slate-500">BHK</p>
                                <p className="mt-1 font-semibold text-slate-800">
                                    {form.bhk_num} BHK
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-xs text-slate-500">Bathrooms</p>
                                <p className="mt-1 font-semibold text-slate-800">
                                    {form.bath}
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-xs text-slate-500">Balconies</p>
                                <p className="mt-1 font-semibold text-slate-800">
                                    {form.balcony}
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-xs text-slate-500">Total Area</p>
                                <p className="mt-1 font-semibold text-slate-800">
                                    {form.total_sqft_cleaned.toLocaleString("en-IN")} sq. ft.
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-xs text-slate-500">Area Type</p>
                                <p className="mt-1 font-semibold text-slate-800">
                                    {form.area_type}
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4 sm:col-span-3">
                                <p className="text-xs text-slate-500">Availability</p>
                                <p className="mt-1 font-semibold text-slate-800">
                                    {form.availability}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Backend Message */}

                    <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                        {result.message}
                    </div>

                    {/* Model Information */}

                    <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-slate-500">
                        <span>Model: CatBoost Regressor</span>
                        <span>Location: {form.location}</span>
                    </div>

                </section>
            )}

        </div>
    );
}
