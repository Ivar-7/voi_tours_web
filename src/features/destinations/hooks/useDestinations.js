// TODO: useQuery(['destinations', filters], getDestinations)
export function useDestinations(filters = {}) {
  return { data: [], isLoading: false, error: null };
}
