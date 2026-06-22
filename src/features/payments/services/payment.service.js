/**
 * Formats a PayHero `checkoutRequestID` into a display label.
 *
 * @param {string|null} checkoutRequestId
 * @returns {string}
 */
export function formatProviderTxId(checkoutRequestId) {
  return checkoutRequestId ? `M-Pesa Ref: ${checkoutRequestId}` : "Pending";
}
