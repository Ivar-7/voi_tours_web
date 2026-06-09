import { useQuery } from '@tanstack/react-query';
import { getPackages } from '../api/packages.api';

export function usePackages(filters = {}) {
  return useQuery({
    queryKey: ['packages', filters],
    queryFn: () => getPackages(filters),
  });
}

