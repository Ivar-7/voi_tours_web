// TODO: Implement useMpesaPayment
// Triggers STK Push via POST /payments/mpesa/stk-push
// Returns checkoutRequestId for polling

export function useMpesaPayment() {
  return { mutate: () => {}, isPending: false, checkoutRequestId: null, error: null };
}
