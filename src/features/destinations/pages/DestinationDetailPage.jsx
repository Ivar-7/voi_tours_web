import { Link, useParams } from "react-router-dom";
import { MapPinned, PackageSearch, PenSquare, ArrowLeft } from "lucide-react";

import DestinationGallery from "../components/DestinationGallery";
import DestinationHero from "../components/DestinationHero";
import DestinationCard from "../components/DestinationCard";
import { useDestination } from "../hooks/useDestination";
import { useDestinations } from "../hooks/useDestinations";
import { formatCurrency, formatRegionLabel } from "../utils/destinations.utils";
import LoadingState from "@shared/components/feedback/LoadingState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import EmptyState from "@shared/components/feedback/EmptyState";
import { useAuth } from "@features/auth/hooks/useAuth";

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-stone-900 dark:text-stone-50">
        {value}
      </p>
    </div>
  );
}

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const destinationQuery = useDestination(slug);

  const destination = destinationQuery.data;
  const relatedQuery = useDestinations(
    {
      region: destination?.region,
      orderBy: "name",
      order: "asc",
      limit: 4,
    },
    { enabled: Boolean(destination?.region) },
  );

  if (destinationQuery.isLoading) {
    return <LoadingState message="Loading destination details..." />;
  }

  if (destinationQuery.error) {
    return <ErrorHandler error={destinationQuery.error} />;
  }

  if (!destination) {
    return (
      <EmptyState
        title="Destination not found"
        description="We could not find a destination that matches that URL."
        action={{
          label: "Back to destinations",
          onClick: () => window.location.assign("/destinations"),
        }}
      />
    );
  }

  const relatedDestinations = (relatedQuery.data || []).filter(
    (item) => item.id !== destination.id,
  );
  const galleryImages = destination.gallery?.length
    ? destination.gallery
    : [destination.heroImage];
  const price = formatCurrency(destination.priceFrom, destination.currency);
  const canManage = ["admin", "agent"].includes(user?.role);

  return (
    <main className="bg-[radial-gradient(circle_at_top,_#fdf8f0,_#f3eadb_36%,_#efe7d7_100%)] px-4 py-8 text-stone-900 dark:bg-stone-950 dark:text-stone-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to destinations
          </Link>

          <div className="flex flex-wrap gap-2">
            {canManage ? (
              <>
                <Link
                  to={`/admin/destinations/${destination.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  <MapPinned className="h-4 w-4" />
                  Manage by ID
                </Link>
                <Link
                  to={`/admin/destinations/${destination.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
                >
                  <PenSquare className="h-4 w-4" />
                  Edit
                </Link>
              </>
            ) : null}
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              <PackageSearch className="h-4 w-4" />
              View packages
            </Link>
          </div>
        </div>

        <DestinationHero destination={destination} />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
              About this destination
            </h2>
            <p className="mt-4 whitespace-pre-line text-base leading-7 text-stone-600 dark:text-stone-300">
              {destination.description}
            </p>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
                Highlights
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {destination.highlights?.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
                Gallery
              </h3>
              <div className="mt-4">
                <DestinationGallery images={galleryImages} />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
                Quick facts
              </h3>
              <div className="mt-5 grid gap-3">
                <InfoCard
                  label="Region"
                  value={formatRegionLabel(destination.region)}
                />
                <InfoCard label="Slug" value={destination.slug} />
                <InfoCard
                  label="Starting price"
                  value={price || "Contact us"}
                />
                <InfoCard
                  label="Featured"
                  value={destination.featured ? "Yes" : "No"}
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
                Tags and metadata
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {destination.tags?.length ? (
                  destination.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    No tags yet.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
                Related destinations
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Explore other places in the same region.
              </p>
            </div>
            <Link
              to="/destinations"
              className="text-sm font-semibold text-amber-600 transition-colors hover:text-amber-500"
            >
              Browse all destinations
            </Link>
          </div>

          <div className="mt-6">
            {relatedQuery.isLoading ? (
              <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 animate-pulse rounded-[1.75rem] bg-stone-200 dark:bg-stone-800"
                  />
                ))}
              </div>
            ) : relatedDestinations.length ? (
              <div className="grid gap-6 md:grid-cols-3">
                {relatedDestinations.map((item, index) => (
                  <DestinationCard
                    key={item.id}
                    destination={item}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No related destinations yet"
                description="This region does not have more destinations to suggest."
              />
            )}
          </div>
        </section>

        <section className="grid gap-4 rounded-[1.75rem] border border-stone-200 bg-stone-950 p-6 text-white shadow-lg shadow-stone-900/20 dark:border-stone-800">
          <h2 className="font-serif text-2xl font-bold">
            Planning a trip to {destination.name}?
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-stone-300">
            We can build a package around this destination, combine it with
            transfers, or tailor it for your group size and travel dates.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/inquiry"
              className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              Send an inquiry
            </Link>
            <Link
              to="/packages"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore packages
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
