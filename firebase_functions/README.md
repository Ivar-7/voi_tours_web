# Firebase Cloud Functions — Voi Tours

Firebase Functions v2 (Node 24) functions for the Voi Tours web app. They
handle M-Pesa payment initiation/confirmation via the
[PayHero](https://payhero.co.ke) API and reconcile confirmed payments
against bookings stored in Firestore.

---

## Functions Overview

| Function              | Type      | Trigger                          | Description                                                                 |
| ---------------------- | --------- | --------------------------------- | ----------------------------------------------------------------------------- |
| `startPayheroPayment`  | `onCall`  | Frontend (`httpsCallable`)        | Initiates an M-Pesa STK push for an arbitrary amount + creates `payments/{paymentId}` |
| `checkPaymentStatus`   | `onCall`  | Frontend (`httpsCallable`)        | Re-checks PayHero for a payment's status; fallback for missed webhooks       |
| `payheroCallback`      | `onRequest` | PayHero webhook                 | Receives payment completion/failure callbacks, updates `payments/{paymentId}` |
| `onPaymentConfirmed`   | `onDocumentUpdated` | `payments/{paymentId}` | When a payment turns `"paid"`, credits the linked `bookings/{bookingId}`    |

`startPayheroPayment`/`checkPaymentStatus`/`payheroCallback` are generic —
they don't know what a payment is *for*. The caller passes an opaque
`metadata` object when starting a payment; `onPaymentConfirmed` is the only
function that interprets it (specifically `metadata.bookingId`).

---

## Payment Flow

```
Frontend (src/features/payments/)
  └─► startPayheroPayment({ amount, phoneNumber, description, metadata: { bookingId } })
        ├─ Validates auth + phone number
        ├─ Creates payments/{paymentId} with status: "pending"
        ├─ Calls PayHero API → triggers M-Pesa STK push to the user's phone
        └─ Returns { paymentId }
              └─► PayHero POSTs the result to payheroCallback
                    ├─ Verifies the shared-secret `?key=` query param
                    ├─ Updates payments/{paymentId}.status → "paid" | "failed" | "cancelled"
                    └─► onPaymentConfirmed (Firestore trigger, only on "paid")
                          └─ Credits bookings/{bookingId}: paid_amount, payment_status,
                             and bumps status "pending" → "confirmed"
```

If the webhook is delayed or never arrives, the frontend's `usePayment` hook
falls back to calling `checkPaymentStatus` every few seconds, which asks
PayHero directly and updates Firestore the same way.

### `startPayheroPayment`

Input: `{ amount: number, phoneNumber: string, description: string, metadata?: object }`
(auth required). Normalises the phone to `07XXXXXXXX`/`01XXXXXXXX`, creates
the `payments` doc, and calls PayHero's `/payments` endpoint. Returns
`{ paymentId }`.

### `checkPaymentStatus`

Input: `{ paymentId: string }` (auth required; only the payment's owner may
call it). If the payment is already terminal, returns immediately;
otherwise queries PayHero's `/transaction-status` endpoint and updates
Firestore if the status changed.

### `payheroCallback`

`onRequest` HTTP function. Validates the `?key=` query param against
`PAYHERO_CALLBACK_SECRET` (see below), reads `external_reference` (the
`paymentId`) and `status` from the POST body, and updates the matching
payment document. Idempotent — re-posting an already-terminal status is a
no-op.

### `onPaymentConfirmed`

Firestore trigger on `payments/{paymentId}` updates. Only acts when
`status` is `"paid"` and `metadata.bookingId` is set. Runs in a transaction
that also stamps `appliedToBooking: true` on the payment doc, so Firestore's
at-least-once trigger delivery can never credit the same payment twice. A
booking already at `payment_status: "fully_paid"` is never downgraded.

---

## Firestore Collections

| Collection | Written by                              | Purpose                                    |
| ----------- | ---------------------------------------- | --------------------------------------------- |
| `payments`  | `startPayheroPayment`, `payheroCallback`, `checkPaymentStatus` | One doc per payment attempt |
| `bookings`  | `onPaymentConfirmed` (updates only)      | `paid_amount` / `payment_status` / `status`  |

No client ever writes to `payments` directly (see
`src/config/firebase/firestore.rules`) — every field is set server-side
via the Admin SDK, which bypasses security rules entirely.

---

## Environment Variables

### Local Development (Emulator)

Create `firebase_functions/.env` (git-ignored):

```env
PAYHERO_API_KEY=your_api_key
PAYHERO_API_SECRET=your_api_secret
PAYHERO_CHANNEL_ID=5466
PAYHERO_CALLBACK_URL=https://your-tunnel-url/payheroCallback
```

The emulator picks this up automatically.

### Production (Deployed Functions)

Secrets are stored in Google Cloud Secret Manager via the Firebase CLI —
**do not commit real values**:

```bash
firebase functions:secrets:set PAYHERO_API_KEY
firebase functions:secrets:set PAYHERO_API_SECRET
firebase functions:secrets:set PAYHERO_CHANNEL_ID
firebase functions:secrets:set PAYHERO_CALLBACK_URL
```

| Variable                  | Description                                                            |
| -------------------------- | ------------------------------------------------------------------------ |
| `PAYHERO_API_KEY`          | PayHero API key                                                        |
| `PAYHERO_API_SECRET`       | PayHero API secret                                                     |
| `PAYHERO_CHANNEL_ID`       | PayHero channel ID (defaults to `5466` if unset)                       |
| `PAYHERO_CALLBACK_URL`     | Publicly accessible URL for `payheroCallback`, e.g. `https://<region>-<project>.cloudfunctions.net/payheroCallback` |
| `PAYHERO_CALLBACK_SECRET`  | Shared secret appended to the callback URL as `?key=`; rejects forged webhook calls. Optional but strongly recommended. |

---

## Project Structure

```
firebase_functions/
├── src/
│   ├── index.ts                          # Exports all functions
│   ├── payments/
│   │   ├── config.ts                     # PayHero base URL, env helpers, phone normalisation
│   │   ├── startPayheroPayment.ts        # STK push initiation
│   │   └── confirmPayheroPayment.ts      # Webhook handler + status poll
│   └── app/
│       └── onPaymentConfirmed.ts         # Credits bookings on confirmed payment
├── lib/                                  # Compiled JS output (git-ignored)
├── .env                                  # Local env vars (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup & Development

```bash
cd firebase_functions
npm install
npm run build:watch      # tsc --watch
firebase emulators:start --only functions   # from repo root, with .env present
```

## Deployment (not run by the agent — see repo-root README for the full list)

```bash
firebase deploy --only functions
```

```bash
firebase functions:log
```
