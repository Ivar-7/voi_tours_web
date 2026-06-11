/**
 * @file packages.types.js
 * Canonical type definitions for the Packages feature.
 */

import { PassengerTier, PricingSeason } from "@/shared/types/enums";

// ─── Embedded sub-types ───────────────────────────────────────────────────────

/**
 * Destination stop embedded on a package document.
 *
 * @typedef {Object} PackageDestinationStop
 * @property {string} destination_id
 * @property {string} [name]        - Denormalised display name.
 * @property {number} stop_order
 */

/**
 * Itinerary day row embedded on a package document.
 *
 * @typedef {Object} PackageItineraryRow
 * @property {number}      day_number
 * @property {string}      activity_title
 * @property {string}      activity_description
 * @property {string|null} [included_meals]
 * @property {string|null} [accommodation_hint]
 */

/**
 * Pricing cell embedded on a package document.
 *
 * @typedef {Object} PackagePricingRow
 * @property {'citizen'|'resident'|'international'} tier
 * @property {'low'|'regular'|'peak'} season
 * @property {number}  price_per_person
 * @property {string}  currency
 */

// ─── Core entity ──────────────────────────────────────────────────────────────

/**
 * Package document as stored in Firestore and returned by the API layer.
 *
 * @typedef {Object} PackageRecord
 * @property {string}   id
 * @property {string}   title
 * @property {string}   slug
 * @property {string}   description
 * @property {number}   duration_days
 * @property {boolean}  is_active
 * @property {string}   [hero_image]
 * @property {string[]} [highlights]
 * @property {PackageDestinationStop[]} [destinations]
 * @property {PackageItineraryRow[]}      [itinerary]
 * @property {PackagePricingRow[]}        [pricing]
 * @property {string}   created_at
 * @property {string}   updated_at
 * @property {string}   [created_by]
 * @property {string}   [updated_by]
 */

/**
 * Enriched package shape for detail pages — matches models.js PackageDetail.
 *
 * @typedef {import('@/shared/types/models').PackageDetail} PackageDetailRecord
 */

// ─── Filters ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} PackageFilters
 * @property {string}  [destination]   - Destination ID or slug filter.
 * @property {number}  [duration_min]
 * @property {number}  [duration_max]
 * @property {string}  [season]        - PricingSeason value.
 * @property {boolean} [is_active]     - Admin filter; defaults to true on public reads.
 * @property {number}  [limit]
 * @property {string}  [orderBy]       - Field to sort by; default "title".
 * @property {'asc'|'desc'} [order]
 */

// ─── Write payloads ───────────────────────────────────────────────────────────

/**
 * @typedef {Omit<PackageRecord, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>} CreatePackagePayload
 */

/**
 * @typedef {Partial<Omit<PackageRecord, 'id' | 'slug' | 'created_at' | 'created_by'>>} UpdatePackagePayload
 */

/**
 * @typedef {Object} DeleteResult
 * @property {string}  id
 * @property {boolean} success
 */

export const PackageTier = PassengerTier;
export const PackageSeason = PricingSeason;

export const tierOptions = [
  { value: PassengerTier.CITIZEN, label: "Citizen" },
  { value: PassengerTier.RESIDENT, label: "Resident" },
  { value: PassengerTier.INTERNATIONAL, label: "International" },
];

export const seasonOptions = [
  { value: PricingSeason.LOW, label: "Low season" },
  { value: PricingSeason.REGULAR, label: "Regular season" },
  { value: PricingSeason.PEAK, label: "Peak season" },
];
