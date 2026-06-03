// TODO: useQuery(['packages', filters], getPackages)
export function usePackages(filters = {}) {
  return { data: [], isLoading: false, error: null };
}
