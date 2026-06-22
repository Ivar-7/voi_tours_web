import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  syncProfileToStore,
  updateMyProfile,
  uploadAvatar,
} from "../api/profile.api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (profile) => {
      syncProfileToStore(profile);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
