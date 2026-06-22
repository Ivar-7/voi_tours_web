# Bookings Feature

## Responsibilities

- Multi-step booking flow for all 6 service types, backed directly by
  Firestore (no separate REST backend).
- My Bookings list and booking detail view.

## Form Routing

`BookingPage` reads `:type` from the URL and renders the matching form:

| `:type`        | Form Component                              |
| --------------- | -------------------------------------------- |
| `safari`        | `SafariBookingForm`                          |
| `sgr_transfer`  | `TransferBookingForm`                        |
| `hotel`         | `HotelBookingForm`                           |
| `event`         | `EventBookingForm`                           |
| `delivery`      | `DeliveryBookingForm`                        |
| `flight`        | `TransferBookingForm` (`type="flight"` variant) |

`SafariBookingForm` reads an optional `?package=<slug>` query param (set by
`PackageHero`/`PackageDetailPage` "Book Now" links) to pre-select a package.

## Flow

`BookingPage (step 1: form)` → `(step 2: BookingReview)` → `useCreateBooking`
→ `BookingSuccessPage` → `PaymentPage` (Firebase Functions / PayHero — see
`src/features/payments/README.md`).

## Pricing

- **Safari**: priced immediately from the selected package's `pricing` array
  (tier × season × party size), using `usePackagePricing` and
  `deriveSeasonFromDate` (Kenya tourism seasonality: Jul–Sep & Dec–Jan peak,
  Apr–May low, otherwise regular).
- **Transfer / flight / hotel / event / delivery**: no pricing catalogue
  exists for these, so they're created as quote requests
  (`total_amount: null`). An admin sets the price when confirming the
  booking (see `src/features/admin/README.md`); only then does
  `BookingDetailPage` show a "Pay now" CTA.

## Firestore Schema

Collection: `bookings`. Each document is a `Booking` (see
`src/shared/types/models.js`) plus one embedded sub-object keyed by type
(`safari` | `transfer` | `hotel` | `event` | `delivery` — `flight` also uses
the `transfer` key). `payment_status` is denormalised onto the booking by
the `onPaymentConfirmed` Cloud Function trigger when a payment clears, so
the UI never has to join against `payments`.

## Files

| Path                                  | Role                                          |
| -------------------------------------- | ---------------------------------------------- |
| `api/bookings.api.js`                  | Firestore CRUD                                |
| `services/booking.service.js`          | Payload builder + season derivation           |
| `schema/booking.schema.js`             | Zod schemas for all types                     |
| `hooks/useCreateBooking.js`            | Create mutation, navigates to success page    |
| `hooks/useBookings.js`                 | My bookings list                              |
| `hooks/useBooking.js`                  | Single booking detail                         |
| `components/BookingStepper.jsx`        | Progress indicator                            |
| `components/*BookingForm.jsx`          | Per-type form                                 |
| `components/BookingReview.jsx`         | Pre-submit / detail-page summary              |
| `components/BookingCard.jsx`           | List item                                     |
| `components/BookingStatusBadge.jsx`    | Status pill (wraps shared `Badge`)            |
