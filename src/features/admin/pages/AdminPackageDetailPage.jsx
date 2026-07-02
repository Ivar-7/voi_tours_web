import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import LoadingState from "@shared/components/feedback/LoadingState";
import PackageHero from "@features/packages/components/PackageHero";
import PackageItinerary from "@features/packages/components/PackageItinerary";
import PackagePricingTable from "@features/packages/components/PackagePricingTable";
import { usePackageById } from "@features/packages/hooks/usePackageById";
import { formatDuration } from "@features/packages/utils/packages.utils";

export default function AdminPackageDetailPage() {
  const { id } = useParams();
  const { data: pkg, isLoading, error, refetch } = usePackageById(id);

  if (isLoading) {
    return <LoadingState message="Loading package..." />;
  }

  if (error || !pkg) {
    return (
      <div className="p-6">
        <ErrorHandler
          error={error || "Package not found."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/packages"
            className="text-sm font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
          >
            ← Back to packages
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
            {pkg.title}
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            ID: {pkg.id} · {formatDuration(pkg.duration_days)} ·{" "}
            {pkg.is_active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/packages/${pkg.slug}`}
            className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-amber-500 hover:text-amber-600 dark:border-stone-700 dark:text-stone-200 dark:hover:text-amber-300"
          >
            View public page
          </Link>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(pkg.id);
              toast.success("Package ID copied");
            }}
            className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-800 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
          >
            Copy ID
          </button>
        </div>
      </div>

      <PackageHero package={pkg} showBookCta={false} />
      <PackageItinerary
        itinerary={pkg.itinerary}
        durationDays={pkg.duration_days}
      />
      <PackagePricingTable pricing={pkg.pricing} />
    </div>
  );
}
