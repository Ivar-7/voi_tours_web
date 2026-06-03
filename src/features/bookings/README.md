# Bookings Feature

## Responsibilities
- Multi-step booking flow for all 6 service types.
- My Bookings list and booking detail view.

## Form Routing
`BookingPage` reads `:type` from the URL and renders the matching form:

| `:type` | Form Component |
|---|---|
| `safari` | `SafariBookingForm` |
| `sgr_transfer` | `TransferBookingForm` |
| `hotel` | `HotelBookingForm` |
| `event` | `EventBookingForm` |
| `delivery` | `DeliveryBookingForm` |
| `flight` | `TransferBookingForm` (reused with flight variant) |

## Flow
`BookingPage (step 1)` → `BookingReview (step 2)` → `useCreateBooking` → `BookingSuccessPage` → `PaymentPage`

## Files
| Path | Role |
|---|---|
| `api/bookings.api.js` | Booking CRUD |
| `services/booking.service.js` | Payload builder per type |
| `schema/booking.schema.js` | Zod schemas for all types |
| `hooks/useCreateBooking.js` | Create mutation |
| `hooks/useBookings.js` | My bookings list |
| `hooks/useBooking.js` | Single booking detail |
| `components/BookingStepper.jsx` | Progress indicator |
| `components/Safe*BookingForm.jsx` | Per-type form |
| `components/BookingReview.jsx` | Pre-submit summary |
| `components/BookingCard.jsx` | List item |
| `components/BookingStatusBadge.jsx` | Status pill |
