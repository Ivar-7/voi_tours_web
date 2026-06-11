// Derived from the production PostgreSQL schema

/** @readonly */
export const UserRole = /** @type {const} */ ({
  CUSTOMER: "customer",
  AGENT: "agent",
  ADMIN: "admin",
});

/** @readonly */
export const ServiceType = /** @type {const} */ ({
  SAFARI: "safari",
  SGR_TRANSFER: "sgr_transfer",
  FLIGHT: "flight",
  HOTEL: "hotel",
  EVENT: "event",
  DELIVERY: "delivery",
});

/** @readonly */
export const OperationalStatus = /** @type {const} */ ({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

/** @readonly */
export const PaymentStatus = /** @type {const} */ ({
  UNPAID: "unpaid",
  PARTIALLY_PAID: "partially_paid",
  FULLY_PAID: "fully_paid",
  FAILED: "failed",
  REFUNDED: "refunded",
});

/** @readonly */
export const PassengerTier = /** @type {const} */ ({
  CITIZEN: "citizen",
  RESIDENT: "resident",
  INTERNATIONAL: "international",
});

/** @readonly */
export const PricingSeason = /** @type {const} */ ({
  LOW: "low",
  REGULAR: "regular",
  PEAK: "peak",
});

/** @readonly */
export const PaymentProvider = /** @type {const} */ ({
  MPESA: "mpesa",
  STRIPE: "stripe",
  BANK_TRANSFER: "bank_transfer",
});
