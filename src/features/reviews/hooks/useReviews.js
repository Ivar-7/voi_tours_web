// TODO: useQuery(['reviews', filters], getReviews)
export function useReviews(filters = {}) {
  return { data: [], isLoading: false, error: null };
}
