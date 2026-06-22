import { PassengerTier, ServiceType } from "@/shared/types/enums";

const SERVICE_TYPE_LABELS = {
  [ServiceType.SAFARI]: "Safari",
  [ServiceType.SGR_TRANSFER]: "SGR Transfer",
  [ServiceType.FLIGHT]: "Flight",
  [ServiceType.HOTEL]: "Hotel",
  [ServiceType.EVENT]: "Event",
  [ServiceType.DELIVERY]: "Delivery",
};

const PASSENGER_TIER_LABELS = {
  [PassengerTier.CITIZEN]: "Citizen",
  [PassengerTier.RESIDENT]: "Resident",
  [PassengerTier.INTERNATIONAL]: "International",
};

/**
 * Formats a numeric amount as a localised currency string (KES/USD).
 *
 * @param {number|string} amount
 * @param {string} [currency="KES"]
 * @returns {string}
 */
export function formatCurrency(amount, currency = "KES") {
  const value = Number(amount);
  if (amount === null || amount === undefined || Number.isNaN(value)) {
    return "N/A";
  }

  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  }
}

/**
 * Formats an ISO date/datetime string as a human-readable date.
 *
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return "N/A";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium" }).format(
    date,
  );
}

/**
 * Formats an ISO date/datetime string including the time of day.
 *
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export function formatDateTime(value) {
  if (!value) return "N/A";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Formats a pair of ISO dates as a human-readable range, e.g.
 * "12 Jun 2026 – 15 Jun 2026".
 *
 * @param {string|Date|null|undefined} from
 * @param {string|Date|null|undefined} to
 * @returns {string}
 */
export function formatDateRange(from, to) {
  const start = formatDate(from);
  const end = formatDate(to);

  if (start === "N/A" && end === "N/A") return "N/A";
  if (end === "N/A") return start;
  if (start === "N/A") return end;

  return `${start} – ${end}`;
}

/**
 * Formats a day count as "N Days / M Nights".
 *
 * @param {number|string} days
 * @returns {string}
 */
export function formatDuration(days) {
  const value = Number(days);
  if (!value || Number.isNaN(value)) return "Duration TBC";

  const nights = Math.max(value - 1, 0);
  return `${value} Day${value === 1 ? "" : "s"} / ${nights} Night${nights === 1 ? "" : "s"}`;
}

/**
 * @param {string} tier — a {@link PassengerTier} value
 * @returns {string}
 */
export function formatPassengerTier(tier) {
  return PASSENGER_TIER_LABELS[tier] || tier || "Unknown";
}

/**
 * @param {string} type — a {@link ServiceType} value
 * @returns {string}
 */
export function formatServiceType(type) {
  return SERVICE_TYPE_LABELS[type] || type || "Unknown";
}
