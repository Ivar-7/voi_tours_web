// TODO: Implement admin API (agent/admin role required — interceptor handles auth)
// getAdminStats() → { totalBookings, totalRevenue, pendingBookings, newInquiries }
// getAdminBookings(params) → { data: Booking[], total: number }
// updateBookingStatus(id, status) → Booking                     PATCH /admin/bookings/:id
// getAdminUsers(params) → { data: User[], total: number }
// getAdminInquiries(params) → { data: Inquiry[], total: number }
// assignInquiry(id, agentId) → Inquiry                          PATCH /admin/inquiries/:id
// convertInquiry(id) → Inquiry                                  POST /admin/inquiries/:id/convert
// getAdminPackages() → Package[]
// createPackage(payload) → Package                              POST /admin/packages
// updatePackage(id, payload) → Package                          PATCH /admin/packages/:id
// togglePackageActive(id) → Package                             PATCH /admin/packages/:id/toggle
