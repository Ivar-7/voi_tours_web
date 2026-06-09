import { useQuery } from '@tanstack/react-query';
import { getPackageBySlug } from '../api/packages.api';

export function usePackage(slug) {
  return useQuery({
    queryKey: ['package', slug],
    queryFn: () => getPackageBySlug(slug),
    enabled: !!slug,
  });
}

