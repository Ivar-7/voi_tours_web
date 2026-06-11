import {
  createPackage,
  deletePackage,
  getPackages,
  togglePackageActive,
  updatePackage,
} from "@features/packages/api/packages.api";

export async function getAdminPackages(params = {}) {
  return getPackages({ ...params, includeInactive: true });
}

export { createPackage, updatePackage, togglePackageActive, deletePackage };

// TODO: Implement remaining admin API (agent/admin role required — interceptor handles auth)
// getAdminStats() → { totalBookings, totalRevenue, pendingBookings, newInquiries }
// getAdminBookings(params) → { data: Booking[], total: number }
// updateBookingStatus(id, status) → Booking                     PATCH /admin/bookings/:id
// getAdminUsers(params) → { data: User[], total: number }
// getAdminInquiries(params) → { data: Inquiry[], total: number }
// assignInquiry(id, agentId) → Inquiry                          PATCH /admin/inquiries/:id
// convertInquiry(id) → Inquiry                                  POST /admin/inquiries/:id/convert
