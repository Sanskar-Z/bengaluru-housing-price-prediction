"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ChartNoAxesCombined,
    MapPin,
    Calculator,
    Building2,
    BrainCircuit,
} from "lucide-react";

const navigation = [
    {
        name: "Overview",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        name: "Price Prediction",
        href: "/prediction",
        icon: Calculator,
    },
    {
        name: "Location Analytics",
        href: "/location-analytics",
        icon: MapPin,
    },
    {
        name: "Market Analytics",
        href: "/market-analytics",
        icon: ChartNoAxesCombined,
    },
    {
        name: "Model Performance",
        href: "/model-performance",
        icon: BrainCircuit,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex min-h-screen w-64 flex-col bg-slate-950 px-5 py-6 text-white">
            <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                    <Building2 size={23} />
                </div>

                <div>
                    <h1 className="text-sm font-bold tracking-wide">
                        EstateIQ
                    </h1>
                    <p className="text-xs text-slate-400">
                        Bengaluru Intelligence
                    </p>
                </div>
            </div>

            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Workspace
            </p>

            <nav className="flex flex-col gap-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${isActive
                                ? "bg-blue-600 font-medium text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon size={19} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-slate-800 pt-5">
                <p className="text-xs text-slate-500">
                    Machine Learning Powered
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                    Housing Price Intelligence
                </p>
            </div>
        </aside>
    );
}
