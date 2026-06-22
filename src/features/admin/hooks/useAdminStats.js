import { useQuery } from "@tanstack/react-query";
import { getAdminStats, getRevenueSeries } from "../api/admin.api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
    refetchInterval: 60_000,
  });
}

export function useRevenueSeries(days = 30) {
  return useQuery({
    queryKey: ["admin", "revenue", days],
    queryFn: () => getRevenueSeries(days),
  });
}
