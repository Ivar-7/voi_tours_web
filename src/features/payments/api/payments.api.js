/**
 * @file payments.api.js
 * Wires the frontend directly to the PayHero Cloud Functions
 * (firebase_functions/src/payments/) instead of a REST backend:
 *
 *   - `initiatePayment`     → `startPayheroPayment` callable (STK push)
 *   - `checkPaymentStatus`  → `checkPaymentStatus` callable (manual re-check)
 *   - `subscribeToPayment`  → Firestore listener on `payments/{paymentId}`,
 *                             updated in real time by the `payheroCallback`
 *                             webhook.
 */

import { httpsCallable } from "firebase/functions";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";

import { db, functions } from "@/config/firebase/firebase.js";
import { normaliseError } from "@/shared/api";

const startPayheroPaymentFn = httpsCallable(functions, "startPayheroPayment");
const checkPaymentStatusFn = httpsCallable(functions, "checkPaymentStatus");

function timestampToIso(value) {
  return value instanceof Timestamp
    ? value.toDate().toISOString()
    : (value ?? null);
}

function snapToPayment(snap) {
  const data = snap.data();

  return {
    ...data,
    id: snap.id,
    createdAt: timestampToIso(data.createdAt),
    confirmedAt: timestampToIso(data.confirmedAt),
  };
}

/**
 * Initiates an M-Pesa STK push via PayHero.
 *
 * @param {{ amount: number, phoneNumber: string, description: string, metadata?: Record<string, unknown> }} params
 * @returns {Promise<{ paymentId: string }>}
 */
export async function initiatePayment({
  amount,
  phoneNumber,
  description,
  metadata,
}) {
  try {
    const { data } = await startPayheroPaymentFn({
      amount,
      phoneNumber,
      description,
      metadata,
    });
    return data;
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Asks the Cloud Function to re-check PayHero for a status update. Useful
 * as a fallback when the `payheroCallback` webhook is slow or doesn't land.
 *
 * @param {string} paymentId
 * @returns {Promise<{ status: 'pending'|'paid'|'failed'|'cancelled' }>}
 */
export async function checkPaymentStatus(paymentId) {
  try {
    const { data } = await checkPaymentStatusFn({ paymentId });
    return data;
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Subscribes to real-time updates for a `payments/{paymentId}` document.
 *
 * @param {string} paymentId
 * @param {(payment: import('@/shared/types/models').Payment|null) => void} onChange
 * @param {(error: import('@/shared/api').AppError) => void} [onError]
 * @returns {() => void} unsubscribe
 */
export function subscribeToPayment(paymentId, onChange, onError) {
  return onSnapshot(
    doc(db, "payments", paymentId),
    (snap) => onChange(snap.exists() ? snapToPayment(snap) : null),
    (err) => onError?.(normaliseError(err)),
  );
}
