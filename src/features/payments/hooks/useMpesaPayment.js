import { useMutation } from "@tanstack/react-query";
import { initiatePayment } from "../api/payments.api";

/**
 * Initiates an M-Pesa STK push via the `startPayheroPayment` Cloud
 * Function. Resolves with `{ paymentId }`.
 */
export function useMpesaPayment() {
  const mutation = useMutation({
    mutationFn: (payload) => initiatePayment(payload),
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    paymentId: mutation.data?.paymentId ?? null,
    error: mutation.error,
    data: mutation.data,
  };
}
