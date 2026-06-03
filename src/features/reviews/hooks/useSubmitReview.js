// TODO: useMutation wrapping submitReview; invalidates ['reviews'] cache on success
export function useSubmitReview() {
  return { mutate: () => {}, isPending: false, isSuccess: false, error: null };
}
