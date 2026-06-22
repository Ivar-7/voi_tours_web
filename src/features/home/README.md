# Home Feature

## Responsibilities

`HomePage.jsx` is a single self-contained page (no `components/` of its
own) that composes the landing page, pulling real data via React Query
hooks from `destinations`, `packages`, and `reviews` instead of hardcoded
content.

## Sections (all inside `pages/HomePage.jsx`)

| Section | Data source |
|---|---|
| `Hero` | Static copy; nav links to real routes (`#services`, `/destinations`, `/packages`, `/inquiry`) |
| `Stats` | Real destination/package counts (`useDestinations`, `usePackages`) |
| `Services` | Static — maps the 6 `ServiceType` values |
| `FeaturedDestinations` | `useDestinations({ featured: true, limit: 4 })` |
| `FeaturedPackages` | `usePackages({ limit: 3 })` |
| `Testimonials` | `HomepageReviewsCarousel` (`src/features/reviews/`) — real reviews where `is_visible_on_homepage` |
| `InquiryCta` | Real `InquiryForm`/`InquirySuccessMessage` (`src/features/inquiries/`) |
| `Footer` | Static contact details + real route links |
