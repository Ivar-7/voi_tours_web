import DestinationCard from "./DestinationCard";
import EmptyState from "@shared/components/feedback/EmptyState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";

function DestinationSkeleton() {
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

export default function DestinationGrid({
  destinations = [],
  isLoading = false,
  error = null,
  emptyTitle = "No destinations yet",
  emptyDescription = "There are no destinations matching your current filters.",
  emptyAction,
}) {
  if (error) {
    return <ErrorHandler error={error} />;
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <DestinationSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!destinations.length) {
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
      {destinations.map((destination, index) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
          index={index}
        />
      ))}
    </div>
  );
}
