import httpClient, { normaliseError } from '@/shared/api';

/**
 * Submits a new public lead inquiry (honeypot protected).
 *
 * @param {object} payload
 * @returns {Promise<import('@/shared/types/models').Inquiry>}
 */
export async function submitInquiry(payload) {
  try {
    return await httpClient.post('/inquiries', payload);
  } catch (error) {
    throw normaliseError(error);
  }
}
