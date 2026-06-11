import { useQuery } from "@tanstack/react-query";
import { getPackages } from "@features/packages/api/packages.api";
import {
  useCreatePackage,
  useDeletePackage,
  useTogglePackageActive,
  useUpdatePackage,
} from "@features/packages/hooks/usePackageMutations";

export function useAdminPackages(filters = {}) {
  return useQuery({
    queryKey: ["admin", "packages", filters],
    queryFn: () => getPackages({ ...filters, includeInactive: true }),
  });
}

export {
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  useTogglePackageActive,
};
