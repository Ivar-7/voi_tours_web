# Destinations Feature

## Responsibilities
- Browse all destinations with region filtering.
- Destination detail page with gallery and related packages.
- Admin CRUD for creating, editing, deleting, and viewing destinations by Firestore document ID.

## Files
| Path | Role |
|---|---|
| `api/destinations.api.js` | Firestore CRUD helpers |
| `hooks/useDestinations.js` | Filtered list query |
| `hooks/useDestination.js` | Single destination by slug |
| `hooks/useDestinationById.js` | Admin lookup by document ID |
| `hooks/useDestinationMutations.js` | Create / update / delete / toggle featured |
| `components/DestinationCard.jsx` | Grid item |
| `components/DestinationGrid.jsx` | Responsive grid with states |
| `components/DestinationHero.jsx` | Detail page banner |
| `components/DestinationGallery.jsx` | Lightbox media grid |
| `components/RegionFilter.jsx` | Filter pill bar |
| `components/DestinationEditorForm.jsx` | Admin create/edit form |
| `pages/DestinationsPage.jsx` | `/destinations` |
| `pages/DestinationDetailPage.jsx` | `/destinations/:slug` |
| `pages/AdminDestinationsPage.jsx` | `/admin/destinations` |
| `pages/AdminDestinationCreatePage.jsx` | `/admin/destinations/new` |
| `pages/AdminDestinationDetailPage.jsx` | `/admin/destinations/:id` |
| `pages/AdminDestinationEditPage.jsx` | `/admin/destinations/:id/edit` |
