import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import EmptyState from "@shared/components/feedback/EmptyState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import LoadingState from "@shared/components/feedback/LoadingState";
import { useDestinations } from "../hooks/useDestinations";
import {
  useDeleteDestination,
  useToggleFeatured,
} from "../hooks/useDestinationMutations";
import {
  excerpt,
  formatCurrency,
  formatRegionLabel,
} from "../utils/destinations.utils";

const EMPTY_DESTINATIONS = [];

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
        {value}
      </p>
    </div>
  );
}

export default function AdminDestinationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");

  const destinationsQuery = useDestinations({
    orderBy: "updatedAt",
    order: "desc",
  });

  const deleteMutation = useDeleteDestination();
  const toggleFeaturedMutation = useToggleFeatured();

  const destinations = destinationsQuery.data ?? EMPTY_DESTINATIONS;

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesRegion = region === "all" || destination.region === region;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        destination.name.toLowerCase().includes(term) ||
        destination.slug.toLowerCase().includes(term) ||
        destination.tags?.some((tag) => tag.toLowerCase().includes(term));

      return matchesRegion && matchesSearch;
    });
  }, [destinations, region, search]);

  const stats = useMemo(() => {
    const uniqueRegions = new Set(destinations.map((item) => item.region));
    return {
      total: destinations.length,
      featured: destinations.filter((item) => item.featured).length,
      regions: uniqueRegions.size,
    };
  }, [destinations]);

  async function handleDelete(destination) {
    const confirmed = window.confirm(
      `Delete "${destination.name}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(destination.id);
      toast.success("Destination deleted.");
    } catch (error) {
      toast.error(error?.message || "Could not delete destination.");
    }
  }

  async function handleToggleFeatured(destination) {
    try {
      await toggleFeaturedMutation.mutateAsync({
        id: destination.id,
        featured: !destination.featured,
      });
      toast.success(
        destination.featured
          ? "Removed from featured list."
          : "Marked as featured.",
      );
    } catch (error) {
      toast.error(error?.message || "Could not update featured status.");
    }
  }

  if (destinationsQuery.isLoading) {
    return <LoadingState message="Loading destinations..." />;
  }

  if (destinationsQuery.error) {
    return <ErrorHandler error={destinationsQuery.error} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
            Destination management
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500 dark:text-stone-400">
            Create, edit, delete, and inspect destination documents straight
            from Firestore.
          </p>
        </div>

        <Link
          to="/admin/destinations/new"
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          New destination
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total destinations" value={stats.total} />
        <StatCard label="Featured" value={stats.featured} />
        <StatCard label="Regions" value={stats.regions} />
      </div>

      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <label className="flex items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-950">
            <Search className="h-4 w-4 text-stone-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, slug, or tags"
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400 dark:text-stone-50"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "coast",
              "savanna",
              "mountain",
              "lake",
              "urban",
              "marine",
            ].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRegion(value)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  region === value
                    ? "bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700",
                ].join(" ")}
              >
                {value === "all" ? "All regions" : formatRegionLabel(value)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredDestinations.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {filteredDestinations.map((destination) => {
            const price = formatCurrency(
              destination.priceFrom,
              destination.currency,
            );

            return (
              <article
                key={destination.id}
                className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="grid gap-0 md:grid-cols-[14rem_1fr]">
                  <img
                    src={destination.heroImage}
                    alt={destination.name}
                    className="h-52 w-full object-cover md:h-full"
                  />
                  <div className="flex flex-col gap-4 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
                          {destination.name}
                        </h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          {destination.slug}
                        </p>
                      </div>
                      {destination.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
                      {excerpt(destination.description, 180)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                        {formatRegionLabel(destination.region)}
                      </span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                        {price || "Contact us"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/destinations/${destination.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
                      >
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/destinations/${destination.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(destination)}
                        className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                      >
                        <Star className="h-4 w-4" />
                        {destination.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(destination)}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:text-red-200 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No destinations match your filters"
          description="Try a different search term or region, or create a new destination."
          action={{
            label: "Create destination",
            onClick: () => navigate("/admin/destinations/new"),
          }}
        />
      )}
    </div>
  );
}
