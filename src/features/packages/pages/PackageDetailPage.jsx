import { Link, useParams } from "react-router-dom";
import { PricingSeason } from "@/shared/types/enums";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import LoadingState from "@shared/components/feedback/LoadingState";
import PackageHero from "../components/PackageHero";
import PackageItinerary from "../components/PackageItinerary";
import PackagePricingTable from "../components/PackagePricingTable";
import { usePackage } from "../hooks/usePackage";

export default function PackageDetailPage() {
  const { slug } = useParams();
  const { data: pkg, isLoading, error, refetch } = usePackage(slug);

  if (isLoading) {
    return <LoadingState message="Loading package details..." />;
  }

  if (error || !pkg) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <ErrorHandler
          error={error || "Package not found."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link
            to="/packages"
            className="text-sm font-semibold text-amber-700 hover:text-amber-600 dark:text-amber-400"
          >
            ← All packages
          </Link>
          <Link
            to={`/dashboard/book/safari?package=${pkg.slug}`}
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Book now
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <PackageHero package={pkg} />

        {(pkg.highlights || []).length ? (
          <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
              Highlights
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {pkg.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <PackageItinerary
          itinerary={pkg.itinerary}
          durationDays={pkg.duration_days}
        />

        <PackagePricingTable
          pricing={pkg.pricing}
          selectedSeason={PricingSeason.REGULAR}
        />
      </main>
    </div>
  );
}
