# Payments Feature

## Responsibilities
- Initiate M-Pesa STK Push and Stripe card payments.
- Poll payment status until resolved.
- Display payment receipt on success.

## Payment Flow
1. `PaymentPage` shows `PaymentMethodSelector`.
2. User selects M-Pesa → `MpesaPaymentForm` triggers STK Push → `PaymentStatusPoller` polls every 3s.
3. User selects Card → `StripePaymentForm` mounts Stripe Elements, confirms intent.
4. On `fully_paid`: navigate to `PaymentSuccessPage`.
5. On `failed`: navigate to `PaymentFailedPage`.

## Provider Availability
| Currency | M-Pesa | Stripe | Bank Transfer |
|---|---|---|---|
| KES | ✓ | ✓ | ✓ |
| USD | — | ✓ | ✓ |

## Security Notes
- M-Pesa credentials live server-side only; frontend sends phone + booking ID.
- Stripe publishable key only (`VITE_STRIPE_PUBLISHABLE_KEY`); secret key is server-side.
- Never log or expose `gateway_metadata` to the UI.
