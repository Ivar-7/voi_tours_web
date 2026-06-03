# Destinations Feature

## Responsibilities
- Browse all destinations with region filtering.
- Destination detail page with gallery and related packages.

## Files
| Path | Role |
|---|---|
| `api/destinations.api.js` | `GET /destinations`, `GET /destinations/:slug` |
| `hooks/useDestinations.js` | Filtered list query |
| `hooks/useDestination.js` | Single destination by slug |
| `components/DestinationCard.jsx` | Grid item |
| `components/DestinationGrid.jsx` | Responsive grid with states |
| `components/DestinationHero.jsx` | Detail page banner |
| `components/DestinationGallery.jsx` | Lightbox media grid |
| `components/RegionFilter.jsx` | Filter pill bar |
| `pages/DestinationsPage.jsx` | `/destinations` |
| `pages/DestinationDetailPage.jsx` | `/destinations/:slug` |
