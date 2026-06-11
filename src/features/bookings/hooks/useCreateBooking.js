import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookings.api";

export function useCreateBooking() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      navigate(`/dashboard/bookings/${data.id}/pay`);
    },
  });
}
