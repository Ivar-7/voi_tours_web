# Payments Feature

## Responsibilities

- Initiate M-Pesa (PayHero) STK Push payments by calling the
  `startPayheroPayment` Cloud Function directly — no REST backend involved.
- Show live payment status via a Firestore listener on `payments/{paymentId}`
  (updated in real time by the `payheroCallback` webhook), with a periodic
  `checkPaymentStatus` fallback in case the webhook is delayed.
- Display a payment receipt on success.

M-Pesa is the only supported payment method. Stripe and bank transfer were
removed — there was no backend support for either (no Stripe secret key, no
PaymentIntent function), so keeping them would mean fake/non-functional UI.

## Payment Flow

1. `PaymentPage` loads the booking and shows the amount due.
2. If the booking has no `total_amount` yet (quote-based service types),
   it shows an "awaiting quote" message instead of a payment form.
3. Otherwise it renders `MpesaPaymentForm`, which collects a phone number
   and calls `startPayheroPayment` with `metadata: { bookingId }`.
4. `PaymentStatusPoller` watches `payments/{paymentId}` in real time
   (`usePayment`) and redirects to `PaymentSuccessPage` on `"paid"`, or
   `PaymentFailedPage` on `"failed"`/`"cancelled"`.
5. The `onPaymentConfirmed` Cloud Function trigger (see
   `firebase_functions/README.md`) credits the booking's `payment_status`
   server-side — the frontend never writes to `payments` itself.

## Security Notes

- PayHero credentials live server-side only (`firebase_functions/.env` /
  Secret Manager); the frontend never sees them.
- `payments/{id}` is read-only from the client (see `firestore.rules`) —
  every field is written by the Cloud Functions' Admin SDK.

## Files

| Path                                  | Role                                                   |
| -------------------------------------- | --------------------------------------------------------- |
| `api/payments.api.js`                  | `httpsCallable` wrappers + Firestore listener           |
| `hooks/useMpesaPayment.js`             | Mutation wrapping `initiatePayment`                      |
| `hooks/usePayment.js`                  | Live status (listener + fallback poll)                  |
| `components/MpesaPaymentForm.jsx`      | Phone input → STK push                                  |
| `components/PaymentStatusPoller.jsx`   | Status banner + redirect on terminal status              |
| `components/PaymentReceipt.jsx`        | Receipt display                                          |
| `pages/PaymentPage.jsx`                | `/dashboard/bookings/:bookingId/pay`                     |
| `pages/PaymentSuccessPage.jsx`         | `/dashboard/payment/success`                             |
| `pages/PaymentFailedPage.jsx`          | `/dashboard/payment/failed`                              |
