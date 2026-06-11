import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import httpClient, { normaliseError } from "@/shared/api";
import { useAuthStore } from "@/shared/store";
import { auth } from "@/config/firebase";

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Signs in an existing user via Firebase, then hydrates the store
 * with the full profile fetched from the backend `/me` endpoint.
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

    // Exchange the Firebase UID/token for our backend session.
    const profile = await fetchMe();

    useAuthStore.getState().setAuth({ firebaseUser, profile });

    return { firebaseUser, profile };
  } catch (err) {
    throw normaliseError(err);
  }
}

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Creates a Firebase user, patches the Firebase display-name,
 * then POSTs to `/users` to create the backend record.
 *
 * @param {string} email
 * @param {string} password
 * @param {{ displayName?: string, [key: string]: unknown }} profile
 * @returns {Promise<{ firebaseUser: import('firebase/auth').User, profile: object }>}
 */
export async function registerWithEmail(email, password, profile = {}) {
  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Keep Firebase display name in sync when provided.
    if (profile.displayName) {
      await updateProfile(firebaseUser, { displayName: profile.displayName });
    }

    // Create the backend record. The interceptor in httpClient will attach
    // the Firebase ID token automatically.
    const backendProfile = await httpClient.post("/users", {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      ...profile,
    });

    useAuthStore.getState().setAuth({ firebaseUser, profile: backendProfile });

    return { firebaseUser, profile: backendProfile };
  } catch (err) {
    // Roll back Firebase user if the backend call failed so the two systems
    // stay consistent.
    if (auth.currentUser) {
      await auth.currentUser.delete().catch(() => {
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
    // Always clear local state, even if Firebase signOut threw.
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

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Fetches the current user's profile from the backend.
 * Relies on the auth interceptor in `httpClient` to attach the Firebase
 * ID token as a Bearer header.
 *
 * @returns {Promise<object>}
 */
async function fetchMe() {
  return httpClient.get("/me");
}
