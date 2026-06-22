import { useState } from "react";
import { Phone, ShieldCheck } from "lucide-react";

import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import Alert from "@shared/components/ui/Alert";
import {
  isValidKenyanPhone,
  normalizeKenyanPhone,
  formatServiceType,
} from "@shared/utils";
import { useMpesaPayment } from "../hooks/useMpesaPayment";
import PaymentStatusPoller from "./PaymentStatusPoller";

/**
 * @param {{ booking: import('@/shared/types/models').Booking }} props
 */
export default function MpesaPaymentForm({ booking }) {
  const [phone, setPhone] = useState("");
  const [fieldError, setFieldError] = useState("");
  const { mutateAsync, isPending, paymentId, error } = useMpesaPayment();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isValidKenyanPhone(phone)) {
      setFieldError(
        "Enter a valid Kenyan number, e.g. 0712345678 or 254712345678.",
      );
      return;
    }

    setFieldError("");

    await mutateAsync({
      amount: booking.total_amount,
      phoneNumber: normalizeKenyanPhone(phone),
      description: `${formatServiceType(booking.type)} booking ${booking.id}`,
      metadata: { bookingId: booking.id },
    });
  }

  if (paymentId) {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant="success" title="Check your phone">
          We've sent an M-Pesa prompt to {normalizeKenyanPhone(phone)}. Enter
          your PIN to complete the payment.
        </Alert>
        <PaymentStatusPoller paymentId={paymentId} bookingId={booking.id} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="M-Pesa phone number"
        placeholder="07XXXXXXXX"
        inputMode="tel"
        autoComplete="tel"
        icon={<Phone className="h-4 w-4" />}
        value={phone}
        onChange={(event) => {
          setPhone(event.target.value);
          setFieldError("");
        }}
        error={fieldError || error?.message}
      />

      <Button type="submit" loading={isPending}>
        <ShieldCheck className="h-4 w-4" />
        Send M-Pesa prompt
      </Button>
    </form>
  );
}
