// TODO: useMutation wrapping createBooking
// On success: navigate to /dashboard/bookings/:id/pay
export function useCreateBooking() {
  return { mutate: () => {}, isPending: false, error: null };
}
