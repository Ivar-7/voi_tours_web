import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowRight, LifeBuoy } from "lucide-react";

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const bookingId =
    searchParams.get("bookingId") || location.state?.bookingId || "";
  const paymentId =
    searchParams.get("paymentId") || location.state?.paymentId || "";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-10">
      <div className="w-full space-y-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 dark:border-red-900/60 dark:bg-red-950/30">
          <div className="flex items-start gap-4">
            <AlertTriangle className="mt-1 h-8 w-8 shrink-0 text-red-600 dark:text-red-400" />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-700/80 dark:text-red-200/80">
                Payment failed
              </p>
              <h1 className="text-2xl font-semibold text-red-950 dark:text-red-50">
                We could not confirm the payment.
              </h1>
              <p className="text-sm text-red-800/90 dark:text-red-200/80">
                You can retry the payment or contact support if the issue keeps
                repeating.
              </p>
            </div>
          </div>
        </div>

        {paymentId ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Payment reference:{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {paymentId}
            </span>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Link
            to={
              bookingId
                ? `/dashboard/bookings/${bookingId}/pay`
                : "/dashboard/bookings"
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Retry payment
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/inquiry"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            <LifeBuoy className="h-4 w-4" />
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
