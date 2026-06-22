/**
 * @file admin.api.js
 * Firestore-backed admin operations. Reuses the `packages` feature's API
 * for package management; bookings/users/inquiries are queried directly
 * here since those features don't expose admin-shaped reads themselves.
 *
 * Secondary filters (status/type/role/search) are applied client-side
 * rather than as Firestore `where()` clauses, matching the precedent set
 * by `packages.api.js` — this keeps composite index requirements minimal.
 */

import {
  collection,
  doc,
  getAggregateFromServer,
  getCountFromServer,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  serverTimestamp,
  sum,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  createPackage,
  deletePackage,
  getPackages,
  togglePackageActive,
  updatePackage,
} from "@features/packages/api/packages.api";
import { getBookingById } from "@features/bookings/api/bookings.api";
import { db } from "@/config/firebase/firebase.js";
import { normaliseError } from "@/shared/api";
import { OperationalStatus, UserRole } from "@/shared/types/enums";

const ADMIN_LIST_LIMIT = 300;

export async function getAdminPackages(params = {}) {
  return getPackages({ ...params, includeInactive: true });
}

export { createPackage, updatePackage, togglePackageActive, deletePackage };

function timestampToIso(value) {
  return value instanceof Timestamp
    ? value.toDate().toISOString()
    : (value ?? null);
}

function snapToDoc(snap) {
  const data = snap.data();
  return {
    ...data,
    id: snap.id,
    created_at: timestampToIso(data.created_at),
    updated_at: timestampToIso(data.updated_at),
  };
}

// ─── Dashboard stats ────────────────────────────────────────────────────────

/**
 * @returns {Promise<import('../types/admin.types').AdminStats>}
 */
export async function getAdminStats() {
  try {
    const bookingsCol = collection(db, "bookings");
    const inquiriesCol = collection(db, "inquiries");

    const [totalBookings, pendingBookings, revenue, newInquiries] =
      await Promise.all([
        getCountFromServer(bookingsCol),
        getCountFromServer(
          query(bookingsCol, where("status", "==", OperationalStatus.PENDING)),
        ),
        getAggregateFromServer(bookingsCol, {
          totalRevenue: sum("paid_amount"),
        }),
        getCountFromServer(query(inquiriesCol, where("is_converted", "==", false))),
      ]);

    return {
      totalBookings: totalBookings.data().count,
      totalRevenue: revenue.data().totalRevenue || 0,
      pendingBookings: pendingBookings.data().count,
      newInquiries: newInquiries.data().count,
    };
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Daily revenue for the last `days` days, derived from `payments` where
 * `status == "paid"`. PayHero only processes KES (M-Pesa), so this is a
 * single-currency series. Fetched without `orderBy` (kept to a single
 * equality filter) and bucketed client-side to avoid a composite index.
 *
 * @param {number} [days=30]
 * @returns {Promise<{ date: string, amount: number }[]>}
 */
export async function getRevenueSeries(days = 30) {
  try {
    const q = query(collection(db, "payments"), where("status", "==", "paid"));
    const snapshot = await getDocs(q);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const byDate = new Map();
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const confirmedAt = timestampToIso(data.confirmedAt ?? data.createdAt);
      if (!confirmedAt) continue;

      const date = confirmedAt.slice(0, 10);
      if (new Date(date) < cutoff) continue;

      byDate.set(date, (byDate.get(date) || 0) + Number(data.amount || 0));
    }

    return Array.from(byDate.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────

/**
 * @param {{ status?: string, type?: string }} [params]
 * @returns {Promise<{ data: import('@/shared/types/models').Booking[], total: number }>}
 */
export async function getAdminBookings(params = {}) {
  try {
    const q = query(
      collection(db, "bookings"),
      orderBy("created_at", "desc"),
      firestoreLimit(ADMIN_LIST_LIMIT),
    );
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map(snapToDoc);

    if (params.status) data = data.filter((b) => b.status === params.status);
    if (params.type) data = data.filter((b) => b.type === params.type);

    return { data, total: data.length };
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {string} id
 * @param {string} status — an OperationalStatus value
 * @returns {Promise<import('@/shared/types/models').Booking>}
 */
export async function updateBookingStatus(id, status) {
  try {
    await updateDoc(doc(db, "bookings", id), {
      status,
      updated_at: serverTimestamp(),
    });
    return getBookingById(id);
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Prices a quote-based booking and moves it to "confirmed" so the customer
 * can pay. Only meaningful for bookings created with `total_amount: null`.
 *
 * @param {string} id
 * @param {number} totalAmount
 * @param {string} [currency]
 * @returns {Promise<import('@/shared/types/models').Booking>}
 */
export async function priceBooking(id, totalAmount, currency = "KES") {
  try {
    await updateDoc(doc(db, "bookings", id), {
      total_amount: totalAmount,
      currency,
      status: OperationalStatus.CONFIRMED,
      updated_at: serverTimestamp(),
    });
    return getBookingById(id);
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── Users ────────────────────────────────────────────────────────────────

/**
 * @param {{ role?: string, search?: string }} [params]
 * @returns {Promise<{ data: import('@/shared/types/models').User[], total: number }>}
 */
export async function getAdminUsers(params = {}) {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("created_at", "desc"),
      firestoreLimit(ADMIN_LIST_LIMIT),
    );
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map(snapToDoc);

    if (params.role) data = data.filter((u) => u.role === params.role);
    if (params.search) {
      const needle = params.search.toLowerCase();
      data = data.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(needle) ||
          u.email?.toLowerCase().includes(needle),
      );
    }

    return { data, total: data.length };
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Users with an operational role — populates the inquiry-assignment dropdown.
 *
 * @returns {Promise<import('@/shared/types/models').User[]>}
 */
export async function getAgents() {
  try {
    const q = query(
      collection(db, "users"),
      where("role", "in", [UserRole.ADMIN, UserRole.AGENT]),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(snapToDoc);
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Admin-only: promote/demote a user or toggle their active status. Firestore
 * rules additionally restrict this write to `role: "admin"` callers.
 *
 * @param {string} uid
 * @param {{ role?: string, is_active?: boolean }} payload
 * @returns {Promise<void>}
 */
export async function updateUserAccess(uid, payload) {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...payload,
      updated_at: serverTimestamp(),
    });
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── Inquiries ────────────────────────────────────────────────────────────

/**
 * @param {{ is_converted?: boolean, requested_service?: string }} [params]
 * @returns {Promise<{ data: import('@/shared/types/models').Inquiry[], total: number }>}
 */
export async function getAdminInquiries(params = {}) {
  try {
    const q = query(
      collection(db, "inquiries"),
      orderBy("created_at", "desc"),
      firestoreLimit(ADMIN_LIST_LIMIT),
    );
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map(snapToDoc);

    if (params.is_converted !== undefined) {
      data = data.filter((i) => i.is_converted === params.is_converted);
    }
    if (params.requested_service) {
      data = data.filter(
        (i) => i.requested_service === params.requested_service,
      );
    }

    return { data, total: data.length };
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {string} id
 * @param {string} agentId
 * @returns {Promise<void>}
 */
export async function assignInquiry(id, agentId) {
  try {
    await updateDoc(doc(db, "inquiries", id), { assigned_agent_id: agentId });
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function convertInquiry(id) {
  try {
    await updateDoc(doc(db, "inquiries", id), { is_converted: true });
  } catch (err) {
    throw normaliseError(err);
  }
}
