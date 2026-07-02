import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Hash,
  LayoutDashboard,
} from "lucide-react";

import Button from "@shared/components/ui/Button";
import Skeleton from "@shared/components/ui/Skeleton";
import { formatCurrency, formatServiceType } from "@shared/utils";
import { PaymentStatus } from "@shared/types/enums";
import { useBooking } from "../hooks/useBooking";
import { getBookingPrimaryDetail, getBookingServiceMeta } from "../utils/bookingUi";

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const { data: booking, isLoading } = useBooking(bookingId);

  const isPayable =
    booking?.total_amount != null &&
    booking?.payment_status !== PaymentStatus.FULLY_PAID;

  const meta = booking ? getBookingServiceMeta(booking.type) : null;
  const ServiceIcon = meta?.icon;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-8 text-center">
      {/* success ring */}
      <div className="relative">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </span>
        {/* decorative pulse */}
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-40 dark:bg-emerald-500/10" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-stone-950 dark:text-stone-50">
          Booking received!
        </h1>
        <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">
          Your request has been submitted to the operations team.
        </p>
      </div>

      {/* booking summary card */}
      {isLoading ? (
        <div className="w-full space-y-3">
          <Skeleton height={24} />
          <Skeleton height={80} />
        </div>
      ) : booking ? (
        <div className="w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
          {/* service row */}
          <div className="flex items-center gap-3 border-b border-stone-100 p-4 dark:border-stone-800">
            {ServiceIcon && meta ? (
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.accent}`}
              >
                <ServiceIcon className="h-4 w-4" />
              </span>
            ) : null}
            <div className="min-w-0 text-left">
              <p className="font-semibold text-stone-950 dark:text-stone-50">
                {formatServiceType(booking.type)}
              </p>
              <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                {getBookingPrimaryDetail(booking)}
              </p>
            </div>
          </div>

          {/* detail rows */}
          <dl className="divide-y divide-stone-100 dark:divide-stone-800">
            <div className="flex items-center gap-2 px-4 py-3">
              <Hash className="h-4 w-4 shrink-0 text-stone-400" />
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Reference
              </dt>
              <dd className="ml-auto font-mono text-xs text-stone-700 dark:text-stone-300">
                {booking.id}
              </dd>
            </div>

            <div className="flex items-center gap-2 px-4 py-3">
              <Clock3 className="h-4 w-4 shrink-0 text-stone-400" />
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Status
              </dt>
              <dd className="ml-auto text-xs font-semibold capitalize text-amber-700 dark:text-amber-300">
                {booking.status}
              </dd>
            </div>

            {booking.total_amount != null ? (
              <div className="flex items-center gap-2 px-4 py-3">
                <CreditCard className="h-4 w-4 shrink-0 text-stone-400" />
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  Total
                </dt>
                <dd className="ml-auto text-sm font-bold text-stone-950 dark:text-stone-50">
                  {formatCurrency(booking.total_amount, booking.currency)}
                </dd>
              </div>
            ) : null}
          </dl>

          {/* what happens next */}
          <div className="bg-stone-50 p-4 text-left dark:bg-stone-950/50">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              What happens next
            </p>
            {isPayable ? (
              <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
                A total is ready — pay now to confirm your booking.
              </p>
            ) : (
              <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
                Our team will review your request and send you a quote shortly.
                You'll see it update in your bookings dashboard.
              </p>
            )}
          </div>
        </div>
      ) : bookingId ? (
        <div className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900/50">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Reference:{" "}
            <span className="font-mono text-stone-800 dark:text-stone-200">
              {bookingId}
            </span>
          </p>
        </div>
      ) : null}

      {/* CTAs */}
      <div className="flex w-full flex-col gap-3">
        {isPayable && booking ? (
          <Button as={Link} to={`/dashboard/bookings/${booking.id}/pay`} className="w-full gap-2">
            <CreditCard className="h-4 w-4" />
            Pay now
          </Button>
        ) : null}

        {booking ? (
          <Button
            variant="secondary"
            as={Link}
            to={`/dashboard/bookings/${booking.id}`}
            className="w-full gap-2"
          >
            View booking details
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : null}

        <Button
          variant="secondary"
          as={Link}
          to="/dashboard/bookings"
          className="w-full gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          Back to my bookings
        </Button>
      </div>
    </div>
  );
}
