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

  let message = "An unexpected error occurred";
  let status = 500;
  let code = "UNKNOWN";
  let fieldErrors = {};

  // 1. Handle Axios/REST API Errors
  if (error?.isAxiosError || error?.response) {
    const data = error.response?.data;
    status = error.response?.status || 500;
    message = data?.message || data?.detail || error.message || message;
    code = data?.code || error.code || "API_ERROR";
    fieldErrors = data?.fieldErrors || data?.errors || {};
  }
  // 2. Handle Firebase Auth / Firestore Errors
  else if (error?.code) {
    code = error.code;
    message = error.message || message;

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
        status = 400;
    }
  }
  // 3. Generic JS Errors
  else if (error instanceof Error) {
    message = error.message;
  }

  return new AppError(message, status, code, fieldErrors);
}

// Export the alias for the alternative spelling
export const normaliseError = normalizeError;
