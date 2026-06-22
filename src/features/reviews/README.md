# Reviews Feature

Firestore-backed — no separate backend. Collection: `reviews`.

## Responsibilities

- Public reviews page (`/reviews`) — all reviews, filterable by package or
  destination, with a submission form for whichever one is selected.
- Homepage testimonials carousel (`HomepageReviewsCarousel`) — reviews with
  `is_visible_on_homepage: true`.
- Authenticated review submission (rate a package or destination).

## No Moderation Queue

There's no admin review-moderation screen, so every submitted review is
publicly visible immediately, and `is_visible_on_homepage` defaults to
`true` at submission (rather than sitting in an unreviewable "pending"
state forever). It's a curation flag, not a publish/approve gate — the
`/reviews` page shows all reviews regardless of it.

## Constraint

`reviewSchema` requires exactly one of `package_id` / `destination_id` to
be set — a review always rates something specific. `submitReview`
denormalises the reviewer's `user_name` onto the review doc at write time
so review lists/carousels never need a per-review profile lookup.

## Composite Index

`reviews`: `is_visible_on_homepage ASC, created_at DESC` (homepage
carousel + the unfiltered `/reviews` listing). Package/destination-filtered
queries skip `orderBy` and sort client-side instead, to avoid needing two
more composite indexes — see `firestore.indexes.json`.
