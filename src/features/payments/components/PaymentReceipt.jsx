import { formatProviderTxId } from "../services/payment.service";

function formatAmount(amount, currency) {
  if (typeof amount !== "number") return "N/A";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency || "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function PaymentReceipt({ payment, booking }) {
  if (!payment && !booking) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Payment receipt
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {booking?.id ? `Booking ${booking.id}` : "Payment summary"}
          </h2>
        </div>
        <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          {payment?.status ?? booking?.status ?? "pending"}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Amount
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {formatAmount(
              payment?.amount ?? booking?.total_amount,
              payment?.currency ?? booking?.currency,
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Provider
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {payment?.provider ?? "N/A"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Transaction ID
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {formatProviderTxId(payment?.provider, payment?.provider_tx_id)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Date
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {formatDate(payment?.created_at)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
