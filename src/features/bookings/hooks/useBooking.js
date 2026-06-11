import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../api/bookings.api";

export function useBooking(id) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
}
