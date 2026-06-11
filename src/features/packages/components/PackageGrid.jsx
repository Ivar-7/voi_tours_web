import PackageCard from "./PackageCard";
import EmptyState from "@shared/components/feedback/EmptyState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";

function PackageSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="h-64 animate-pulse bg-stone-200 dark:bg-stone-800" />
      <div className="space-y-4 p-6">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-full animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
      </div>
    </div>
  );
}

export default function PackageGrid({
  packages = [],
  isLoading = false,
  error = null,
  onRetry,
  emptyTitle = "No packages found",
  emptyDescription = "There are no safari packages matching your current filters.",
  emptyAction,
}) {
  if (error) {
    return <ErrorHandler error={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PackageSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!packages.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {packages.map((pkg, index) => (
        <PackageCard key={pkg.id} package={pkg} index={index} />
      ))}
    </div>
  );
}
