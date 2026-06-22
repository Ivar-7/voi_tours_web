import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminBookings,
  priceBooking,
  updateBookingStatus,
} from "../api/admin.api";

export function useAdminBookings(params = {}) {
  return useQuery({
    queryKey: ["admin", "bookings", params],
    queryFn: () => getAdminBookings(params),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });
}

export function usePriceBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, totalAmount, currency }) =>
      priceBooking(id, totalAmount, currency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });
}
