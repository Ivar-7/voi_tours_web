/**
 * @file reviews.api.js
 * Firestore CRUD layer for the Reviews feature.
 *
 * Collection path: `reviews`. There's no moderation queue — every
 * submitted review is publicly visible immediately. `is_visible_on_homepage`
 * just curates which reviews additionally appear in the homepage carousel
 * (defaults to `true` so the carousel has real content without requiring
 * an admin curation screen that doesn't exist yet).
 */

import {
  addDoc,
  collection,
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

const COLLECTION = "reviews";

function reviewsRef() {
  return collection(db, COLLECTION);
}

function timestampToIso(value) {
  return value instanceof Timestamp
    ? value.toDate().toISOString()
    : (value ?? null);
}

function snapToReview(snap) {
  const data = snap.data();
  return { ...data, id: snap.id, created_at: timestampToIso(data.created_at) };
}

/**
 * @param {{ package_id?: string, destination_id?: string, homepage?: boolean, limit?: number }} [params]
 * @returns {Promise<import('@/shared/types/models').Review[]>}
 */
export async function getReviews(params = {}) {
  try {
    // package_id/destination_id-filtered queries intentionally skip
    // `orderBy` (and sort client-side instead) to avoid needing two more
    // composite indexes — review counts per package/destination are small.
    const isEntityFilter = Boolean(params.package_id || params.destination_id);
    const constraints = [];

    if (params.homepage) {
      constraints.push(where("is_visible_on_homepage", "==", true));
    } else if (params.package_id) {
      constraints.push(where("package_id", "==", params.package_id));
    } else if (params.destination_id) {
      constraints.push(where("destination_id", "==", params.destination_id));
    }

    if (!isEntityFilter) constraints.push(orderBy("created_at", "desc"));
    if (params.limit && !isEntityFilter) {
      constraints.push(firestoreLimit(params.limit));
    }

    const snapshot = await getDocs(query(reviewsRef(), ...constraints));
    let reviews = snapshot.docs.map(snapToReview);

    if (isEntityFilter) {
      reviews = reviews.sort((a, b) =>
        (b.created_at || "").localeCompare(a.created_at || ""),
      );
      if (params.limit) reviews = reviews.slice(0, params.limit);
    }

    return reviews;
  } catch (err) {
    throw normaliseError(err);
  }
}

/**
 * @param {{ rating: number, comment: string, package_id?: string, destination_id?: string }} payload
 * @returns {Promise<import('@/shared/types/models').Review>}
 */
export async function submitReview(payload) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw Object.assign(new Error("You must be signed in to leave a review."), {
        code: "unauthenticated",
        status: 401,
      });
    }

    const docData = {
      user_id: uid,
      // Denormalised so review lists/carousels never need a per-review
      // user lookup just to show a name.
      user_name: auth.currentUser.displayName || "Traveler",
      package_id: payload.package_id ?? null,
      destination_id: payload.destination_id ?? null,
      rating: payload.rating,
      comment: payload.comment,
      is_visible_on_homepage: true,
      created_at: serverTimestamp(),
    };

    const ref = await addDoc(reviewsRef(), docData);
    return {
      ...docData,
      id: ref.id,
      created_at: new Date().toISOString(),
    };
  } catch (err) {
    throw normaliseError(err);
  }
}
