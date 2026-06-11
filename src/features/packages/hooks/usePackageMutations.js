import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPackage,
  deletePackage,
  togglePackageActive,
  updatePackage,
} from "../api/packages.api";

function invalidatePackageQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["packages"] });
  queryClient.invalidateQueries({ queryKey: ["package"] });
  queryClient.invalidateQueries({ queryKey: ["package-by-id"] });
  queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => invalidatePackageQueries(queryClient),
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updatePackage(id, payload),
    onSuccess: () => invalidatePackageQueries(queryClient),
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => invalidatePackageQueries(queryClient),
  });
}

export function useTogglePackageActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }) => togglePackageActive(id, is_active),
    onSuccess: () => invalidatePackageQueries(queryClient),
  });
}
