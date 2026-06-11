import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "../api/bookings.api";

export function useBookings(filters = {}) {
  return useQuery({
    queryKey: ["bookings", "me", filters],
    queryFn: () => getMyBookings(filters),
  });
}
