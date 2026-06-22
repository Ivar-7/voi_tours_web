/**
 * @file bookings.api.js
 * Firestore CRUD layer for the Bookings feature.
 *
 * Collection path: `bookings`
 *
 * Type-specific details (safari/transfer/delivery/hotel/event) are embedded
 * directly on the booking document under a key matching the booking `type`
 * (see `buildBookingPayload` in `../services/booking.service.js`), mirroring
 * how `packages.api.js` embeds itinerary/pricing rather than using
 * sub-collections.
 */

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "@/config/firebase/firebase.js";
import { normaliseError } from "@/shared/api";
import { OperationalStatus, PaymentStatus } from "@/shared/types/enums";

const COLLECTION = "bookings";
const MY_BOOKINGS_LIMIT = 200;

function bookingsRef() {
  return collection(db, COLLECTION);
}

function bookingDocRef(id) {
  return doc(db, COLLECTION, id);
}

function timestampToIso(value) {
  return value instanceof Timestamp
    ? value.toDate().toISOString()
    : (value ?? null);
}

function snapToBooking(snap) {
  const data = snap.data();

  return {
    ...data,
    id: snap.id,
    created_at: timestampToIso(data.created_at),
    updated_at: timestampToIso(data.updated_at),
  };
}

/**
 * Creates a new booking for the currently signed-in user.
 *
 * @param {object} payload — output of `buildBookingPayload()`
 * @returns {Promise<import('@/shared/types/models').Booking>}
 */
export async function createBooking(payload) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw Object.assign(new Error("You must be signed in to book."), {
        code: "unauthenticated",
        status: 401,
      });
    }

    const now = serverTimestamp();

    const docData = {
      ...payload,
      user_id: uid,
      status: OperationalStatus.PENDING,
      payment_status: PaymentStatus.UNPAID,
      internal_notes: null,
      created_at: now,
      updated_at: now,
    };

    const ref = await addDoc(bookingsRef(), docData);
    return getBookingById(ref.id);
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Fetches the current user's bookings, most recent first.
 *
 * @param {{ status?: string }} [params]
 * @returns {Promise<import('@/shared/types/models').Booking[]>}
 */
export async function getMyBookings(params = {}) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];

    const q = query(
      bookingsRef(),
      where("user_id", "==", uid),
      orderBy("created_at", "desc"),
      firestoreLimit(MY_BOOKINGS_LIMIT),
    );
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(snapToBooking);

    if (params.status) {
      return bookings.filter((booking) => booking.status === params.status);
    }

    return bookings;
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Fetches a single booking by ID.
 *
 * @param {string} id
 * @returns {Promise<import('@/shared/types/models').BookingDetail>}
 */
export async function getBookingById(id) {
  try {
    const snap = await getDoc(bookingDocRef(id));

    if (!snap.exists()) {
      throw Object.assign(new Error(`Booking not found: id="${id}"`), {
        code: "not-found",
        status: 404,
      });
    }

    return snapToBooking(snap);
  } catch (err) {
    throw normaliseError(err);
  }
}
