import { useMutation } from "@tanstack/react-query";
import httpClient, { normaliseError } from "@/shared/api";

function pickPaymentId(data) {
  return (
    data?.paymentId ??
    data?.payment_id ??
    data?.id ??
    data?.payment?.id ??
    data?.payment?.paymentId ??
    data?.checkoutRequestId ??
    data?.checkout_request_id ??
    null
  );
}

export function useMpesaPayment() {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      try {
        return await httpClient.post("/payments/mpesa/stk-push", payload);
      } catch (error) {
        throw normaliseError(error);
      }
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    checkoutRequestId: pickPaymentId(mutation.data),
    error: mutation.error,
    data: mutation.data,
  };
}
