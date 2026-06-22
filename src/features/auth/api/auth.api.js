import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { normaliseError } from "@/shared/api";
import { useAuthStore } from "@/shared/store";
import { auth, db } from "@/config/firebase/firebase.js";
import { UserRole, PassengerTier } from "@/shared/types/enums";

const USERS_COLLECTION = "users";

/**
 * Converts a Firestore document snapshot into a plain {@link User} object
 * with ISO-8601 date strings, so consumers (and the persisted auth store)
 * never have to deal with raw Firestore Timestamp instances.
 *
 * @param {import('firebase/firestore').DocumentSnapshot} snap
 * @returns {object}
 */
function snapToProfile(snap) {
  const data = snap.data();

  return {
    ...data,
    id: snap.id,
    created_at:
      data.created_at instanceof Timestamp
        ? data.created_at.toDate().toISOString()
        : (data.created_at ?? null),
    updated_at:
      data.updated_at instanceof Timestamp
        ? data.updated_at.toDate().toISOString()
        : (data.updated_at ?? null),
  };
}

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Signs in an existing user via Firebase, then hydrates the store with the
 * Firestore-backed profile.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ firebaseUser: import('firebase/auth').User, profile: object }>}
 */
export async function loginWithEmail(email, password) {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const profile = await fetchUserProfile(firebaseUser);

    useAuthStore.getState().setAuth({ firebaseUser, profile });

    return { firebaseUser, profile };
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Creates a Firebase user, patches the Firebase display-name, then creates
 * the matching `users/{uid}` Firestore profile document.
 *
 * @param {string} email
 * @param {string} password
 * @param {{ displayName?: string, phone?: string, [key: string]: unknown }} profile
 * @returns {Promise<{ firebaseUser: import('firebase/auth').User, profile: object }>}
 */
export async function registerWithEmail(email, password, profile = {}) {
  let firebaseUser;

  try {
    ({ user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    ));

    if (profile.displayName) {
      await updateProfile(firebaseUser, { displayName: profile.displayName });
    }

    const userDoc = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      full_name: profile.displayName || "",
      phone: profile.phone || "",
      role: UserRole.CUSTOMER,
      tier: PassengerTier.CITIZEN,
      is_active: true,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await setDoc(doc(db, USERS_COLLECTION, firebaseUser.uid), userDoc);

    const createdProfile = await fetchUserProfile(firebaseUser);
    useAuthStore.getState().setAuth({ firebaseUser, profile: createdProfile });

    return { firebaseUser, profile: createdProfile };
  } catch (err) {
    // Roll back the Firebase Auth user if the Firestore profile write failed
    // so the two systems never drift out of sync.
    if (firebaseUser) {
      await firebaseUser.delete().catch(() => {
        // Swallow secondary error — primary error is re-thrown below.
      });
    }
    throw normaliseError(err);
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Signs out from Firebase and clears all local auth state.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await signOut(auth);
  } finally {
    useAuthStore.getState().clearAuth();
  }
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

/**
 * Sends a Firebase password-reset email to the given address.
 *
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function forgotPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── Profile lookup ───────────────────────────────────────────────────────────

/**
 * Fetches the Firestore `users/{uid}` profile for a signed-in Firebase user.
 * If no profile document exists yet (e.g. a Firebase Auth user created
 * before this collection existed, or directly via the console), a default
 * `customer` profile is created on the fly so the app never has to handle a
 * signed-in user with no profile.
 *
 * @param {import('firebase/auth').User} firebaseUser
 * @returns {Promise<object>}
 */
export async function fetchUserProfile(firebaseUser) {
  const ref = doc(db, USERS_COLLECTION, firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snapToProfile(snap);
  }

  const fallbackDoc = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    full_name: firebaseUser.displayName || "",
    phone: "",
    role: UserRole.CUSTOMER,
    tier: PassengerTier.CITIZEN,
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  await setDoc(ref, fallbackDoc);

  // Re-fetch so the serverTimestamp() sentinels are resolved to real values
  // before this profile is persisted into the auth store.
  const created = await getDoc(ref);
  return snapToProfile(created);
}
