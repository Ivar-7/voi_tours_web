/**
 * @typedef {'mpesa'|'stripe'|'bank_transfer'} PaymentProvider
 * @typedef {{ bookingId: string, provider: PaymentProvider, amount: number, currency: string }} InitiatePaymentPayload
 */
