"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface AreaTypeDistributionProps {
    data: Record<string, number>;
}

const COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
];

export default function AreaTypeDistribution({
    data,
}: AreaTypeDistributionProps) {
    const chartData = Object.entries(data).map(
        ([name, value]) => ({
            name: name.trim(),
            value,
        })
    );

    const total = chartData.reduce(
        (sum, item) => sum + item.value,
        0
    );

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                    Area Type Distribution
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Property listings by area classification
                </p>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={100}
                            innerRadius={60}
                            paddingAngle={3}
                            label={({ name, percent }) =>
                                `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                            }
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={entry.name}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

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

                        <Legend verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <p className="mt-2 text-center text-sm text-slate-500">
                Total listings: {total.toLocaleString("en-IN")}
            </p>
        </div>
    );
}
