import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, db, storage } from "@/config/firebase/firebase.js";
import { normaliseError } from "@/shared/api";
import { fetchUserProfile } from "@features/auth/api/auth.api";
import { useAuthStore } from "@/shared/store";

/**
 * Fetches the currently authenticated user's Firestore profile.
 *
 * @returns {Promise<import('@/shared/types/models').User>}
 */
export async function getMyProfile() {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw Object.assign(new Error("Not signed in."), {
        code: "unauthenticated",
        status: 401,
      });
    }
    return await fetchUserProfile(firebaseUser);
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Updates editable profile fields. `tier`/`role`/`is_active` are
 * intentionally not accepted here — those are admin-only (see
 * `firestore.rules` and `src/features/admin/`).
 *
 * @param {{ full_name?: string, phone?: string }} payload
 * @returns {Promise<import('@/shared/types/models').User>}
 */
export async function updateMyProfile(payload) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw Object.assign(new Error("Not signed in."), {
        code: "unauthenticated",
        status: 401,
      });
    }

    const updates = {};
    if (payload.full_name !== undefined) updates.full_name = payload.full_name;
    if (payload.phone !== undefined) updates.phone = payload.phone;

    await updateDoc(doc(db, "users", uid), {
      ...updates,
      updated_at: serverTimestamp(),
    });

    if (updates.full_name) {
      await updateFirebaseProfile(auth.currentUser, {
        displayName: updates.full_name,
      });
    }

    return getMyProfile();
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Uploads a new avatar image to Firebase Storage and stores its download
 * URL on the Firestore profile (and the Firebase Auth `photoURL`).
 *
 * @param {File} file
 * @returns {Promise<string>} the new avatar URL
 */
export async function uploadAvatar(file) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw Object.assign(new Error("Not signed in."), {
        code: "unauthenticated",
        status: 401,
      });
    }

    const storageRef = ref(storage, `avatars/${uid}/avatar`);
    await uploadBytes(storageRef, file);
    const avatarUrl = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "users", uid), {
      avatar_url: avatarUrl,
      updated_at: serverTimestamp(),
    });
    await updateFirebaseProfile(auth.currentUser, { photoURL: avatarUrl });

    return avatarUrl;
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Changes the signed-in user's password. Firebase requires a recent
 * sign-in for this, so we re-authenticate with the current password first.
 *
 * @param {{ current_password: string, new_password: string }} payload
 * @returns {Promise<void>}
 */
export async function changePassword(payload) {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser?.email) {
      throw Object.assign(new Error("Not signed in."), {
        code: "unauthenticated",
        status: 401,
      });
    }

    const credential = EmailAuthProvider.credential(
      firebaseUser.email,
      payload.current_password,
    );
    await reauthenticateWithCredential(firebaseUser, credential);
    await updatePassword(firebaseUser, payload.new_password);
  } catch (error) {
    throw normaliseError(error);
  }
}

/**
 * Helper for components that need to keep the Zustand auth store in sync
 * after a profile update (the store, not just React Query's cache, is the
 * source of truth for `user.full_name` shown in navbars/layouts).
 *
 * @param {import('@/shared/types/models').User} profile
 */
export function syncProfileToStore(profile) {
  useAuthStore.getState().setUser(profile);
}
