import { useQuery } from "@tanstack/react-query";
import { getDestinationById } from "../api/destinations.api";

export function useDestinationById(id, options = {}) {
  return useQuery({
    queryKey: ["destination-by-id", id],
    queryFn: () => getDestinationById(id),
    ...options,
    enabled: Boolean(id) && (options.enabled ?? true),
  });
}
