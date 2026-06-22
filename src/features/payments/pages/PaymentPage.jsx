import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import Alert from "@shared/components/ui/Alert";
import Button from "@shared/components/ui/Button";
import Skeleton from "@shared/components/ui/Skeleton";
import { formatCurrency, formatServiceType } from "@shared/utils";
import { PaymentStatus } from "@shared/types/enums";
import { useBooking } from "@features/bookings/hooks/useBooking";
import MpesaPaymentForm from "../components/MpesaPaymentForm";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { data: booking, isLoading, error, refetch } = useBooking(bookingId);

  if (!bookingId) {
    return (
      <div className="mx-auto max-w-lg">
        <Alert variant="error" title="Missing booking reference" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg">
        <Skeleton height={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg">
        <Alert variant="error" title="Couldn't load this booking">
          {error.message ?? "Please try again."}
        </Alert>
        <Button className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const alreadyPaid = booking.payment_status === PaymentStatus.FULLY_PAID;

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Link
          to={`/dashboard/bookings/${bookingId}`}
          className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          View booking
        </Link>
      </div>

      <div className="rounded-card border border-border bg-surface p-card-p">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Payment
            </p>
            <h1 className="mt-2 text-xl font-semibold text-text-primary">
              {formatServiceType(booking.type)} booking
            </h1>
          </div>
          <ShieldCheck className="h-5 w-5 text-status-completed" />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-text-muted">Amount due</span>
          <span className="text-lg font-semibold text-text-primary">
            {formatCurrency(booking.total_amount, booking.currency)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        {booking.total_amount == null ? (
          <Alert variant="info" title="This booking isn't priced yet">
            Our team will follow up with a quote before you can pay.
          </Alert>
        ) : alreadyPaid ? (
          <Alert
            variant="success"
            title="This booking is already paid in full"
          />
        ) : (
          <MpesaPaymentForm booking={booking} />
        )}
      </div>
    </div>
  );
}
