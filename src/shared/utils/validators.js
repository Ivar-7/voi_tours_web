const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KENYAN_PHONE_RE = /^(07|01)\d{8}$/;

/**
 * Normalises a Kenyan phone number to the `07XXXXXXXX` / `01XXXXXXXX` shape
 * expected by the PayHero Cloud Function (mirrors
 * `firebase_functions/src/payments/config.ts:normalizePhone` so client-side
 * validation never disagrees with what the backend will accept).
 *
 * @param {string} phone
 * @returns {string}
 */
export function normalizeKenyanPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) {
    return `0${digits.substring(3)}`;
  }
  if (digits.startsWith("7") && digits.length === 9) return `0${digits}`;
  if (digits.startsWith("1") && digits.length === 9) return `0${digits}`;

  return digits;
}

/**
 * @param {string} phone — any common Kenyan phone format (+254, 254, 07.., 01..)
 * @returns {boolean}
 */
export function isValidKenyanPhone(phone) {
  return KENYAN_PHONE_RE.test(normalizeKenyanPhone(phone));
}

/**
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_RE.test(email.trim());
}

/**
 * @param {number|string} amount
 * @returns {boolean}
 */
export function isValidKesAmount(amount) {
  const value = Number(amount);
  return Number.isFinite(value) && value > 0;
}

/**
 * @param {string} dateString
 * @returns {boolean}
 */
export function isValidDate(dateString) {
  if (!dateString) return false;
  return !Number.isNaN(Date.parse(dateString));
}
