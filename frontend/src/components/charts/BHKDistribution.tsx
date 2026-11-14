"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface BHKDistributionProps {
    data: Record<string, number>;
}

export default function BHKDistribution({
    data,
}: BHKDistributionProps) {
    const chartData = Object.entries(data)
        .map(([bhk, count]) => ({
            bhk: `${Number(bhk)} BHK`,
            properties: count,
        }))
        .sort(
            (a, b) =>
                Number.parseInt(a.bhk) - Number.parseInt(b.bhk)
        );

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                    BHK Distribution
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Property listings by number of bedrooms
                </p>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="bhk"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                        />

                        <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            formatter={(value) => [
                                Number(value).toLocaleString("en-IN"),
                                "Properties",
                            ]}
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                            }}
                        />

                        <Bar
                            dataKey="properties"
                            name="Properties"
                            fill="#2563eb"
                            radius={[5, 5, 0, 0]}
                            maxBarSize={45}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
