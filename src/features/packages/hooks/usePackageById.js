import { useQuery } from "@tanstack/react-query";
import { getPackageById } from "../api/packages.api";

export function usePackageById(id) {
  return useQuery({
    queryKey: ["package-by-id", id],
    queryFn: () => getPackageById(id),
    enabled: !!id,
  });
}
