# Admin Feature

## Access
Accessible only to users with role `admin` or `agent` (enforced by `RoleGuard`).

## Responsibilities
| Page | Capability |
|---|---|
| `AdminDashboardPage` | KPI tiles, revenue chart, recent bookings |
| `AdminBookingsPage` | Full booking list; inline status updates |
| `AdminUsersPage` | User list; view tier and role |
| `AdminInquiriesPage` | Inquiry list; assign to agent; mark converted |
| `AdminPackagesPage` | Package list; create/edit; toggle active |

## Notes
- Suleiman (admin) has full access. Juma (agent) cannot edit packages or users.
- All admin API calls require the Bearer token; role is verified server-side.
