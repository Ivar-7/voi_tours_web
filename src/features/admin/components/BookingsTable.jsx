import EmptyState from "@shared/components/feedback/EmptyState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import Badge from "@shared/components/ui/Badge";
import { formatCurrency, formatDate, formatServiceType } from "@shared/utils";
import BookingStatusUpdater from "./BookingStatusUpdater";

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-800">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse border-b border-stone-800 bg-stone-900/60 last:border-b-0"
        />
      ))}
    </div>
  );
}

/**
 * @param {{
 *   bookings: import('@/shared/types/models').Booking[],
 *   isLoading?: boolean,
 *   error?: unknown,
 *   onRetry?: () => void,
 *   onSetPrice?: (booking: object) => void,
 * }} props
 */
export default function BookingsTable({
  bookings = [],
  isLoading = false,
  error = null,
  onRetry,
  onSetPrice,
}) {
  if (error) return <ErrorHandler error={error} onRetry={onRetry} />;
  if (isLoading) return <TableSkeleton />;

  if (!bookings.length) {
    return (
      <EmptyState
        title="No bookings yet"
        description="Bookings will show up here as customers make them."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-800">
      <table className="min-w-full text-sm">
        <thead className="bg-stone-900 text-left text-xs uppercase tracking-[0.15em] text-stone-400">
          <tr>
            <th className="px-4 py-3">Booking</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-t border-stone-800 bg-stone-950/40 text-stone-200"
            >
              <td className="px-4 py-4 font-mono text-xs text-stone-400">
                {booking.id}
              </td>
              <td className="px-4 py-4 font-mono text-xs text-stone-400">
                {booking.user_id}
              </td>
              <td className="px-4 py-4">{formatServiceType(booking.type)}</td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-1.5">
                  <Badge status={booking.status} />
                  <Badge status={booking.payment_status} size="sm" />
                </div>
              </td>
              <td className="px-4 py-4">
                {booking.total_amount != null ? (
                  formatCurrency(booking.total_amount, booking.currency)
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetPrice?.(booking)}
                    className="rounded-full border border-amber-500/40 px-3 py-1 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/10"
                  >
                    Set price
                  </button>
                )}
              </td>
              <td className="px-4 py-4 text-stone-400">
                {formatDate(booking.created_at)}
              </td>
              <td className="px-4 py-4 text-right">
                <BookingStatusUpdater
                  bookingId={booking.id}
                  currentStatus={booking.status}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
