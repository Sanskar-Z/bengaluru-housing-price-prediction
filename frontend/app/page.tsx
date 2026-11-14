"use client";

import { useEffect, useState } from "react";

import {
  Building2,
  IndianRupee,
  Ruler,
  Activity,
  Loader2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import { getDashboardSummary } from "../src/services/dashboardService";
import type { DashboardSummary } from "../src/types/dashboard";

import BHKDistribution from "../src/components/charts/BHKDistribution";
import AreaTypeDistribution from "../src/components/charts/AreaTypeDistribution";
import LocationDistribution from "../src/components/charts/LocationDistribution";

export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error(
          "Failed to fetch dashboard summary:",
          err
        );

        setError(
          "Unable to load dashboard statistics. Check whether the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const stats = summary
    ? [
      {
        title: "Total Properties",
        value: summary.total_listings.toLocaleString("en-IN"),
        description: "Properties in the dataset",
        icon: Building2,
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Average Property Price",
        value: summary.price_statistics.average.toFixed(2),
        description: summary.price_unit,
        icon: IndianRupee,
        color: "bg-emerald-100 text-emerald-600",
      },
      {
        title: "Median Property Price",
        value: summary.price_statistics.median.toLocaleString("en-IN"),
        description: summary.price_unit,
        icon: Activity,
        color: "bg-violet-100 text-violet-600",
      },
      {
        title: "Average Property Area",
        value: `${summary.average_area_sqft.toLocaleString("en-IN")} sqft`,
        description: "Average area per listing",
        icon: Ruler,
        color: "bg-orange-100 text-orange-600",
      },
    ]
    : [];

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Welcome Section */}

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wider text-blue-600">
            OVERVIEW
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Bengaluru Housing Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Understand the Bengaluru real estate market with
            machine learning powered insights.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          ML Powered Analytics
        </div>
      </section>

      {/* Market Snapshot */}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Market Snapshot
          </h2>

          <span className="text-xs text-slate-400">
            Live API Data
          </span>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
            <Loader2 className="animate-spin" size={20} />
            Loading market statistics...
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        ) : summary ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <stat.icon size={22} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-slate-300"
                  />
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  {stat.title}
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  {stat.value}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Analytics Sections */}

      {summary && (
        <>
          {/* Price Statistics */}

          <section className="grid gap-6 lg:grid-cols-2">

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Price Statistics
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Overview of property prices in the dataset
              </p>

              <div className="mt-6 grid grid-cols-2 gap-6">

                <div>
                  <p className="text-sm text-slate-500">
                    Minimum Price
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {summary.price_statistics.minimum.toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Maximum Price
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {summary.price_statistics.maximum.toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Average Price
                  </p>

                  <p className="mt-2 text-xl font-semibold text-slate-800">
                    {summary.price_statistics.average.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Median Price
                  </p>

                  <p className="mt-2 text-xl font-semibold text-slate-800">
                    {summary.price_statistics.median.toLocaleString("en-IN")}
                  </p>
                </div>

              </div>

              <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
                Price unit: {summary.price_unit}
              </p>
            </div>

            {/* Prediction Card */}

            <div className="rounded-xl border border-slate-900 bg-slate-950 p-7 text-white shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                <Activity size={25} />
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Intelligent Property Valuation
              </h2>

              <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                Estimate Bengaluru property prices using our
                CatBoost machine learning model. Enter property
                characteristics to generate an estimated valuation.
              </p>

              <a
                href="/prediction"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-700"
              >
                Predict Property Price
                <ArrowUpRight size={18} />
              </a>
            </div>

          </section>

          {/* Location Distribution */}

          <section>
            <LocationDistribution
              data={summary.top_locations}
            />
          </section>

          {/* Charts */}

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Housing Market Analytics
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explore property composition across Bengaluru
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <BHKDistribution
                data={summary.bhk_distribution}
              />

              <AreaTypeDistribution
                data={summary.area_type_distribution}
              />
            </div>
          </section>
        </>
      )}

    </div>
  );
}
