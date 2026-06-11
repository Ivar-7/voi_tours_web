import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, BadgeInfo } from "lucide-react";
import { useBooking } from "@/features/bookings/hooks/useBooking";
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
    <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-10">
      <div className="w-full space-y-6">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="mt-1 h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700/80 dark:text-emerald-200/80">
                Payment successful
              </p>
              <h1 className="text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                Your payment has been confirmed.
              </h1>
              <p className="text-sm text-emerald-800/90 dark:text-emerald-200/80">
                We have recorded the payment and your booking is ready for the
                next step.
              </p>
            </div>
          </div>
        </div>

        {!bookingId && !paymentId ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            No payment details were passed to this page.
          </div>
        ) : null}

        <PaymentReceipt
          payment={paymentQuery.data}
          booking={bookingQuery.data}
        />

        <div className="flex flex-wrap gap-3">
          <Link
            to={
              bookingId
                ? `/dashboard/bookings/${bookingId}`
                : "/dashboard/bookings"
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            View booking
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard/bookings"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Back to bookings
          </Link>
        </div>

        {paymentQuery.isLoading || bookingQuery.isLoading ? (
          <div className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <BadgeInfo className="h-4 w-4" />
            Loading receipt details...
          </div>
        ) : null}
      </div>
    </div>
  );
}
