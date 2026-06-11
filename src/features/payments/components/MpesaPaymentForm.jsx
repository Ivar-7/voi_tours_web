import { useMemo, useState } from "react";
import { Loader2, Phone, ShieldCheck } from "lucide-react";
import {
  validateSafaricomPhone,
  formatSafaricomPhone,
} from "../services/mpesa.service";
import { useMpesaPayment } from "../hooks/useMpesaPayment";
import PaymentStatusPoller from "./PaymentStatusPoller";

export default function MpesaPaymentForm({ booking }) {
  const [phone, setPhone] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [resolvedPaymentId, setResolvedPaymentId] = useState("");
  const { mutateAsync, isPending, checkoutRequestId, error } =
    useMpesaPayment();

  const paymentId = resolvedPaymentId || checkoutRequestId;

  const formattedPhone = useMemo(() => formatSafaricomPhone(phone), [phone]);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalisedPhone = formatSafaricomPhone(phone);

    if (!validateSafaricomPhone(normalisedPhone)) {
      setFieldError(
        "Enter a valid Safaricom number starting with 07, 01 or +254.",
      );
      return;
    }

    setFieldError("");
    const response = await mutateAsync({
      bookingId: booking.id,
      phone: normalisedPhone,
      amount: booking.total_amount,
      currency: booking.currency,
    });

    setResolvedPaymentId(
      response?.paymentId ??
        response?.payment_id ??
        response?.id ??
        response?.payment?.id ??
        response?.checkoutRequestId ??
        response?.checkout_request_id ??
        "",
    );
  }

  if (paymentId) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Check your phone</p>
              <p className="text-sm text-emerald-800/90 dark:text-emerald-200/80">
                We have sent the M-Pesa prompt to{" "}
                {formattedPhone || "your phone"}.
              </p>
            </div>
          </div>
        </div>
        <PaymentStatusPoller paymentId={paymentId} bookingId={booking.id} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Phone number
        </span>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setFieldError("");
            }}
            placeholder="+2547XXXXXXXX"
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-10 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
          />
        </div>
      </label>

      {(fieldError || error?.message) && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {fieldError || error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send M-Pesa prompt
      </button>
    </form>
  );
}
