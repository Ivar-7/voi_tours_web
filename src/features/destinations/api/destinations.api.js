/**
 * @file destinations.api.js
 * Firestore CRUD layer for the Destinations feature.
 *
 * Collection path: `destinations`
 *
 * Public reads  – allowed (no auth required)
 * Write ops     – require an authenticated admin user; the caller is
 *                 responsible for gating the UI, but this module also
 *                 attaches `createdBy` / `updatedBy` from the current
 *                 Firebase Auth user so Firestore security rules can
 *                 enforce it at the database level too.
 *
 * All functions throw a normalised error shape via `normaliseError()` so
 * callers never have to handle raw Firestore or Firebase error objects.
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
} from 'firebase/firestore';

import { db, auth } from '@/shared/providers/firebase/firebaseConfig';
import { normaliseError } from '@/shared/api/errorNormaliser';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLECTION = 'destinations';

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Returns the collection reference — centralises the path so a rename is
 * a one-line change.
 *
 * @returns {import('firebase/firestore').CollectionReference}
 */
function destinationsRef() {
  return collection(db, COLLECTION);
}

/**
 * Returns a document reference by ID.
 *
 * @param {string} id
 * @returns {import('firebase/firestore').DocumentReference}
 */
function destinationDocRef(id) {
  return doc(db, COLLECTION, id);
}

/**
 * Converts a Firestore document snapshot into a plain {@link Destination}
 * object with a guaranteed `id` field and ISO-8601 date strings.
 *
 * @param {import('firebase/firestore').QueryDocumentSnapshot | import('firebase/firestore').DocumentSnapshot} snap
 * @returns {import('./destinations.types.js').Destination}
 */
function snapToDestination(snap) {
  const data = snap.data();

  return {
    ...data,
    id:        snap.id,
    // Convert Firestore Timestamps → ISO strings so components never need
    // to import Timestamp or call .toDate() themselves.
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt ?? null),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt ?? null),
  };
}

/**
 * Returns the UID of the currently signed-in user, or null if unauthenticated.
 * Used to stamp `createdBy` / `updatedBy` on write operations.
 *
 * @returns {string | null}
 */
function currentUid() {
  return auth.currentUser?.uid ?? null;
}

// ─── READ ─────────────────────────────────────────────────────────────────────

/**
 * Fetches a filtered, optionally sorted list of destinations.
 *
 * Supported filters (all optional):
 *   - `region`   — exact match on the region field
 *   - `featured` — boolean; when true returns only featured destinations
 *   - `tag`      — checks array-contains on the `tags` field
 *   - `limit`    — caps the result set size
 *   - `orderBy`  — field name to sort by (default: "name")
 *   - `order`    — "asc" | "desc" (default: "asc")
 *
 * @param {import('./destinations.types.js').DestinationFilters} [params={}]
 * @returns {Promise<import('./destinations.types.js').Destination[]>}
 *
 * @example
 * const featured = await getDestinations({ featured: true, limit: 4 });
 * const coast    = await getDestinations({ region: 'coast', orderBy: 'name' });
 */
export async function getDestinations(params = {}) {
  try {
    const {
      region,
      featured,
      tag,
      limit,
      orderBy: orderField = 'name',
      order = 'asc',
    } = params;

    const constraints = [];

    // ── Filter clauses ─────────────────────────────────────────────────────
    if (region !== undefined)   constraints.push(where('region',   '==',             region));
    if (featured !== undefined) constraints.push(where('featured', '==',             featured));
    if (tag !== undefined)      constraints.push(where('tags',     'array-contains', tag));

    // ── Sort ───────────────────────────────────────────────────────────────
    // Firestore requires the orderBy field to match any inequality filter
    // field. For simple equality filters, any field is safe.
    constraints.push(orderBy(orderField, order));

    // ── Limit ──────────────────────────────────────────────────────────────
    if (limit !== undefined && limit > 0) {
      constraints.push(firestoreLimit(limit));
    }

    const q = query(destinationsRef(), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(snapToDestination);
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Fetches a single destination by its URL slug.
 * Performs a collection query (slug is not the document ID) and returns
 * the first match, or throws a 404-style error if not found.
 *
 * @param {string} slug — e.g. "tsavo-east"
 * @returns {Promise<import('./destinations.types.js').Destination>}
 *
 * @example
 * const dest = await getDestinationBySlug('tsavo-east');
 */
export async function getDestinationBySlug(slug) {
  try {
    const q = query(destinationsRef(), where('slug', '==', slug), firestoreLimit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw Object.assign(new Error(`Destination not found: "${slug}"`), {
        code:   'not-found',
        status: 404,
      });
    }

    return snapToDestination(snapshot.docs[0]);
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * Fetches a single destination by its Firestore document ID.
 * Prefer `getDestinationBySlug` for public-facing routes.
 *
 * @param {string} id
 * @returns {Promise<import('./destinations.types.js').Destination>}
 *
 * @example
 * const dest = await getDestinationById('xKj2pLmQwRt8');
 */
export async function getDestinationById(id) {
  try {
    const snap = await getDoc(destinationDocRef(id));

    if (!snap.exists()) {
      throw Object.assign(new Error(`Destination not found: id="${id}"`), {
        code:   'not-found',
        status: 404,
      });
    }

    return snapToDestination(snap);
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

/**
 * Creates a new destination document in Firestore.
 *
 * - Firestore auto-generates the document ID.
 * - `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` are set here;
 *   callers must NOT include them in the payload.
 * - Slugs must be unique — this function does NOT enforce uniqueness at the
 *   DB level (use a Firestore security rule or a pre-write slug check).
 *
 * @param {import('./destinations.types.js').CreateDestinationPayload} payload
 * @returns {Promise<import('./destinations.types.js').Destination>}
 *
 * @example
 * const dest = await createDestination({
 *   slug:        'lake-naivasha',
 *   name:        'Lake Naivasha',
 *   tagline:     'Hippos & flamingos at sunrise',
 *   description: '...',
 *   region:      DestinationRegion.LAKE,
 *   highlights:  ['Boat safari', 'Hell\'s Gate hike'],
 *   heroImage:   'https://...',
 *   gallery:     [],
 *   featured:    false,
 * });
 */
export async function createDestination(payload) {
  try {
    const uid = currentUid();
    const now = serverTimestamp();

    const docData = {
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: uid,
      updatedBy: uid,
    };

    const ref = await addDoc(destinationsRef(), docData);

    // Re-fetch so serverTimestamp fields are resolved to real values.
    return getDestinationById(ref.id);
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

/**
 * Partially updates an existing destination (patch semantics — only the
 * supplied keys are written; everything else is left untouched).
 *
 * `id`, `slug`, `createdAt`, and `createdBy` are intentionally immutable
 * after creation and are silently stripped from the payload if provided.
 *
 * @param {string} id — Firestore document ID
 * @param {import('./destinations.types.js').UpdateDestinationPayload} payload
 * @returns {Promise<import('./destinations.types.js').Destination>}
 *
 * @example
 * const updated = await updateDestination('xKj2pLmQwRt8', {
 *   tagline:  'New tagline',
 *   featured: true,
 * });
 */
export async function updateDestination(id, payload) {
  try {
    // Guard: strip immutable fields that must never be overwritten.
    const { id: _id, slug: _slug, createdAt: _ca, createdBy: _cb, ...safePayload } = payload;

    const uid = currentUid();

    await updateDoc(destinationDocRef(id), {
      ...safePayload,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });

    return getDestinationById(id);
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── FEATURED TOGGLE ──────────────────────────────────────────────────────────

/**
 * Convenience wrapper — flips the `featured` boolean on a destination
 * without requiring the caller to know or pass the current value.
 *
 * @param {string}  id
 * @param {boolean} featured — the desired new value
 * @returns {Promise<import('./destinations.types.js').Destination>}
 *
 * @example
 * await toggleFeatured('xKj2pLmQwRt8', true);   // feature it
 * await toggleFeatured('xKj2pLmQwRt8', false);  // un-feature it
 */
export async function toggleFeatured(id, featured) {
  return updateDestination(id, { featured });
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

/**
 * Permanently deletes a destination document.
 * This is a hard delete — there is no soft-delete / archive mechanism here.
 * Add a `status: 'archived'` field and filter pattern if soft-delete is needed.
 *
 * @param {string} id — Firestore document ID
 * @returns {Promise<import('./destinations.types.js').DeleteResult>}
 *
 * @example
 * const result = await deleteDestination('xKj2pLmQwRt8');
 * // → { id: 'xKj2pLmQwRt8', success: true }
 */
export async function deleteDestination(id) {
  try {
    await deleteDoc(destinationDocRef(id));
    return { id, success: true };
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── BULK DELETE ──────────────────────────────────────────────────────────────

/**
 * Deletes multiple destinations in a single Firestore batched write.
 * Firestore batches are capped at 500 operations; this function chunks
 * automatically so callers never need to worry about the limit.
 *
 * @param {string[]} ids — array of Firestore document IDs
 * @returns {Promise<import('./destinations.types.js').DeleteResult[]>}
 *
 * @example
 * const results = await bulkDeleteDestinations(['id1', 'id2', 'id3']);
 */
export async function bulkDeleteDestinations(ids) {
  try {
    if (!ids.length) return [];

    const BATCH_LIMIT = 499; // leave 1 slot of headroom below the 500 cap
    const chunks = [];

    for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
      chunks.push(ids.slice(i, i + BATCH_LIMIT));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      chunk.forEach((id) => batch.delete(destinationDocRef(id)));
      await batch.commit();
    }

    return ids.map((id) => ({ id, success: true }));
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── SLUG AVAILABILITY ────────────────────────────────────────────────────────

/**
 * Checks whether a slug is already taken by any existing destination.
 * Useful for form-level validation before calling createDestination().
 *
 * @param {string} slug
 * @param {string} [excludeId] — pass the current doc's ID when editing so the
 *                               check doesn't flag the record's own slug as taken
 * @returns {Promise<boolean>} — true if the slug is available, false if taken
 *
 * @example
 * const ok = await isSlugAvailable('tsavo-east');
 * const ok = await isSlugAvailable('tsavo-east', 'xKj2pLmQwRt8'); // editing
 */
export async function isSlugAvailable(slug, excludeId) {
  try {
    const q = query(destinationsRef(), where('slug', '==', slug), firestoreLimit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return true;

    // If we're editing an existing record and the only match IS that record,
    // the slug is still considered available.
    if (excludeId && snapshot.docs[0].id === excludeId) return true;

    return false;
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── SEED HELPER (dev only) ───────────────────────────────────────────────────

/**
 * Batch-creates multiple destinations in a single transaction.
 * Intended for seeding a development or staging environment only.
 * Import-guard with `if (import.meta.env.DEV)` at the call site.
 *
 * @param {import('./destinations.types.js').CreateDestinationPayload[]} destinations
 * @returns {Promise<string[]>} — array of created document IDs
 *
 * @example
 * if (import.meta.env.DEV) {
 *   const ids = await seedDestinations(SEED_DATA);
 * }
 */
export async function seedDestinations(destinations) {
  try {
    const uid  = currentUid();
    const now  = serverTimestamp();
    const ids  = [];

    // Firestore batches support writes; addDoc isn't batchable so we use
    // setDoc with an auto-ID pattern via doc() with no path argument.
    const batch = writeBatch(db);

    for (const payload of destinations) {
      const ref = doc(destinationsRef()); // auto-ID
      batch.set(ref, {
        ...payload,
        createdAt: now,
        updatedAt: now,
        createdBy: uid,
        updatedBy: uid,
      });
      ids.push(ref.id);
    }

    await batch.commit();
    return ids;
  } catch (err) {
    throw normaliseError(err);
  }
}