import { Link, useSearchParams } from "react-router-dom";
import { Compass, Sparkles } from "lucide-react";

import DestinationCard from "../components/DestinationCard";
import DestinationGrid from "../components/DestinationGrid";
import RegionFilter from "../components/RegionFilter";
import { useDestinations } from "../hooks/useDestinations";
import {
  destinationRegionOptions,
  formatRegionLabel,
} from "../utils/destinations.utils";

const EMPTY_DESTINATIONS = [];

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeRegion = searchParams.get("region") || "all";
  const regionValue = activeRegion === "all" ? undefined : activeRegion;

  const featuredQuery = useDestinations({
    featured: true,
    limit: 3,
    orderBy: "updatedAt",
    order: "desc",
  });

  const destinationsQuery = useDestinations({
    region: regionValue,
    orderBy: "name",
    order: "asc",
  });

  const featuredDestinations = featuredQuery.data || [];
  const destinations = destinationsQuery.data ?? EMPTY_DESTINATIONS;
  const regions = destinationRegionOptions.map((item) => item.value);

  function handleRegionChange(region) {
    const next = new URLSearchParams(searchParams);
    if (region === "all") {
      next.delete("region");
    } else {
      next.set("region", region);
    }
    setSearchParams(next);
  }

  return (
    <main className="bg-[radial-gradient(circle_at_top,_#fdf8f0,_#f3eadb_36%,_#efe7d7_100%)] text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-2xl shadow-stone-900/5 backdrop-blur dark:border-stone-800 dark:bg-stone-950/75 md:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <Compass className="h-4 w-4" />
              Destinations
            </div>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Discover Kenya&apos;s most unforgettable landscapes.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-300">
              Browse every destination in the catalogue, filter by region, and
              jump into the ones that match your next escape.
            </p>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-stone-900/70">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                Quick links
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/packages"
                className="rounded-full bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
              >
                Explore packages
              </Link>
              <Link
                to="/inquiry"
                className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                Send an inquiry
              </Link>
            </div>
            <p className="text-sm leading-6 text-stone-500 dark:text-stone-400">
              Current filter:{" "}
              <span className="font-semibold text-stone-900 dark:text-white">
                {formatRegionLabel(
                  activeRegion === "all" ? "all" : activeRegion,
                )}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
                Filter by region
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Narrow the catalogue to the destinations you want to explore.
              </p>
            </div>
          </div>
          <RegionFilter
            regions={regions}
            active={activeRegion}
            onChange={handleRegionChange}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
              Featured destinations
            </h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              A hand-picked set of standout places.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredQuery.isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-[1.75rem] bg-stone-200 dark:bg-stone-800"
                />
              ))
            : featuredDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
            All destinations
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Browse the full collection and open any destination for more detail.
          </p>
        </div>

        <DestinationGrid
          destinations={destinations}
          isLoading={destinationsQuery.isLoading}
          error={destinationsQuery.error}
          emptyTitle="No destinations found"
          emptyDescription={
            activeRegion === "all"
              ? "No destinations have been added yet."
              : `There are no destinations in the ${formatRegionLabel(activeRegion)} region right now.`
          }
          emptyAction={
            activeRegion !== "all"
              ? {
                  label: "Show all destinations",
                  onClick: () => handleRegionChange("all"),
                }
              : undefined
          }
        />
      </section>
    </main>
  );
}
