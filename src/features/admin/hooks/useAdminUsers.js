import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateUserAccess } from "../api/admin.api";

export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
  });
}

export function useUpdateUserAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, payload }) => updateUserAccess(uid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
