"use client";

import { useEffect, useState } from "react";

import {
    Building2,
    TrendingUp,
    Home,
    Ruler,
    BarChart3,
    AlertCircle,
    Loader2,
    MapPin,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import { getDashboardSummary } from "../../src/services/dashboardService";
import type { DashboardSummary } from "../../src/types/dashboard";

const CHART_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
    "#64748b",
];

export default function MarketAnalyticsPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDashboardSummary();
                setSummary(data);
            } catch (err) {
                console.error("Market analytics error:", err);
                setError("Unable to load market analytics. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-500">
                <Loader2 size={24} className="animate-spin" />
                Loading market analytics...
            </div>
        );
    }

    if (error || !summary) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                <AlertCircle size={22} />
                {error || "Market data is unavailable."}
            </div>
        );
    }

    const bhkData = Object.entries(summary.bhk_distribution)
        .map(([bhk, count]) => ({
            bhk: `${bhk.replace(".0", "")} BHK`,
            listings: count,
        }))
        .sort(
            (a, b) =>
                Number.parseInt(a.bhk) - Number.parseInt(b.bhk)
        );

    const areaTypeData = Object.entries(summary.area_type_distribution)
        .map(([name, value]) => ({
            name: name.trim(),
            value,
        }));

    const topLocations = Object.entries(summary.top_locations)
        .map(([location, count]) => ({
            location: location.trim(),
            listings: count,
        }))
        .sort((a, b) => b.listings - a.listings)
        .slice(0, 10);

    const priceData = [
        {
            name: "Minimum",
            price: summary.price_statistics.minimum,
        },
        {
            name: "Median",
            price: summary.price_statistics.median,
        },
        {
            name: "Average",
            price: summary.price_statistics.average,
        },
        {
            name: "Maximum",
            price: summary.price_statistics.maximum,
        },
    ];

    const formatNumber = (value: number) =>
        value.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        });

    return (
        <div className="mx-auto max-w-7xl space-y-8">

            {/* Page Heading */}

            <section>
                <p className="text-sm font-semibold tracking-wider text-blue-600">
                    MARKET OVERVIEW
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Market Analytics
                </h1>

                <p className="mt-2 text-slate-500">
                    Explore Bengaluru housing market trends using
                    historical property listing data.
                </p>
            </section>

            {/* KPI Cards */}

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Total Listings
                        </p>

                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                            <Building2 size={21} />
                        </div>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                        {formatNumber(summary.total_listings)}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Properties in dataset
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Average Price
                        </p>

                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                            <TrendingUp size={21} />
                        </div>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                        {formatNumber(summary.price_statistics.average)}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        {summary.price_unit}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Median Price
                        </p>

                        <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                            <BarChart3 size={21} />
                        </div>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                        {formatNumber(summary.price_statistics.median)}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        {summary.price_unit}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Average Area
                        </p>

                        <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                            <Ruler size={21} />
                        </div>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                        {formatNumber(summary.average_area_sqft)}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Square feet
                    </p>
                </div>

            </section>

            {/* Price Statistics */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        Property Price Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Overall price statistics across the dataset.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {priceData.map((item) => (
                        <div
                            key={item.name}
                            className="rounded-lg bg-slate-50 p-5"
                        >
                            <p className="text-sm text-slate-500">
                                {item.name} Price
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-slate-900">
                                {formatNumber(item.price)}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                {summary.price_unit}
                            </p>
                        </div>
                    ))}

                </div>

            </section>

            {/* BHK and Area Type Charts */}

            <section className="grid gap-6 xl:grid-cols-2">

                {/* BHK Distribution */}

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                            <Home size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                BHK Distribution
                            </h2>

                            <p className="text-sm text-slate-500">
                                Listings by bedroom count.
                            </p>
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={bhkData}
                                margin={{
                                    top: 10,
                                    right: 15,
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
                                    tick={{ fontSize: 11 }}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 11 }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="listings"
                                    fill="#2563eb"
                                    radius={[5, 5, 0, 0]}
                                    maxBarSize={45}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Area Type Distribution */}

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                            <BarChart3 size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Area Type Distribution
                            </h2>

                            <p className="text-sm text-slate-500">
                                Listings by property area type.
                            </p>
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={areaTypeData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    outerRadius={105}
                                    innerRadius={55}
                                    paddingAngle={3}
                                >
                                    {areaTypeData.map((item, index) => (
                                        <Cell
                                            key={item.name}
                                            fill={
                                                CHART_COLORS[
                                                index % CHART_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />
                                <Legend
                                    verticalAlign="bottom"
                                    height={45}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </section>

            {/* Top Locations */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2 text-green-600">
                        <MapPin size={21} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Top 10 Bengaluru Locations
                        </h2>

                        <p className="text-sm text-slate-500">
                            Locations ranked by number of property listings.
                        </p>
                    </div>
                </div>

                <div className="h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topLocations}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 25,
                                left: 25,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                            />

                            <XAxis
                                type="number"
                                allowDecimals={false}
                            />

                            <YAxis
                                type="category"
                                dataKey="location"
                                width={145}
                                tick={{ fontSize: 11 }}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="listings"
                                fill="#16a34a"
                                radius={[0, 5, 5, 0]}
                                maxBarSize={26}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Data Information */}

            <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">

                <h3 className="font-semibold text-amber-900">
                    About this market analysis
                </h3>

                <p className="mt-2 text-sm leading-6 text-amber-800">
                    These statistics are calculated from the historical
                    Bengaluru housing dataset used by the project.
                    They represent dataset observations, not live
                    real-estate market prices. The price unit is
                    provisional and should be verified against the
                    original dataset before presenting it as a confirmed
                    currency value.
                </p>

            </section>

        </div>
    );
}
