import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../api/packages.api";

function cleanFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters || {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
}

export function usePackages(filters = {}, options = {}) {
  const safeFilters = cleanFilters(filters);

  return useQuery({
    queryKey: ["packages", safeFilters],
    queryFn: () => getPackages(safeFilters),
    ...options,
  });
}
