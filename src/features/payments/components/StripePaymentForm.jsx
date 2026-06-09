import { useEffect, useMemo, useState } from 'react';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { getStripeInstance } from '../services/stripe.service';
import { useStripePayment } from '../hooks/useStripePayment';
import PaymentStatusPoller from './PaymentStatusPoller';

function CardCheckoutForm({ clientSecret, booking, paymentId, onPaid }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: booking?.user?.full_name ?? booking?.full_name ?? undefined,
          email: booking?.user?.email ?? booking?.email ?? undefined,
        },
      },
    });

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error.message || 'Card payment could not be completed.');
      return;
    }

    if (result.paymentIntent?.status === 'succeeded' || result.paymentIntent?.status === 'processing') {
      onPaid(result.paymentIntent.id || paymentId);
    } else {
      setErrorMessage('Card payment did not complete.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <CardElement
          options={{
            style: {
              base: {
                color: '#0f172a',
                fontSize: '16px',
                '::placeholder': {
                  color: '#94a3b8',
                },
              },
              invalid: {
                color: '#ef4444',
              },
            },
          }}
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        Pay with card
      </button>
    </form>
  );
}

export default function StripePaymentForm({ booking }) {
  const { mutateAsync, clientSecret, paymentId, isLoading, error, data } = useStripePayment();
  const [resolvedPaymentId, setResolvedPaymentId] = useState('');
  const [stripeInstance, setStripeInstance] = useState(undefined);

  const finalPaymentId = resolvedPaymentId || paymentId;

  useEffect(() => {
    let mounted = true;

    getStripeInstance().then((instance) => {
      if (mounted) setStripeInstance(instance);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const canSubmit = useMemo(() => Boolean(booking?.id && booking?.total_amount), [booking]);

  async function preparePayment() {
    const response = await mutateAsync({
      bookingId: booking.id,
      amount: booking.total_amount,
      currency: booking.currency,
    });

    setResolvedPaymentId(
      response?.id ?? response?.payment?.id ?? response?.paymentId ?? response?.payment_id ?? '',
    );
  }

  if (finalPaymentId) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Card payment started</p>
              <p className="text-sm text-emerald-800/90 dark:text-emerald-200/80">
                Complete the confirmation step to finish the payment.
              </p>
            </div>
          </div>
        </div>
        <PaymentStatusPoller paymentId={finalPaymentId} bookingId={booking.id} />
      </div>
    );
  }

  if (stripeInstance === undefined) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        Preparing secure card payment...
      </div>
    );
  }

  if (!stripeInstance) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        Stripe is not configured for this environment.
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          We’ll create a secure card payment session before you enter card details.
        </p>
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error.message || 'Unable to prepare card payment.'}
          </p>
        ) : null}
        <button
          type="button"
          onClick={preparePayment}
          disabled={!canSubmit || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          Prepare card payment
        </button>
        {data?.status ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Session status: {data.status}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <Elements stripe={stripeInstance} options={{ clientSecret }}>
      <CardCheckoutForm
        clientSecret={clientSecret}
        booking={booking}
        paymentId={finalPaymentId}
        onPaid={(id) => setResolvedPaymentId(id)}
      />
    </Elements>
  );
}
