import { formatCurrency, formatDateTime } from "@shared/utils";
import Badge from "@shared/components/ui/Badge";
import { formatProviderTxId } from "../services/payment.service";

/**
 * @param {{ payment: import('@/shared/types/models').Payment, booking: import('@/shared/types/models').Booking }} props
 */
export default function PaymentReceipt({ payment, booking }) {
  if (!payment && !booking) return null;

  return (
    <div className="rounded-card border border-border bg-surface p-card-p">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Payment receipt
          </p>
          <h2 className="mt-1 text-lg font-semibold text-text-primary">
            {booking?.id ? `Booking ${booking.id}` : "Payment summary"}
          </h2>
        </div>
        <Badge status={payment?.status ?? booking?.status ?? "pending"} />
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-text-muted">
            Amount
          </dt>
          <dd className="mt-1 text-sm font-medium text-text-primary">
            {formatCurrency(
              payment?.amount ?? booking?.total_amount,
              booking?.currency ?? "KES",
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-text-muted">
            Method
          </dt>
          <dd className="mt-1 text-sm font-medium text-text-primary">
            M-Pesa{payment?.phone ? ` · ${payment.phone}` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-text-muted">
            Transaction ID
          </dt>
          <dd className="mt-1 text-sm font-medium text-text-primary">
            {formatProviderTxId(payment?.checkoutRequestID)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-text-muted">
            Date
          </dt>
          <dd className="mt-1 text-sm font-medium text-text-primary">
            {formatDateTime(payment?.confirmedAt ?? payment?.createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
