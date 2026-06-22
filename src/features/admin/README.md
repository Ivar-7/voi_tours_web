# Admin Feature

Firestore-backed admin console — no separate backend. All reads/writes go
through `api/admin.api.js` (bookings/users/inquiries/stats) or the
`packages` feature's API (packages are managed there directly).

## Access

`/admin/*` is gated by `RoleGuard roles={["admin","agent"]}`. Within that,
a second, finer-grained restriction applies to **packages and user
management specifically**: only `role: "admin"` can create/edit/delete
packages or change another user's role/active status (enforced both in the
UI via a `canManage` flag and, defensively, in `firestore.rules`). Agents
have full read/write access to bookings and inquiries.

## Pages

| Page                   | Capability                                                        |
| ------------------------ | -------------------------------------------------------------------- |
| `AdminDashboardPage`    | KPI tiles, 30-day revenue chart, 5 most recent bookings            |
| `AdminBookingsPage`     | Full booking list, status/type filters, inline status updates, set price for quote-based bookings |
| `AdminUsersPage`        | User list, search, role filter, role/active toggle (admin only)   |
| `AdminInquiriesPage`    | Inquiry list, filter by converted/service, assign to agent, mark converted |
| `AdminPackagesPage`     | Package list; create/edit; toggle active (admin only)             |

## Stats

`getAdminStats()` uses Firestore aggregation queries (`getCountFromServer`,
`getAggregateFromServer` + `sum()`) instead of downloading whole
collections just to count/sum them. `getRevenueSeries()` buckets `payments`
documents by day client-side (a single `where("status","==","paid")`
query, no `orderBy`) to avoid a composite index — see the repo-root
`firestore.indexes.json` notes.

## Notes

- Quote-based bookings (`sgr_transfer`/`flight`/`hotel`/`event`/`delivery`)
  are created with `total_amount: null`; `AdminBookingsPage`'s "Set price"
  action prices them and flips `status` to `confirmed`, which is what
  unlocks the customer's "Pay now" button.
- Secondary filters (status, role, search, etc.) are applied client-side
  after a single `orderBy` query, matching the pattern in
  `packages.api.js` — kept deliberately simple to avoid extra composite
  indexes.
