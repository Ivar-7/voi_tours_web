// TODO: Implement error normalisation
// Converts Axios errors into a consistent AppError shape:
// { message: string, status: number, code: string, fieldErrors: Record<string, string> }

export class AppError extends Error {
  constructor(message, status, code, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

/** @param {import('axios').AxiosError} error */
export function normalizeError(error) {
  // placeholder
}
