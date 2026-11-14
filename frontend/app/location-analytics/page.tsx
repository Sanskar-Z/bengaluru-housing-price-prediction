"use client";

import { useEffect, useMemo, useState } from "react";

import {
    MapPin,
    Home,
    TrendingUp,
    BarChart3,
    Ruler,
    Search,
    ChevronDown,
    Loader2,
    AlertCircle,
    Building2,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import {
    getLocations,
    getLocationAnalytics,
    type LocationItem,
    type LocationAnalytics,
} from "../../src/services/analyticsService";

export default function LocationAnalyticsPage() {
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [selectedLocation, setSelectedLocation] = useState("Whitefield");
    const [search, setSearch] = useState("Whitefield");

    const [analytics, setAnalytics] =
        useState<LocationAnalytics | null>(null);

    const [locationsLoading, setLocationsLoading] = useState(true);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const [error, setError] = useState("");

    // Fetch available locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await getLocations();
                setLocations(response.locations);
            } catch (err) {
                console.error("Location loading failed:", err);
                setError("Unable to load Bengaluru locations.");
            } finally {
                setLocationsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // Fetch analytics whenever selected location changes
    useEffect(() => {
        if (!selectedLocation) return;

        const fetchAnalytics = async () => {
            try {
                setAnalyticsLoading(true);
                setError("");
                setAnalytics(null);

                const response =
                    await getLocationAnalytics(selectedLocation);

                setAnalytics(response);
            } catch (err) {
                console.error("Analytics loading failed:", err);
                setError(
                    "Unable to load analytics for this location."
                );
            } finally {
                setAnalyticsLoading(false);
            }
        };

        fetchAnalytics();
    }, [selectedLocation]);

    // Filter locations
    const filteredLocations = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return locations.slice(0, 30);
        }

        return locations
            .filter((item) =>
                item.location.toLowerCase().includes(query)
            )
            .slice(0, 30);
    }, [locations, search]);

    // Convert BHK distribution into chart data
    const bhkData = useMemo(() => {
        if (!analytics) return [];

        return Object.entries(analytics.bhk_distribution)
            .map(([bhk, count]) => ({
                bhk: `${bhk.replace(".0", "")} BHK`,
                listings: count,
            }))
            .sort(
                (a, b) =>
                    Number.parseInt(a.bhk) -
                    Number.parseInt(b.bhk)
            );
    }, [analytics]);

    const selectLocation = (item: LocationItem) => {
        setSelectedLocation(item.location);
        setSearch(item.location);
        setShowOptions(false);
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8">

            {/* Page Heading */}

            <section>
                <p className="text-sm font-semibold tracking-wider text-blue-600">
                    MARKET INSIGHTS
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Location Analytics
                </h1>

                <p className="mt-2 text-slate-500">
                    Explore property prices and housing trends across
                    Bengaluru locations.
                </p>
            </section>

            {/* Location Selector */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />

                    <h2 className="font-semibold text-slate-900">
                        Select Bengaluru Location
                    </h2>
                </div>

                <div className="relative max-w-xl">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setShowOptions(true);
                        }}
                        onFocus={() => setShowOptions(true)}
                        placeholder="Search a location..."
                        className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <ChevronDown
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    {showOptions && (
                        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">

                            {locationsLoading ? (
                                <div className="p-4 text-sm text-slate-500">
                                    Loading locations...
                                </div>
                            ) : filteredLocations.length > 0 ? (
                                filteredLocations.map((item) => (
                                    <button
                                        key={item.location}
                                        type="button"
                                        onClick={() => selectLocation(item)}
                                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50"
                                    >
                                        <span>{item.location}</span>

                                        <span className="text-xs text-slate-400">
                                            {item.listing_count} listings
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <p className="p-4 text-sm text-slate-500">
                                    No matching locations found.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                    Selected location: {selectedLocation}
                </p>
            </section>

            {/* Loading */}

            {analyticsLoading && (
                <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-12 text-slate-500">
                    <Loader2 size={22} className="animate-spin" />
                    Loading location analytics...
                </div>
            )}

            {/* Error */}

            {error && !analyticsLoading && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Analytics Dashboard */}

            {analytics && !analyticsLoading && (
                <>

                    {/* Location Overview */}

                    <section>
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-slate-900">
                                {analytics.location}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Housing market overview for this location.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                            {/* Total Listings */}

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        Total Listings
                                    </p>

                                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                                        <Home size={20} />
                                    </div>
                                </div>

                                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                                    {analytics.total_listings.toLocaleString("en-IN")}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Properties in dataset
                                </p>
                            </div>

                            {/* Average Price */}

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        Average Price
                                    </p>

                                    <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                        <TrendingUp size={20} />
                                    </div>
                                </div>

                                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                                    {analytics.price_statistics.average.toLocaleString("en-IN")}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    {analytics.price_unit}
                                </p>
                            </div>

                            {/* Median Price */}

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        Median Price
                                    </p>

                                    <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                                        <BarChart3 size={20} />
                                    </div>
                                </div>

                                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                                    {analytics.price_statistics.median.toLocaleString("en-IN")}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    {analytics.price_unit}
                                </p>
                            </div>

                            {/* Average Area */}

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        Average Area
                                    </p>

                                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                                        <Ruler size={20} />
                                    </div>
                                </div>

                                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                                    {analytics.average_area_sqft.toLocaleString("en-IN")}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Square feet
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* Price Statistics */}

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900">
                                Property Price Statistics
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Price range in {analytics.location}.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">

                            <div className="rounded-lg bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Minimum Price
                                </p>

                                <h3 className="mt-2 text-xl font-bold text-slate-900">
                                    {analytics.price_statistics.minimum.toLocaleString("en-IN")}
                                </h3>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-5">
                                <p className="text-sm text-blue-600">
                                    Median Price
                                </p>

                                <h3 className="mt-2 text-xl font-bold text-blue-700">
                                    {analytics.price_statistics.median.toLocaleString("en-IN")}
                                </h3>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Maximum Price
                                </p>

                                <h3 className="mt-2 text-xl font-bold text-slate-900">
                                    {analytics.price_statistics.maximum.toLocaleString("en-IN")}
                                </h3>
                            </div>

                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            All prices are in {analytics.price_unit}.
                        </p>
                    </section>

                    {/* BHK Distribution Chart */}

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                                <Building2 size={21} />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    BHK Distribution
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Number of property listings by bedroom count.
                                </p>
                            </div>
                        </div>

                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={bhkData}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 0,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="bhk"
                                        tick={{ fontSize: 12 }}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fontSize: 12 }}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            value,
                                            "Listings",
                                        ]}
                                    />

                                    <Bar
                                        dataKey="listings"
                                        fill="#2563eb"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={55}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* Footer Note */}

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <p className="font-semibold">
                            About these analytics
                        </p>

                        <p className="mt-1">
                            Statistics are based on historical property
                            listings in the training dataset. They are not
                            live market prices or guaranteed valuations.
                            The price unit is provisional and requires
                            verification against the original dataset.
                        </p>
                    </div>

                </>
            )}

        </div>
    );
}
