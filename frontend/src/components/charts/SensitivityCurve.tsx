"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot,
} from "recharts";
import { type SensitivityResponse } from "../../services/predictionService";

interface SensitivityCurveProps {
    data: SensitivityResponse;
}

export default function SensitivityCurve({ data }: SensitivityCurveProps) {
    const chartData = data.curve.map((point) => ({
        sqft: point.sqft,
        price: point.predicted_price,
        label: `${point.sqft} sqft`,
    }));

    const currentSqft = data.current_point.sqft;
    const currentPrice = data.current_point.predicted_price;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <span>🎯</span> Dynamic What-If Price Sensitivity Curve
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Estimated price scaling across 500 to 4,000 sq.ft for {data.location}
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                    Current: {currentSqft.toLocaleString("en-IN")} sq.ft • ₹{currentPrice.toFixed(2)} Lakhs
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                    >
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="sqft"
                            tickFormatter={(value) => `${value} sqft`}
                            stroke="#94a3b8"
                            fontSize={12}
                        />
                        <YAxis
                            tickFormatter={(value) => `₹${value} L`}
                            stroke="#94a3b8"
                            fontSize={12}
                        />
                        <Tooltip
                            formatter={(value: any) => [`₹${Number(value).toFixed(2)} Lakhs`, "Valuation"]}
                            labelFormatter={(label) => `Area: ${label} sq.ft`}
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#2563eb"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                        <ReferenceDot
                            x={currentSqft}
                            y={currentPrice}
                            r={8}
                            fill="#ec4899"
                            stroke="#ffffff"
                            strokeWidth={3}
                            label={{
                                value: `📍 You are here (₹${currentPrice.toFixed(1)}L)`,
                                position: "top",
                                fill: "#be185d",
                                fontSize: 12,
                                fontWeight: 700,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
                Interactive spline curve highlights diminishing vs accelerating square-footage price returns.
            </p>
        </div>
    );
}

