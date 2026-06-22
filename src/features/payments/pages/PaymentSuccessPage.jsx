import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

import Button from "@shared/components/ui/Button";
import Spinner from "@shared/components/ui/Spinner";
import { useBooking } from "@features/bookings/hooks/useBooking";
import { usePayment } from "../hooks/usePayment";
import PaymentReceipt from "../components/PaymentReceipt";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const bookingId =
    searchParams.get("bookingId") || location.state?.bookingId || "";
  const paymentId =
    searchParams.get("paymentId") || location.state?.paymentId || "";

  const bookingQuery = useBooking(bookingId);
  const paymentQuery = usePayment(paymentId);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="rounded-card border border-status-completed/30 bg-status-completed/10 p-6">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="mt-1 h-8 w-8 shrink-0 text-status-completed" />
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-status-completed">
              Payment successful
            </p>
            <h1 className="text-2xl font-semibold text-text-primary">
              Your payment has been confirmed.
            </h1>
            <p className="text-sm text-text-secondary">
              We've recorded your payment and your booking is on its way.
            </p>
          </div>
        </div>
      </div>

      {!bookingId && !paymentId ? (
        <p className="text-sm text-text-muted">
          No payment details were passed to this page.
        </p>
      ) : null}

      <PaymentReceipt payment={paymentQuery.data} booking={bookingQuery.data} />

      <div className="flex flex-wrap gap-3">
        <Button
          as={Link}
          to={bookingId ? `/dashboard/bookings/${bookingId}` : "/dashboard/bookings"}
        >
          View booking
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button as={Link} to="/dashboard/bookings" variant="secondary">
          Back to bookings
        </Button>
      </div>

      {paymentQuery.isLoading || bookingQuery.isLoading ? (
        <div className="inline-flex items-center gap-2 text-sm text-text-muted">
          <Spinner size="sm" /> Loading receipt details…
        </div>
      ) : null}
    </div>
  );
}
