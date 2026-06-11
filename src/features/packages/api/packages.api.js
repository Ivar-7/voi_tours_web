/**
 * @file packages.api.js
 * Firestore CRUD layer for the Packages feature.
 *
 * Collection path: `packages`
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  serverTimestamp,
  updateDoc,
  where,
  orderBy,
  limit as firestoreLimit,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

import { db, auth } from "@/config/firebase";
import { normaliseError } from "@/shared/api";

const COLLECTION = "packages";

function packagesRef() {
  return collection(db, COLLECTION);
}

function packageDocRef(id) {
  return doc(db, COLLECTION, id);
}

function currentUid() {
  return auth.currentUser?.uid ?? null;
}

function timestampToIso(value) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return value ?? null;
}

function normaliseItinerary(itinerary = [], packageId) {
  return itinerary.map((row, index) => ({
    id: row.id || `${packageId}-day-${row.day_number ?? index + 1}`,
    package_id: packageId,
    day_number: row.day_number ?? index + 1,
    activity_title: row.activity_title || "",
    activity_description: row.activity_description || "",
    included_meals: row.included_meals ?? null,
    accommodation_hint: row.accommodation_hint ?? null,
  }));
}

function normalisePricing(pricing = [], packageId) {
  return pricing.map((row, index) => ({
    id: row.id || `${packageId}-${row.tier}-${row.season}-${index}`,
    package_id: packageId,
    tier: row.tier,
    season: row.season,
    price_per_person: Number(row.price_per_person),
    currency: row.currency || "KES",
  }));
}

function normaliseDestinations(destinations = [], packageId) {
  return destinations.map((row, index) => ({
    package_id: packageId,
    destination_id: row.destination_id,
    name: row.name || "",
    stop_order: row.stop_order ?? index + 1,
  }));
}

/**
 * @param {import('firebase/firestore').QueryDocumentSnapshot | import('firebase/firestore').DocumentSnapshot} snap
 * @returns {import('../types/packages.types.js').PackageRecord}
 */
function snapToPackage(snap) {
  const data = snap.data();

  return {
    ...data,
    id: snap.id,
    duration_days: Number(data.duration_days) || 0,
    is_active: data.is_active !== false,
    hero_image: data.hero_image || "",
    highlights: data.highlights || [],
    destinations: data.destinations || [],
    itinerary: data.itinerary || [],
    pricing: data.pricing || [],
    created_at: timestampToIso(data.created_at ?? data.createdAt),
    updated_at: timestampToIso(data.updated_at ?? data.updatedAt),
    created_by: data.created_by ?? data.createdBy ?? null,
    updated_by: data.updated_by ?? data.updatedBy ?? null,
  };
}

function toPackageDetail(record) {
  const packageId = record.id;

  return {
    ...record,
    destinations: normaliseDestinations(record.destinations, packageId),
    itinerary: normaliseItinerary(record.itinerary, packageId),
    pricing: normalisePricing(record.pricing, packageId),
  };
}

function applyClientFilters(packages, params = {}) {
  let results = [...packages];

  if (params.is_active !== undefined) {
    results = results.filter((pkg) => pkg.is_active === params.is_active);
  } else if (!params.includeInactive) {
    results = results.filter((pkg) => pkg.is_active);
  }

  if (params.destination) {
    const needle = String(params.destination).toLowerCase();
    results = results.filter((pkg) =>
      (pkg.destinations || []).some(
        (stop) =>
          stop.destination_id?.toLowerCase() === needle ||
          stop.name?.toLowerCase().includes(needle),
      ),
    );
  }

  if (params.duration_min !== undefined) {
    results = results.filter(
      (pkg) => pkg.duration_days >= Number(params.duration_min),
    );
  }

  if (params.duration_max !== undefined) {
    results = results.filter(
      (pkg) => pkg.duration_days <= Number(params.duration_max),
    );
  }

  if (params.season) {
    const season = String(params.season).toLowerCase();
    results = results.filter((pkg) =>
      (pkg.pricing || []).some((row) => row.season?.toLowerCase() === season),
    );
  }

  if (params.limit !== undefined && params.limit > 0) {
    results = results.slice(0, params.limit);
  }

  return results;
}

// ─── READ ─────────────────────────────────────────────────────────────────────

/**
 * @param {import('../types/packages.types.js').PackageFilters} [params={}]
 * @returns {Promise<import('../types/packages.types.js').PackageRecord[]>}
 */
export async function getPackages(params = {}) {
  try {
    const {
      orderBy: orderField = "title",
      order = "asc",
      includeInactive,
      ...filters
    } = params;

    const constraints = [orderBy(orderField, order)];

    if (filters.is_active !== undefined) {
      constraints.unshift(where("is_active", "==", filters.is_active));
    } else if (!includeInactive) {
      constraints.unshift(where("is_active", "==", true));
    }

    const q = query(packagesRef(), ...constraints);
    const snapshot = await getDocs(q);
    const packages = snapshot.docs.map(snapToPackage);

    return applyClientFilters(packages, { ...filters, includeInactive });
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {string} slug
 * @returns {Promise<import('../types/packages.types.js').PackageDetailRecord>}
 */
export async function getPackageBySlug(slug) {
  try {
    const q = query(
      packagesRef(),
      where("slug", "==", slug),
      firestoreLimit(1),
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw Object.assign(new Error(`Package not found: "${slug}"`), {
        code: "not-found",
        status: 404,
      });
    }

    return toPackageDetail(snapToPackage(snapshot.docs[0]));
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {string} id
 * @returns {Promise<import('../types/packages.types.js').PackageDetailRecord>}
 */
export async function getPackageById(id) {
  try {
    const snap = await getDoc(packageDocRef(id));

    if (!snap.exists()) {
      throw Object.assign(new Error(`Package not found: id="${id}"`), {
        code: "not-found",
        status: 404,
      });
    }

    return toPackageDetail(snapToPackage(snap));
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

/**
 * @param {import('../types/packages.types.js').CreatePackagePayload} payload
 * @returns {Promise<import('../types/packages.types.js').PackageDetailRecord>}
 */
export async function createPackage(payload) {
  try {
    const uid = currentUid();
    const now = serverTimestamp();

    const docData = {
      ...payload,
      created_at: now,
      updated_at: now,
      created_by: uid,
      updated_by: uid,
    };

    const ref = await addDoc(packagesRef(), docData);
    return getPackageById(ref.id);
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

/**
 * @param {string} id
 * @param {import('../types/packages.types.js').UpdatePackagePayload} payload
 * @returns {Promise<import('../types/packages.types.js').PackageDetailRecord>}
 */
export async function updatePackage(id, payload) {
  try {
    const safePayload = { ...payload };
    delete safePayload.id;
    delete safePayload.slug;
    delete safePayload.created_at;
    delete safePayload.created_by;

    await updateDoc(packageDocRef(id), {
      ...safePayload,
      updated_at: serverTimestamp(),
      updated_by: currentUid(),
    });

    return getPackageById(id);
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {string} id
 * @param {boolean} [nextValue]
 * @returns {Promise<import('../types/packages.types.js').PackageDetailRecord>}
 */
export async function togglePackageActive(id, nextValue) {
  if (typeof nextValue === "boolean") {
    return updatePackage(id, { is_active: nextValue });
  }

  const current = await getPackageById(id);
  return updatePackage(id, { is_active: !current.is_active });
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

/**
 * @param {string} id
 * @returns {Promise<import('../types/packages.types.js').DeleteResult>}
 */
export async function deletePackage(id) {
  try {
    await deleteDoc(packageDocRef(id));
    return { id, success: true };
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {string[]} ids
 * @returns {Promise<import('../types/packages.types.js').DeleteResult[]>}
 */
export async function bulkDeletePackages(ids) {
  try {
    if (!ids.length) return [];

    const BATCH_LIMIT = 499;
    const chunks = [];

    for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
      chunks.push(ids.slice(i, i + BATCH_LIMIT));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      chunk.forEach((packageId) => batch.delete(packageDocRef(packageId)));
      await batch.commit();
    }

    return ids.map((packageId) => ({ id: packageId, success: true }));
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {string} slug
 * @param {string} [excludeId]
 * @returns {Promise<boolean>}
 */
export async function isSlugAvailable(slug, excludeId) {
  try {
    const q = query(
      packagesRef(),
      where("slug", "==", slug),
      firestoreLimit(1),
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return true;
    if (excludeId && snapshot.docs[0].id === excludeId) return true;

    return false;
  } catch (err) {
    throw normaliseError(err);
  }
}
