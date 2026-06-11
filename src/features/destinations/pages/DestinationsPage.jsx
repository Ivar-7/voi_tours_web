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
    <main className="bg-stone-950 text-stone-50">
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-12 lg:py-14">
        <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-white shadow-2xl shadow-black/30">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1600&q=85"
              alt="Kenya landscape"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-stone-950/20" />
          </div>

          <div className="relative z-10 grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                <Compass className="h-4 w-4" />
                Destinations
              </div>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Discover Kenya&apos;s most unforgettable landscapes.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-200">
                Browse every destination in the catalogue, filter by region, and
                jump into the ones that match your next escape.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-stone-950/55 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-200">
                  Quick links
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/packages"
                  className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
                >
                  Explore packages
                </Link>
                <Link
                  to="/inquiry"
                  className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Send an inquiry
                </Link>
              </div>
              <p className="mt-5 text-sm leading-6 text-stone-300">
                Current filter:{" "}
                <span className="font-semibold text-white">
                  {formatRegionLabel(
                    activeRegion === "all" ? "all" : activeRegion,
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 md:px-12">
        <div className="flex flex-col gap-4 border-y border-stone-800 bg-stone-950 py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-50">
                Filter by region
              </h2>
              <p className="mt-1 text-sm text-stone-400">
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

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              <span className="h-px w-6 bg-amber-500" />
              Top Destinations
            </div>
            <h2 className="font-serif text-4xl font-bold text-stone-50 md:text-5xl">
              Featured destinations
            </h2>
            <p className="mt-3 text-sm text-stone-400">
              A hand-picked set of standout places.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredQuery.isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl bg-stone-900"
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

      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-12">
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            <span className="h-px w-6 bg-amber-500" />
            Browse
          </div>
          <h2 className="font-serif text-4xl font-bold text-stone-50 md:text-5xl">
            All destinations
          </h2>
          <p className="mt-3 text-sm text-stone-400">
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
