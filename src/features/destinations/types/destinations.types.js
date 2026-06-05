/**
 * @file destinations.types.js
 * Canonical type definitions for the Destinations feature.
 * Shared between api, hooks, components, and pages.
 */

// ─── Core entity ──────────────────────────────────────────────────────────────

/**
 * A single tourist destination document as stored in Firestore and
 * returned by the API layer. All date fields are ISO-8601 strings after
 * serialisation (Firestore Timestamps are converted on read).
 *
 * @typedef {Object} Destination
 *
 * @property {string}   id              - Firestore document ID (auto-generated).
 * @property {string}   slug            - URL-safe unique identifier, e.g. "tsavo-east".
 * @property {string}   name            - Display name, e.g. "Tsavo East National Park".
 * @property {string}   tagline         - Short one-liner shown on cards.
 * @property {string}   description     - Full rich-text description (markdown or HTML string).
 * @property {string}   region          - One of the DestinationRegion values.
 * @property {string[]} highlights      - Bullet-point list of key experiences.
 * @property {string}   heroImage       - Primary image URL (Unsplash / Cloud Storage).
 * @property {string[]} gallery         - Additional image URLs.
 * @property {boolean}  featured        - Whether to surface on the homepage featured row.
 * @property {number}   [priceFrom]     - Indicative starting price in KES.
 * @property {string}   [currency]      - ISO-4217 code; defaults to "KES".
 * @property {string[]} [tags]          - Free-form searchable tags.
 * @property {DestinationSEO} [seo]     - Page-level SEO overrides.
 * @property {string}   createdAt       - ISO-8601 creation timestamp.
 * @property {string}   updatedAt       - ISO-8601 last-modified timestamp.
 * @property {string}   [createdBy]     - UID of the admin who created the record.
 * @property {string}   [updatedBy]     - UID of the admin who last updated the record.
 */

// ─── Region enum ──────────────────────────────────────────────────────────────

/**
 * Canonical region values. Use these constants everywhere instead of raw strings
 * so a typo in a filter never silently returns an empty result set.
 *
 * @readonly
 * @enum {string}
 */
export const DestinationRegion = /** @type {const} */ ({
  COAST:        'coast',
  SAVANNA:      'savanna',
  MOUNTAIN:     'mountain',
  LAKE:         'lake',
  URBAN:        'urban',
  MARINE:       'marine',
});

// ─── SEO sub-type ─────────────────────────────────────────────────────────────

/**
 * Per-destination SEO metadata.
 *
 * @typedef {Object} DestinationSEO
 * @property {string} [title]       - <title> override; falls back to name.
 * @property {string} [description] - <meta description>; falls back to tagline.
 * @property {string[]} [keywords]  - Extra meta keywords.
 */

// ─── Filter / query params ────────────────────────────────────────────────────

/**
 * Query parameters accepted by getDestinations().
 *
 * @typedef {Object} DestinationFilters
 * @property {string}  [region]   - Filter by DestinationRegion value.
 * @property {boolean} [featured] - When true, return only featured destinations.
 * @property {string}  [tag]      - Filter by a single tag string.
 * @property {number}  [limit]    - Cap the number of results returned.
 * @property {string}  [orderBy]  - Field to sort by; defaults to "name".
 * @property {'asc'|'desc'} [order] - Sort direction; defaults to "asc".
 */

// ─── Write payloads ───────────────────────────────────────────────────────────

/**
 * Fields required when creating a new destination.
 * `id`, `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` are set
 * server-side and must NOT be supplied by the caller.
 *
 * @typedef {Omit<Destination, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>} CreateDestinationPayload
 */

/**
 * All fields are optional on update — only the supplied keys are patched.
 * `id`, `slug`, `createdAt`, and `createdBy` are immutable after creation.
 *
 * @typedef {Partial<Omit<Destination, 'id' | 'slug' | 'createdAt' | 'createdBy'>>} UpdateDestinationPayload
 */

// ─── Operation results ────────────────────────────────────────────────────────

/**
 * Returned by deleteDestination when the operation succeeds.
 *
 * @typedef {Object} DeleteResult
 * @property {string}  id      - ID of the deleted document.
 * @property {boolean} success - Always true on success.
 */