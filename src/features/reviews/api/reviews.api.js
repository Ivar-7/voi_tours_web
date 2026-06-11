import httpClient, { normaliseError } from "@/shared/api";

/**
 * Fetches reviews.
 *
 * @param {object} [params]
 * @returns {Promise<import('@/shared/types/models').Review[]>}
 */
export async function getReviews(params = {}) {
  try {
    return await httpClient.get("/reviews", { params });
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Submits a new review.
 *
 * @param {object} payload
 * @returns {Promise<import('@/shared/types/models').Review>}
 */
export async function submitReview(payload) {
  try {
    return await httpClient.post("/reviews", payload);
  } catch (error) {
    throw normaliseError(error);
  }
}
