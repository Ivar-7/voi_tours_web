import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "@shared/components/ui/Select";
import { usePackages } from "@features/packages/hooks/usePackages";
import { useDestinations } from "@features/destinations/hooks/useDestinations";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import { useReviews } from "../hooks/useReviews";

export default function ReviewsPage() {
  const [searchParams] = useSearchParams();
  const [packageId, setPackageId] = useState(searchParams.get("package") || "");
  const [destinationId, setDestinationId] = useState(
    searchParams.get("destination") || "",
  );

  const { data: packages = [] } = usePackages();
  const { data: destinations = [] } = useDestinations();

  const filters = packageId
    ? { package_id: packageId }
    : destinationId
      ? { destination_id: destinationId }
      : {};

  const { data: reviews, isLoading, error, refetch } = useReviews(filters);

  function handlePackageChange(event) {
    setPackageId(event.target.value);
    setDestinationId("");
  }

  function handleDestinationChange(event) {
    setDestinationId(event.target.value);
    setPackageId("");
  }

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
          Traveler stories
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
          Reviews
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-400">
          Read what travelers say about our packages and destinations, or share
          your own experience.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <div className="w-56">
                <Select
                  placeholder="All packages"
                  value={packageId}
                  onChange={handlePackageChange}
                  options={packages.map((pkg) => ({
                    value: pkg.id,
                    label: pkg.title,
                  }))}
                />
              </div>
              <div className="w-56">
                <Select
                  placeholder="All destinations"
                  value={destinationId}
                  onChange={handleDestinationChange}
                  options={destinations.map((dest) => ({
                    value: dest.id,
                    label: dest.name,
                  }))}
                />
              </div>
            </div>

            <ReviewList
              reviews={reviews}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
            />
          </div>

          <aside>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/40">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                Write a review
              </h2>
              {packageId || destinationId ? (
                <div className="mt-4">
                  <ReviewForm
                    key={packageId || destinationId}
                    packageId={packageId || undefined}
                    destinationId={destinationId || undefined}
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                  Choose a package or destination above to leave a review for
                  it.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
