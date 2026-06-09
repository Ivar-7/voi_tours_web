import httpClient, { normaliseError } from '@/shared/api';

/**
 * Fetches the currently authenticated user's backend profile.
 *
 * @returns {Promise<import('@/shared/types/models').User>}
 */
export async function getMyProfile() {
  try {
    return await httpClient.get('/users/me');
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Partially updates the currently authenticated user's backend profile.
 *
 * @param {object} payload
 * @returns {Promise<import('@/shared/types/models').User>}
 */
export async function updateMyProfile(payload) {
  try {
    return await httpClient.patch('/users/me', payload);
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Changes the user's password.
 *
 * @param {object} payload
 * @returns {Promise<void>}
 */
export async function changePassword(payload) {
  try {
    return await httpClient.post('/users/me/change-password', payload);
  } catch (error) {
    throw normaliseError(error);
  }
}

