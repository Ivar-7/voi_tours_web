// TODO: useMutation wrapping submitInquiry; shows success state on completion
export function useSubmitInquiry() {
  return { mutate: () => {}, isPending: false, isSuccess: false, error: null };
}
