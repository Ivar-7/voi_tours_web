import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../api/reviews.api";

export function useReviews(filters = {}) {
  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: () => getReviews(filters),
  });
}
