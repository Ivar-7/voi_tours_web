// TODO: Implement QueryProvider
// Wraps children with TanStack QueryClientProvider
// Configure: staleTime 30s, retry 1, refetchOnWindowFocus false
// Mounts ReactQueryDevtools in development

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
