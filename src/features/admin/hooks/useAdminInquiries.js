import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignInquiry,
  convertInquiry,
  getAdminInquiries,
  getAgents,
} from "../api/admin.api";

export function useAdminInquiries(params = {}) {
  return useQuery({
    queryKey: ["admin", "inquiries", params],
    queryFn: () => getAdminInquiries(params),
  });
}

export function useAgents() {
  return useQuery({
    queryKey: ["admin", "agents"],
    queryFn: getAgents,
  });
}

export function useAssignInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, agentId }) => assignInquiry(id, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    },
  });
}

export function useConvertInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => convertInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    },
  });
}
