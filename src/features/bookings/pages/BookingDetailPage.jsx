import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Hash,
  Clock3,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import Alert from "@shared/components/ui/Alert";
import Button from "@shared/components/ui/Button";
import Skeleton from "@shared/components/ui/Skeleton";
import { cn } from "@shared/utils/cn";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPassengerTier,
  formatServiceType,
} from "@shared/utils";
import { PaymentStatus, ServiceType } from "@shared/types/enums";

import { useBooking } from "../hooks/useBooking";
import BookingStatusBadge from "../components/BookingStatusBadge";
import { getBookingPrimaryDetail, getBookingServiceMeta } from "../utils/bookingUi";

// ── per-type field configuration ──────────────────────────────────────────────

const FIELD_CONFIG = {
  [ServiceType.SAFARI]: [
    { key: "package_name", label: "Package" },
    { key: "travel_date", label: "Travel date", format: formatDate },
    { key: "party_size", label: "Party size" },
    { key: "tier_applied", label: "Tier", format: formatPassengerTier },
    { key: "season_applied", label: "Season" },
  ],
  [ServiceType.SGR_TRANSFER]: [
    { key: "pickup_location", label: "Pickup" },
    { key: "dropoff_location", label: "Drop-off" },
    { key: "pickup_time", label: "Pickup time", format: formatDateTime },
    { key: "vehicle_type", label: "Vehicle type" },
    { key: "flight_or_train_number", label: "Train / flight no." },
  ],
  [ServiceType.FLIGHT]: [
    { key: "pickup_location", label: "Pickup" },
    { key: "dropoff_location", label: "Drop-off" },
    { key: "pickup_time", label: "Pickup time", format: formatDateTime },
    { key: "vehicle_type", label: "Vehicle type" },
    { key: "flight_or_train_number", label: "Flight no." },
  ],
  [ServiceType.DELIVERY]: [
    { key: "sender_address", label: "Sender address" },
    { key: "recipient_name", label: "Recipient" },
    { key: "recipient_phone", label: "Recipient phone" },
    { key: "delivery_address", label: "Delivery address" },
    { key: "parcel_weight_kg", label: "Parcel weight (kg)" },
    { key: "delivery_instructions", label: "Instructions" },
  ],
  [ServiceType.HOTEL]: [
    { key: "hotel_name", label: "Hotel" },
    { key: "room_category", label: "Room category" },
    { key: "check_in", label: "Check-in", format: formatDate },
    { key: "check_out", label: "Check-out", format: formatDate },
    { key: "number_of_rooms", label: "Rooms" },
  ],
  [ServiceType.EVENT]: [
    { key: "event_name", label: "Event" },
    { key: "event_type", label: "Event type" },
    { key: "venue_name", label: "Venue" },
    { key: "event_date", label: "Event date", format: formatDate },
    { key: "estimated_attendees", label: "Est. attendees" },
  ],
};

/** Returns the nested service-specific sub-object for a booking. */
function getNestedData(booking) {
  if (!booking) return null;
  switch (booking.type) {
    case ServiceType.SAFARI:
      return booking.safari;
    case ServiceType.SGR_TRANSFER:
    case ServiceType.FLIGHT:
      return booking.transfer;
    case ServiceType.DELIVERY:
      return booking.delivery;
    case ServiceType.HOTEL:
      return booking.hotel;
    case ServiceType.EVENT:
      return booking.event;
    default:
      return null;
  }
}

// ── sub-components ─────────────────────────────────────────────────────────────

function DetailField({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-950/60">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-stone-950 dark:text-stone-50">
        {String(value)}
      </p>
    </div>
  );
}

function PaymentStatusChip({ status }) {
  const config = {
    [PaymentStatus.UNPAID]: {
      label: "Unpaid",
      cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    },
    [PaymentStatus.PARTIALLY_PAID]: {
      label: "Partially paid",
      cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    },
    [PaymentStatus.FULLY_PAID]: {
      label: "Fully paid",
      cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    [PaymentStatus.FAILED]: {
      label: "Payment failed",
      cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    },
    [PaymentStatus.REFUNDED]: {
      label: "Refunded",
      cls: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    },
  };

  const { label, cls } = config[status] ?? {
    label: status ?? "Unknown",
    cls: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cls,
      )}
    >
      {label}
    </span>
  );
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError, error } = useBooking(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton height={32} />
        <Skeleton height={200} />
        <Skeleton height={160} />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Alert variant="error" title="Couldn't load booking">
          {error?.message ?? "The booking could not be found."}
        </Alert>
        <Button onClick={() => navigate("/dashboard/bookings")}>
          Back to bookings
        </Button>
      </div>
    );
  }

  const meta = getBookingServiceMeta(booking.type);
  const ServiceIcon = meta.icon;
  const nestedData = getNestedData(booking);
  const fields = FIELD_CONFIG[booking.type] ?? [];
  const visibleFields = fields.filter((f) => {
    const v = nestedData?.[f.key];
    return v !== undefined && v !== null && v !== "";
  });

  const isPayable =
    booking.total_amount != null &&
    booking.payment_status !== PaymentStatus.FULLY_PAID &&
    booking.payment_status !== PaymentStatus.REFUNDED;

  return (
    <div className="space-y-6">
      {/* back nav */}
      <Link
        to="/dashboard/bookings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-50"
      >
        <ArrowLeft className="h-4 w-4" />
        All bookings
      </Link>

      {/* header card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900/70 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-4">
            <span
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                meta.accent,
              )}
            >
              <ServiceIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
                Booking detail
              </p>
              <h1 className="mt-1 font-serif text-2xl font-bold text-stone-950 dark:text-stone-50 sm:text-3xl">
                {formatServiceType(booking.type)}
              </h1>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                {getBookingPrimaryDetail(booking)}
              </p>
            </div>
          </div>

          {/* status badges */}
          <div className="flex flex-wrap items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusChip status={booking.payment_status} />
          </div>
        </div>

        {/* meta row */}
        <div className="mt-5 flex flex-wrap gap-5 border-t border-stone-100 pt-5 dark:border-stone-800">
          <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
            <Hash className="h-4 w-4 text-stone-400" />
            <span className="font-mono text-xs text-stone-700 dark:text-stone-300">
              {booking.id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
            <CalendarDays className="h-4 w-4 text-stone-400" />
            Booked {formatDate(booking.created_at)}
          </div>
          {booking.updated_at && booking.updated_at !== booking.created_at ? (
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <Clock3 className="h-4 w-4 text-stone-400" />
              Updated {formatDateTime(booking.updated_at)}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* service details */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Request details
            </h2>

            {visibleFields.length > 0 ? (
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {visibleFields.map((field) => {
                  const rawValue = nestedData?.[field.key];
                  const displayValue = field.format
                    ? field.format(rawValue)
                    : String(rawValue);
                  return (
                    <DetailField
                      key={field.key}
                      label={field.label}
                      value={displayValue}
                    />
                  );
                })}
              </dl>
            ) : (
              <p className="mt-4 rounded-xl bg-stone-50 p-4 text-sm text-stone-600 dark:bg-stone-950/60 dark:text-stone-400">
                No service details on record.
              </p>
            )}
          </div>

          {/* notes / special requests */}
          {booking.notes ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Notes
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-300">
                {booking.notes}
              </p>
            </div>
          ) : null}
        </div>

        {/* sidebar */}
        <aside className="space-y-4">
          {/* quote / pricing card */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-stone-900/50">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Pricing
            </p>

            {booking.total_amount != null ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    Total
                  </span>
                  <span className="font-serif text-2xl font-bold text-stone-950 dark:text-stone-50">
                    {formatCurrency(booking.total_amount, booking.currency)}
                  </span>
                </div>

                {isPayable ? (
                  <Button
                    as={Link}
                    to={`/dashboard/bookings/${booking.id}/pay`}
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay now
                  </Button>
                ) : booking.payment_status === PaymentStatus.FULLY_PAID ? (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Payment complete
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  Awaiting quote from operations
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {meta.eta}. You'll be notified once a total is confirmed.
                </p>
              </div>
            )}
          </div>

          {/* status timeline */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Status
            </p>

            <div className="mt-4 space-y-1">
              {[
                { key: "pending", label: "Submitted" },
                { key: "confirmed", label: "Confirmed" },
                { key: "in_progress", label: "In progress" },
                { key: "completed", label: "Completed" },
              ].map((s, i, arr) => {
                const statusOrder = arr.map((x) => x.key);
                const bookingIndex = statusOrder.indexOf(booking.status);
                const thisIndex = statusOrder.indexOf(s.key);
                const isDone = bookingIndex >= thisIndex && bookingIndex !== -1;
                const isNow = booking.status === s.key;

                return (
                  <div key={s.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          isDone
                            ? "bg-amber-600 text-white dark:bg-amber-500"
                            : "border border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800",
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                        )}
                      </span>
                      {i < arr.length - 1 ? (
                        <span
                          className={cn(
                            "my-0.5 h-5 w-px",
                            isDone ? "bg-amber-400 dark:bg-amber-600" : "bg-stone-200 dark:bg-stone-700",
                          )}
                        />
                      ) : null}
                    </div>
                    <p
                      className={cn(
                        "pt-0.5 text-sm",
                        isNow
                          ? "font-semibold text-stone-950 dark:text-stone-50"
                          : isDone
                            ? "text-stone-700 dark:text-stone-300"
                            : "text-stone-400 dark:text-stone-600",
                      )}
                    >
                      {s.label}
                    </p>
                  </div>
                );
              })}

              {booking.status === "cancelled" ? (
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Booking cancelled
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
