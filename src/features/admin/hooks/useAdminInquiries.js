// TODO: useQuery(['admin', 'inquiries', params], getAdminInquiries)
export function useAdminInquiries(params = {}) {
  return { data: [], total: 0, isLoading: false, error: null };
}
