# Packages Feature

## Responsibilities
- Browse and filter safari packages.
- Full detail view: itinerary, pricing matrix, Book CTA.

## Pricing Logic
- The `PackagePricingTable` reads the authenticated user's `tier` from the store.
- Season is determined by the selected `travel_date` via
  `deriveSeasonFromDate` in `src/features/bookings/services/booking.service.js`
  (Kenya tourism seasonality — no backend round-trip needed).
- Price per person × `party_size` = `total_amount` passed to the booking flow.

## Files
| Path | Role |
|---|---|
| `api/packages.api.js` | Firestore CRUD (collection: `packages`) |
| `hooks/usePackages.js` | Filtered list |
| `hooks/usePackage.js` | Single package detail |
| `hooks/usePackagePricing.js` | Tier + season price resolver |
| `components/PackageCard.jsx` | Grid item |
| `components/PackageGrid.jsx` | Responsive grid with states |
| `components/PackageHero.jsx` | Detail banner |
| `components/PackageItinerary.jsx` | Day-by-day accordion |
| `components/PackagePricingTable.jsx` | 3×3 pricing matrix |
| `components/PackageFilter.jsx` | Filter sidebar/bar |
| `pages/PackagesPage.jsx` | `/packages` |
| `pages/PackageDetailPage.jsx` | `/packages/:slug` |
