import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export async function getStripeInstance() {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    stripePromise = publishableKey
      ? loadStripe(publishableKey)
      : Promise.resolve(null);
  }

  return stripePromise;
}
