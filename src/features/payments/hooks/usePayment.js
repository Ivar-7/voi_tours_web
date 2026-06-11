import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "../api/payments.api";

export function usePayment(paymentId) {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getPaymentStatus(paymentId),
    enabled: Boolean(paymentId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === "unpaid" || status === "partially_paid") {
        return 3000;
      }
      return false;
    },
  });
}
