import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookings.api";

export function useCreateBooking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "me"] });
      // Land on the confirmation page first — quote-based bookings (no
      // total_amount yet) have nothing to pay until an admin prices them.
      navigate(`/dashboard/book/${data.type}/success?bookingId=${data.id}`);
    },
  });
}
