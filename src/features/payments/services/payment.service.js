/**
 * Gets available payment providers for a given currency.
 *
 * @param {string} currency
 * @returns {('mpesa'|'stripe'|'bank_transfer')[]}
 */
export function getAvailableProviders(currency) {
  if (currency === 'KES') {
    return ['mpesa', 'stripe', 'bank_transfer'];
  }
  if (currency === 'USD') {
    return ['stripe', 'bank_transfer'];
  }
  return ['bank_transfer'];
}

/**
 * Formats raw provider transaction ID to a nice display label.
 *
 * @param {string} provider
 * @param {string} raw
 * @returns {string}
 */
export function formatProviderTxId(provider, raw) {
  if (!raw) return 'N/A';
  if (provider === 'mpesa') {
    return `M-Pesa Ref: ${raw}`;
  }
  if (provider === 'stripe') {
    return `Stripe Intent: ${raw.substring(0, 12)}...`;
  }
  return raw;
}

