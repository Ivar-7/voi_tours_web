/**
 * Formats phone number into E.164 (+254...) Kenyan format.
 *
 * @param {string} phone
 * @returns {string}
 */
export function formatSafaricomPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '+254' + digits.substring(1);
  }
  if (digits.startsWith('254')) {
    return '+' + digits;
  }
  if (phone.startsWith('+254')) {
    return '+' + digits;
  }
  return '+254' + digits;
}

/**
 * Validates if the phone number is a valid Safaricom number.
 * Safaricom numbers typically use prefixes under +254 70x, 71x, 72x, 74x, 75x, 768/9, 79x, 11x.
 *
 * @param {string} phone
 * @returns {boolean}
 */
export function validateSafaricomPhone(phone) {
  if (!phone) return false;
  const formatted = formatSafaricomPhone(phone);
  const regex = /^\+254(7[0-2,4-6,9]|1[1-2])[0-9]{7}$/;
  return regex.test(formatted);
}

