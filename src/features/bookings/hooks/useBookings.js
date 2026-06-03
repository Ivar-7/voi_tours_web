// TODO: useQuery(['bookings', 'me', filters], getMyBookings)
export function useBookings(filters = {}) {
  return { data: [], isLoading: false, error: null };
}
