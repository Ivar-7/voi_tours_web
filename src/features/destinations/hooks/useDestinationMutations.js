import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDestination,
  deleteDestination,
  toggleFeatured,
  updateDestination,
} from "../api/destinations.api";

function invalidateDestinationQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["destinations"] });
  queryClient.invalidateQueries({ queryKey: ["destination"] });
  queryClient.invalidateQueries({ queryKey: ["destination-by-id"] });
}

export function useCreateDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDestination,
    onSuccess: () => invalidateDestinationQueries(queryClient),
  });
}

export function useUpdateDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateDestination(id, payload),
    onSuccess: () => invalidateDestinationQueries(queryClient),
  });
}

export function useDeleteDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDestination,
    onSuccess: () => invalidateDestinationQueries(queryClient),
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }) => toggleFeatured(id, featured),
    onSuccess: () => invalidateDestinationQueries(queryClient),
  });
}
