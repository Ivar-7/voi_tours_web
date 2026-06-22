import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowRight, LifeBuoy } from "lucide-react";

import Button from "@shared/components/ui/Button";

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const bookingId =
    searchParams.get("bookingId") || location.state?.bookingId || "";
  const paymentId =
    searchParams.get("paymentId") || location.state?.paymentId || "";

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="rounded-card border border-status-cancelled/30 bg-status-cancelled/10 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-8 w-8 shrink-0 text-status-cancelled" />
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-status-cancelled">
              Payment failed
            </p>
            <h1 className="text-2xl font-semibold text-text-primary">
              We couldn't confirm the payment.
            </h1>
            <p className="text-sm text-text-secondary">
              You can retry the payment, or contact support if this keeps
              happening.
            </p>
          </div>
        </div>
      </div>

      {paymentId ? (
        <p className="text-sm text-text-muted">
          Payment reference:{" "}
          <span className="font-mono text-text-secondary">{paymentId}</span>
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          as={Link}
          to={bookingId ? `/dashboard/bookings/${bookingId}/pay` : "/dashboard/bookings"}
        >
          Retry payment
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button as={Link} to="/inquiry" variant="secondary">
          <LifeBuoy className="h-4 w-4" />
          Contact support
        </Button>
      </div>
    </div>
  );
}
