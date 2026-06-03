// TODO: useQuery(['admin', 'bookings', params], getAdminBookings)
export function useAdminBookings(params = {}) {
  return { data: [], total: 0, isLoading: false, error: null };
}
