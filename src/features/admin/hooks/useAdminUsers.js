// TODO: useQuery(['admin', 'users', params], getAdminUsers)
export function useAdminUsers(params = {}) {
  return { data: [], total: 0, isLoading: false, error: null };
}
