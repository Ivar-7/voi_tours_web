import httpClient, { normaliseError } from '@/shared/api';

/**
 * Fetches safari packages matching filters.
 *
 * @param {object} [params]
 * @returns {Promise<import('@/shared/types/models').Package[]>}
 */
export async function getPackages(params = {}) {
  try {
    return await httpClient.get('/packages', { params });
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Fetches package detail (including itinerary and pricing) by slug.
 *
 * @param {string} slug
 * @returns {Promise<import('@/shared/types/models').PackageDetail>}
 */
export async function getPackageBySlug(slug) {
  try {
    return await httpClient.get(`/packages/${slug}`);
  } catch (error) {
    throw normaliseError(error);
  }
}

