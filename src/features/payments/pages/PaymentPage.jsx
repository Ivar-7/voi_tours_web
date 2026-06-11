import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldCheck, Wallet } from "lucide-react";
import { useBooking } from "@/features/bookings/hooks/useBooking";
import { getAvailableProviders } from "../services/payment.service";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import MpesaPaymentForm from "../components/MpesaPaymentForm";
import StripePaymentForm from "../components/StripePaymentForm";

function formatAmount(amount, currency) {
  if (typeof amount !== "number") return "N/A";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency || "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ProviderPanel({ provider, booking }) {
  if (provider === "mpesa") {
    return <MpesaPaymentForm booking={booking} />;
  }

  if (provider === "stripe") {
    return <StripePaymentForm booking={booking} />;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start gap-3">
        <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Bank transfer
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            This booking can be held while you transfer funds manually.
          </p>
        </div>
      </div>
      <div className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-300">
        Use your booking reference as the transfer reference and keep the
        receipt for verification.
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const bookingQuery = useBooking(bookingId);
  const booking = bookingQuery.data;
  const availableProviders = useMemo(
    () => getAvailableProviders(booking?.currency),
    [booking?.currency],
  );
  const [selectedProvider, setSelectedProvider] = useState("mpesa");
  const activeProvider = availableProviders.includes(selectedProvider)
    ? selectedProvider
    : (availableProviders[0] ?? "bank_transfer");

  if (!bookingId) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Missing booking reference.
        </div>
      </div>
    );
  }

  if (bookingQuery.isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-12">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading booking details
        </div>
      </div>
    );
  }

  if (bookingQuery.error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-12">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-medium">Could not load booking</p>
          <p className="mt-1 opacity-90">
            {bookingQuery.error.message || "Please try again in a moment."}
          </p>
          <button
            type="button"
            onClick={() => bookingQuery.refetch()}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Link
          to={`/dashboard/bookings/${bookingId}`}
          className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          View booking
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Payment
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Complete your booking payment
                </h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  Choose a payment method and finish the booking balance for
                  this reservation.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Booking reference
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {booking.id}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Amount due
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {formatAmount(booking.total_amount, booking.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Currency
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {booking.currency}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Select a payment method
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Available options depend on the booking currency.
              </p>
            </div>
            <PaymentMethodSelector
              currency={booking.currency}
              value={activeProvider}
              onChange={setSelectedProvider}
            />
          </div>

          <ProviderPanel provider={activeProvider} booking={booking} />
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Payment summary
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Booking status
                </dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                  {booking.status}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Currency</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                  {booking.currency}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Available methods
                </dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                  {availableProviders.length}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
