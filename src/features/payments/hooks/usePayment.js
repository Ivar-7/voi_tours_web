// TODO: Implement usePayment
// Polls GET /payments/:id every 3s while status is 'unpaid'
// Stops polling on 'fully_paid' | 'failed'; navigates accordingly

export function usePayment(paymentId) {
  return { data: null, isLoading: false, error: null };
}
