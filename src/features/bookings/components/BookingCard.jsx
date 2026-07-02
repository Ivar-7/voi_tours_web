import { Link } from "react-router-dom";
import { ArrowRight, Clock3, CreditCard } from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@shared/utils";
import { cn } from "@shared/utils/cn";
import { PaymentStatus } from "@shared/types/enums";
import { getBookingPrimaryDetail, getBookingServiceMeta } from "../utils/bookingUi";
import BookingStatusBadge from "./BookingStatusBadge";

/**
 * @param {{ booking: import('@/shared/types/models').Booking }} props
 */
export default function BookingCard({ booking }) {
  const meta = getBookingServiceMeta(booking.type);
  const Icon = meta.icon;
  const isPayable =
    booking.total_amount != null &&
    booking.payment_status !== PaymentStatus.FULLY_PAID;

  return (
    <Link
      to={`/dashboard/bookings/${booking.id}`}
      className="group grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-50/30 dark:border-stone-800 dark:bg-stone-900/70 dark:hover:border-amber-500/60 dark:hover:bg-amber-950/10 sm:grid-cols-[1fr_auto] sm:p-5"
    >
      <div className="flex min-w-0 gap-4">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            meta.accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-stone-950 dark:text-stone-50">
              {formatServiceType(booking.type)}
            </p>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="mt-1 truncate text-sm text-stone-600 dark:text-stone-400">
            {getBookingPrimaryDetail(booking)}
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
            <Clock3 className="h-3.5 w-3.5" />
            Booked {formatDate(booking.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 border-t border-stone-100 pt-4 dark:border-stone-800 sm:flex-col sm:border-t-0 sm:pt-0 sm:text-right">
        <div>
          <p className="font-semibold text-stone-950 dark:text-stone-50">
            {booking.total_amount != null
              ? formatCurrency(booking.total_amount, booking.currency)
              : "Awaiting quote"}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 sm:justify-end">
            <CreditCard className="h-3.5 w-3.5" />
            {isPayable ? "Payment available" : booking.payment_status}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
          Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
