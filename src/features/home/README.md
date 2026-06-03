# Home Feature

## Responsibilities
- Landing page composition — no server state, pure presentational orchestration.
- Pulls featured destinations, packages, and homepage reviews via React Query.

## Sections
| Component | Data source |
|---|---|
| `HeroSection` | Static |
| `StatsSection` | Static or CMS |
| `ServicesOverview` | Static (maps `ServiceType` enum) |
| `FeaturedDestinations` | `GET /destinations?featured=true` |
| `FeaturedPackages` | `GET /packages?featured=true` |
| `TestimonialsSection` | `GET /reviews?homepage=true` |
| `InquiryCta` | Static |
