import { useQuery } from "@tanstack/react-query";
import { getDestinations } from "../api/destinations.api";

function cleanFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters || {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
}

export function useDestinations(filters = {}, options = {}) {
  const safeFilters = cleanFilters(filters);

  return useQuery({
    queryKey: ["destinations", safeFilters],
    queryFn: () => getDestinations(safeFilters),
    ...options,
  });
}
