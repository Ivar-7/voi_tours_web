import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { usePayment } from "../hooks/usePayment";

export default function PaymentStatusPoller({
  paymentId,
  bookingId,
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentQuery = usePayment(paymentId);
  const payment = paymentQuery.data;

  useEffect(() => {
    if (!payment?.status) return;

    if (payment.status === "fully_paid") {
      navigate(
        `/dashboard/payment/success?paymentId=${encodeURIComponent(paymentId)}${bookingId ? `&bookingId=${encodeURIComponent(bookingId)}` : ""}`,
        {
          replace: true,
          state: { payment, bookingId, from: location.pathname },
        },
      );
    }

    if (payment.status === "failed") {
      navigate(
        `/dashboard/payment/failed?paymentId=${encodeURIComponent(paymentId)}${bookingId ? `&bookingId=${encodeURIComponent(bookingId)}` : ""}`,
        {
          replace: true,
          state: { payment, bookingId, from: location.pathname },
        },
      );
    }
  }, [bookingId, location.pathname, navigate, payment, paymentId]);

  if (!paymentId) return null;

  const status = payment?.status ?? "unpaid";

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border px-4 py-3",
        status === "failed"
          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200"
          : status === "fully_paid"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
            : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300",
        className,
      ].join(" ")}
    >
      {status === "failed" ? (
        <XCircle className="h-5 w-5 shrink-0" />
      ) : status === "fully_paid" ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      ) : (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {status === "failed"
            ? "Payment failed."
            : status === "fully_paid"
              ? "Payment confirmed."
              : "Waiting for payment confirmation."}
        </p>
        <p className="text-sm opacity-80">
          {status === "failed"
            ? "Please retry the payment or choose another method."
            : "This view updates automatically every few seconds."}
        </p>
      </div>
    </div>
  );
}
