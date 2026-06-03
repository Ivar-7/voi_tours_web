// TODO: useMutation wrapping updateMyProfile; invalidates ['profile', 'me'] and updates auth store
export function useUpdateProfile() {
  return { mutate: () => {}, isPending: false, error: null };
}
