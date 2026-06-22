# Profile Feature

Firestore-backed — no separate backend.

## Responsibilities

- View and update personal details (`full_name`, `phone`) on the
  `users/{uid}` Firestore document.
- Display tier/role (read-only — `tier` is set at registration,
  admin-changeable only via `src/features/admin/`).
- Change password via Firebase Auth (`reauthenticateWithCredential` +
  `updatePassword`).
- Avatar upload to Firebase Storage (`avatars/{uid}/avatar`), synced to
  both the Firestore profile (`avatar_url`) and the Firebase Auth
  `photoURL`.

## Files

| Path                                    | Role                                       |
| ------------------------------------------ | --------------------------------------------- |
| `api/profile.api.js`                       | Firestore profile CRUD + Storage upload + Firebase Auth password change |
| `hooks/useProfile.js`                      | Profile query                              |
| `hooks/useUpdateProfile.js`                | `useUpdateProfile`, `useUploadAvatar`, `useChangePassword` |
| `components/ProfileForm.jsx`               | Editable `full_name`/`phone`, read-only email/tier/role |
| `components/ProfileAvatar.jsx`             | Avatar + upload button                     |
| `components/PasswordChangeForm.jsx`        | Password change form                       |
| `components/TierBadge.jsx`                 | Tier pill (citizen/resident/international) |
| `pages/ProfilePage.jsx`                    | `/dashboard/profile`                       |
