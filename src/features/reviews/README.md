# Reviews Feature

## Responsibilities
- Public reviews page (all reviews, filterable).
- Homepage testimonials carousel (is_visible_on_homepage).
- Authenticated review submission (rate package or destination).

## Constraint
The DB schema enforces that exactly one of `package_id` or `destination_id` is non-null per review. `reviewSchema` mirrors this at the form layer.
