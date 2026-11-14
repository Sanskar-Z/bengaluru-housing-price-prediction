"use client";

import { MapPin } from "lucide-react";

interface LocationDistributionProps {
    data: Record<string, number>;
}

export default function LocationDistribution({
    data,
}: LocationDistributionProps) {
    const chartData = Object.entries(data)
        .map(([location, count]) => ({
            location: location.trim(),
            count,
        }))
        .sort((a, b) => b.count - a.count);

    const maximum = Math.max(
        ...chartData.map((item) => item.count),
        1
    );

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />

                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Top Bengaluru Locations
                    </h2>

                    <p className="text-sm text-slate-500">
                        Locations ranked by property listings
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-5">
                {chartData.map((item, index) => (
                    <div key={item.location}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400">
                                    {index + 1}.
                                </span>

                                <span className="truncate text-sm font-medium text-slate-700">
                                    {item.location}
                                </span>
                            </div>

                            <span className="shrink-0 text-sm font-semibold text-slate-700">
                                {item.count.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                style={{
                                    width: `${(item.count / maximum) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
