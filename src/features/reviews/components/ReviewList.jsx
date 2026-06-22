import EmptyState from "@shared/components/feedback/EmptyState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import Skeleton from "@shared/components/ui/Skeleton";
import Pagination from "@shared/components/ui/Pagination";
import { usePagination } from "@shared/hooks";
import ReviewCard from "./ReviewCard";

const PAGE_SIZE = 6;

/**
 * @param {{ reviews: import('@/shared/types/models').Review[], isLoading?: boolean, error?: unknown, onRetry?: () => void }} props
 */
export default function ReviewList({
  reviews = [],
  isLoading = false,
  error = null,
  onRetry,
}) {
  const { page, totalPages, goTo } = usePagination({
    totalItems: reviews.length,
    pageSize: PAGE_SIZE,
  });
  const pageItems = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (error) return <ErrorHandler error={error} onRetry={onRetry} />;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first to share your experience."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {pageItems.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {totalPages > 1 ? (
        <div className="mt-2">
          <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />
        </div>
      ) : null}
    </div>
  );
}
