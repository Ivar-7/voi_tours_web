import { useMutation } from '@tanstack/react-query';
import { initiatePayment } from '../api/payments.api';

function pickClientSecret(data) {
  return (
    data?.clientSecret ??
    data?.client_secret ??
    data?.paymentIntent?.clientSecret ??
    data?.payment_intent_client_secret ??
    data?.stripeClientSecret ??
    data?.stripe_client_secret ??
    null
  );
}

export function useStripePayment() {
  const mutation = useMutation({
    mutationFn: async ({ bookingId, amount, currency }) => {
      return initiatePayment(bookingId, 'stripe', amount, currency);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    clientSecret: pickClientSecret(mutation.data),
    paymentId: mutation.data?.id ?? mutation.data?.payment?.id ?? null,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}
