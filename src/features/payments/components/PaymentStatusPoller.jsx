import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@shared/utils/cn";
import { usePayment } from "../hooks/usePayment";

const STYLES = {
  failed:
    "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled",
  cancelled:
    "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled",
  paid: "border-status-completed/30 bg-status-completed/10 text-status-completed",
  pending: "border-border bg-surface text-text-secondary",
};

const COPY = {
  failed: {
    title: "Payment failed.",
    body: "Please retry the payment or check your M-Pesa balance.",
  },
  cancelled: {
    title: "Payment cancelled.",
    body: "You can retry whenever you're ready.",
  },
  paid: {
    title: "Payment confirmed.",
    body: "Redirecting you to your receipt…",
  },
  pending: {
    title: "Waiting for you to enter your M-Pesa PIN…",
    body: "This updates automatically — no need to refresh.",
  },
};

/**
 * @param {{ paymentId: string, bookingId?: string, className?: string }} props
 */
export default function PaymentStatusPoller({
  paymentId,
  bookingId,
  className,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: payment } = usePayment(paymentId);
  const status = payment?.status ?? "pending";

  useEffect(() => {
    if (!payment?.status) return;

    if (payment.status === "paid") {
      navigate(
        `/dashboard/payment/success?paymentId=${encodeURIComponent(paymentId)}${bookingId ? `&bookingId=${encodeURIComponent(bookingId)}` : ""}`,
        { replace: true, state: { payment, bookingId, from: location.pathname } },
      );
    }

    if (payment.status === "failed" || payment.status === "cancelled") {
      navigate(
        `/dashboard/payment/failed?paymentId=${encodeURIComponent(paymentId)}${bookingId ? `&bookingId=${encodeURIComponent(bookingId)}` : ""}`,
        { replace: true, state: { payment, bookingId, from: location.pathname } },
      );
    }
  }, [bookingId, location.pathname, navigate, payment, paymentId]);

  if (!paymentId) return null;

  const copy = COPY[status] ?? COPY.pending;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-card border px-4 py-3.5",
        STYLES[status] ?? STYLES.pending,
        className,
      )}
    >
      {status === "failed" || status === "cancelled" ? (
        <XCircle className="h-5 w-5 shrink-0" />
      ) : status === "paid" ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      ) : (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium">{copy.title}</p>
        <p className="text-sm opacity-80">{copy.body}</p>
      </div>
    </div>
  );
}
