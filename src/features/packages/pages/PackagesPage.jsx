import { useState } from "react";
import { Link } from "react-router-dom";
import { useDestinations } from "@features/destinations/hooks/useDestinations";
import PackageFilter from "../components/PackageFilter";
import PackageGrid from "../components/PackageGrid";
import { usePackages } from "../hooks/usePackages";

export default function PackagesPage() {
  const [filters, setFilters] = useState({});
  const {
    data: packages = [],
    isLoading,
    error,
    refetch,
  } = usePackages(filters);
  const { data: destinations = [] } = useDestinations();

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link
            to="/"
            className="font-serif text-xl font-bold text-stone-900 dark:text-stone-50"
          >
            Savanna Crown
          </Link>
          <Link
            to="/inquiry"
            className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950"
          >
            Plan a trip
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Safari packages
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Curated journeys across Kenya
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-600 dark:text-stone-300">
            Browse ready-made safari itineraries with transparent tier-based
            pricing. Filter by destination, duration, and season to find your
            perfect escape.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <PackageFilter
            filters={filters}
            onChange={setFilters}
            destinations={destinations}
          />
          <PackageGrid
            packages={packages}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            emptyAction={{
              label: "Clear filters",
              onClick: () => setFilters({}),
            }}
          />
        </div>
      </main>
    </div>
  );
}
