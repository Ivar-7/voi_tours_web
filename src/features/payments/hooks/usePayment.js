import { useEffect, useState } from "react";
import { subscribeToPayment, checkPaymentStatus } from "../api/payments.api";

const TERMINAL = new Set(["paid", "failed", "cancelled"]);
const FALLBACK_POLL_MS = 8000;

/**
 * Live status for a single payment. Primarily driven by a Firestore
 * listener (the `payheroCallback` webhook updates the doc in real time);
 * a fallback `checkPaymentStatus` poll covers webhook delays/misses.
 *
 * @param {string} paymentId
 */
export function usePayment(paymentId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentId) return undefined;

    return subscribeToPayment(
      paymentId,
      (payment) => setData(payment),
      (err) => setError(err),
    );
  }, [paymentId]);

  useEffect(() => {
    if (!paymentId || (data && TERMINAL.has(data.status))) return undefined;

    const interval = setInterval(() => {
      checkPaymentStatus(paymentId).catch(() => {
        // Listener (or the next poll) will pick it up — no need to surface
        // a transient network error here.
      });
    }, FALLBACK_POLL_MS);

    return () => clearInterval(interval);
  }, [paymentId, data]);

  return {
    data,
    error,
    isLoading: Boolean(paymentId) && !data && !error,
  };
}
