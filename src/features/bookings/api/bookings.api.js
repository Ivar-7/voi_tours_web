import httpClient, { normaliseError } from "@/shared/api";

/**
 * Creates a new booking.
 *
 * @param {object} payload
 * @returns {Promise<import('@/shared/types/models').Booking>}
 */
export async function createBooking(payload) {
  try {
    return await httpClient.post("/bookings", payload);
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Fetches current user's bookings.
 *
 * @param {object} [params]
 * @returns {Promise<import('@/shared/types/models').Booking[]>}
 */
export async function getMyBookings(params = {}) {
  try {
    return await httpClient.get("/bookings/me", { params });
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Fetches booking details by ID.
 *
 * @param {string} id
 * @returns {Promise<import('@/shared/types/models').BookingDetail>}
 */
export async function getBookingById(id) {
  try {
    return await httpClient.get(`/bookings/${id}`);
  } catch (error) {
    throw normaliseError(error);
  }
}
