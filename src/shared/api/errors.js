export class AppError extends Error {
  constructor(message, status, code, fieldErrors = {}) {
    super(message);
    this.name = "AppError";
    this.status = status || 500;
    this.code = code || "UNKNOWN";
    this.fieldErrors = fieldErrors || {};
  }
}

/**
 * Normalises REST (Axios) errors and Firebase/Firestore errors
 * into a consistent AppError format.
 *
 * @param {any} error
 * @returns {AppError}
 */
export function normalizeError(error) {
  if (error instanceof AppError) {
    return error;
  }

  // Log the real error for diagnosis — the AppError returned below only
  // ever carries a sanitized, user-safe message.
  console.error("[normalizeError]", error);

  let message = "An unexpected error occurred";
  let status = 500;
  let code = "UNKNOWN";
  let fieldErrors = {};

  // 1. Handle Axios/REST API Errors
  if (error?.isAxiosError || error?.response) {
    const data = error.response?.data;
    status = error.response?.status || 500;
    // Only trust a message the backend explicitly curated for display —
    // never fall back to error.message, which can contain raw transport
    // details (e.g. "Request failed with status code 500").
    message = data?.message || data?.detail || message;
    code = data?.code || error.code || "API_ERROR";
    fieldErrors = data?.fieldErrors || data?.errors || {};
  }
  // 2. Handle Firebase Auth / Firestore Errors
  else if (error?.code) {
    code = error.code;

    // Map common Firebase code structures
    switch (error.code) {
      case "auth/invalid-email":
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        status = 401;
        message = "Invalid email or password.";
        break;
      case "auth/email-already-in-use":
        status = 409;
        message = "This email address is already in use.";
        break;
      case "auth/weak-password":
        status = 400;
        message = "Password is too weak. It must be at least 6 characters.";
        break;
      case "auth/requires-recent-login":
        status = 401;
        message = "Please re-authenticate and try again.";
        break;
      case "permission-denied":
        status = 403;
        message = "You do not have permission to perform this action.";
        break;
      case "not-found":
        status = 404;
        message = "The requested resource was not found.";
        break;
      default:
        // Unmapped Firebase/Firestore code — keep the generic fallback
        // message rather than surfacing the raw internal error.message.
        status = 400;
    }
  }
  // 3. Generic JS Errors — keep the generic fallback message; the raw
  // error.message may contain internals that shouldn't reach the UI.

  return new AppError(message, status, code, fieldErrors);
}

// Export the alias for the alternative spelling
export const normaliseError = normalizeError;
