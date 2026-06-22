import { useMutation } from "@tanstack/react-query";
import { submitInquiry } from "../api/inquiries.api";

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: submitInquiry,
  });
}
