// TODO: useQuery(['admin', 'stats'], getAdminStats) — refetches every 60s
export function useAdminStats() {
  return { data: null, isLoading: false, error: null };
}
