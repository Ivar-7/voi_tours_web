# Home Feature

## Responsibilities

`HomePage.jsx` is a single self-contained page (not split into the section
components below — see "Note" below) that composes the landing page,
pulling real data via React Query hooks from `destinations`, `packages`,
and `reviews` instead of hardcoded content.

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

## Note on `components/`

`components/HeroSection.jsx`, `FeaturedDestinations.jsx`,
`FeaturedPackages.jsx`, `InquiryCta.jsx`, `ServicesOverview.jsx`,
`StatsSection.jsx`, and `TestimonialsSection.jsx` are unused stub files —
`HomePage.jsx` implements each section inline instead. They're left in
place rather than deleted outright, but nothing imports them; treat
`HomePage.jsx` as the single source of truth for this feature.
