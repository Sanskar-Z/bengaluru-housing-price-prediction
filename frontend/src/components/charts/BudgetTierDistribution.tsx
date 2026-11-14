"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { type BudgetTierItem } from "../../services/analyticsService";

interface BudgetTierDistributionProps {
    data: BudgetTierItem[];
    totalProperties: number;
}

export default function BudgetTierDistribution({
    data,
    totalProperties,
}: BudgetTierDistributionProps) {
    const chartData = data.map((item) => ({
        name: item.tier,
        value: item.count,
        percentage: item.percentage,
        color: item.color,
    }));

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span>🏷️</span> Market Budget Tier Segmentation
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Distribution of properties across affordability brackets
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
                            outerRadius={105}
                            innerRadius={55}
                            paddingAngle={3}
                            label={({ name, percent }: { name?: string; percent?: number }) =>
                                `${(name ?? "").split(" ")[0]}: ${((percent ?? 0) * 100).toFixed(1)}%`
                            }
                        >
                            {chartData.map((entry) => (
                                <Cell
                                    key={entry.name}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value: any, name: any, item: any) => [
                                `${Number(value).toLocaleString("en-IN")} units (${item.payload.percentage}%)`,
                                "Listings",
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

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-center">
                {data.map((tier) => (
                    <div key={tier.tier} className="p-2 rounded-lg bg-slate-50">
                        <div className="text-xs font-medium text-slate-500 truncate" title={tier.tier}>
                            {tier.tier.split("(")[0]}
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">
                            {tier.percentage}%
                        </div>
                        <div className="text-[11px] text-slate-400">
                            {tier.count.toLocaleString("en-IN")} units
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

