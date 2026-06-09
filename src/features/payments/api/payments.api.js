import httpClient, { normaliseError } from '@/shared/api';

/**
 * Initiates a payment for a booking.
 *
 * @param {string} bookingId
 * @param {'mpesa'|'stripe'|'bank_transfer'} provider
 * @param {number} amount
 * @returns {Promise<import('@/shared/types/models').Payment>}
 */
export async function initiatePayment(bookingId, provider, amount) {
  try {
    return await httpClient.post('/payments', { bookingId, provider, amount });
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Gets status of a payment by ID.
 *
 * @param {string} paymentId
 * @returns {Promise<import('@/shared/types/models').Payment>}
 */
export async function getPaymentStatus(paymentId) {
  try {
    return await httpClient.get(`/payments/${paymentId}`);
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Confirms an M-Pesa STK push payment.
 *
 * @param {string} checkoutRequestId
 * @returns {Promise<import('@/shared/types/models').Payment>}
 */
export async function confirmMpesaPayment(checkoutRequestId) {
  try {
    return await httpClient.post('/payments/mpesa/confirm', { checkoutRequestId });
  } catch (error) {
    throw normaliseError(error);
  }
}

