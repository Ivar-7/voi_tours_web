import Avatar from "@shared/components/ui/Avatar";
import { formatDate } from "@shared/utils";
import StarRating from "./StarRating";

/**
 * @param {{ review: import('@/shared/types/models').Review }} props
 */
export default function ReviewCard({ review }) {
  return (
    <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-card-p">
      <div className="flex items-center gap-3">
        <Avatar name={review.user_name} size="sm" />
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {review.user_name}
          </p>
          <p className="text-xs text-text-muted">
            {formatDate(review.created_at)}
          </p>
        </div>
      </div>

      <StarRating value={review.rating} readOnly size="sm" />

      <p className="text-sm leading-relaxed text-text-secondary">
        {review.comment}
      </p>
    </div>
  );
}
