// TODO: Implement useStripePayment
// Creates a Stripe PaymentIntent server-side, confirms on client with @stripe/react-stripe-js

export function useStripePayment() {
  return { clientSecret: null, isLoading: false, error: null };
}
