import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import Button from "@shared/components/ui/Button";
import Spinner from "@shared/components/ui/Spinner";
import { useBooking } from "../hooks/useBooking";

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const { data: booking, isLoading } = useBooking(bookingId);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-status-completed/10 text-status-completed">
        <CheckCircle2 className="h-8 w-8" />
      </span>

      <h1 className="font-serif text-2xl font-bold text-text-primary">
        Booking received
      </h1>

      {bookingId ? (
        <p className="text-sm text-text-muted">
          Reference:{" "}
          <span className="font-mono text-text-secondary">{bookingId}</span>
        </p>
      ) : null}

      {isLoading ? (
        <Spinner />
      ) : booking?.total_amount != null ? (
        <p className="text-sm text-text-secondary">
          Your total is ready — pay now to confirm your booking.
        </p>
      ) : (
        <p className="text-sm text-text-secondary">
          Our team will review your request and send you a quote shortly.
        </p>
      )}

      <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {booking?.total_amount != null ? (
          <Button as={Link} to={`/dashboard/bookings/${bookingId}/pay`}>
            Pay now
          </Button>
        ) : null}
        <Button variant="secondary" as={Link} to="/dashboard/bookings">
          View my bookings
        </Button>
      </div>
    </div>
  );
}
