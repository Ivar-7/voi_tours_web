import { useQuery } from "@tanstack/react-query";
import { getDestinationBySlug } from "../api/destinations.api";

export function useDestination(slug, options = {}) {
  return useQuery({
    queryKey: ["destination", slug],
    queryFn: () => getDestinationBySlug(slug),
    ...options,
    enabled: Boolean(slug) && (options.enabled ?? true),
  });
}
