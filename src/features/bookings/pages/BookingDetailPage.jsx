import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Alert from "@shared/components/ui/Alert";
import Skeleton from "@shared/components/ui/Skeleton";
import Button from "@shared/components/ui/Button";
import { formatCurrency, formatDate, formatServiceType } from "@shared/utils";
import { PaymentStatus } from "@shared/types/enums";
import { usePackageById } from "@features/packages/hooks/usePackageById";

import BookingStatusBadge from "../components/BookingStatusBadge";
import BookingReview from "../components/BookingReview";
import { useBooking } from "../hooks/useBooking";

const SUB_KEY = {
  safari: "safari",
  sgr_transfer: "transfer",
  flight: "transfer",
  hotel: "hotel",
  event: "event",
  delivery: "delivery",
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const { data: booking, isLoading, isError, error } = useBooking(id);

  const safariPackageId =
    booking?.type === "safari" ? booking.safari?.package_id : null;
  const { data: safariPackage } = usePackageById(safariPackageId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton height={32} width="40%" />
        <Skeleton height={140} />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="error" title="Couldn't load this booking">
        {error?.message ?? "Please try again."}
      </Alert>
    );
  }

  if (!booking) return null;

  const subKey = SUB_KEY[booking.type];
  const detailData = {
    ...(booking[subKey] || {}),
    ...(safariPackage ? { package_name: safariPackage.title } : {}),
    total_amount: booking.total_amount,
    currency: booking.currency,
  };

  const canPay =
    booking.total_amount != null &&
    booking.payment_status !== PaymentStatus.FULLY_PAID;

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to my bookings
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text-primary">
            {formatServiceType(booking.type)} booking
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Booked {formatDate(booking.created_at)} · Ref{" "}
            <span className="font-mono">{booking.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      <BookingReview type={booking.type} formData={detailData} />

      <div className="rounded-card border border-border bg-surface p-card-p">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">
              Payment status
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {booking.total_amount != null
                ? formatCurrency(booking.total_amount, booking.currency)
                : "Awaiting a quote from our team"}
            </p>
          </div>
          <BookingStatusBadge status={booking.payment_status} />
        </div>

        {canPay ? (
          <Button
            as={Link}
            to={`/dashboard/bookings/${booking.id}/pay`}
            className="mt-4 w-full"
          >
            Pay now
          </Button>
        ) : null}
      </div>
    </div>
  );
}
