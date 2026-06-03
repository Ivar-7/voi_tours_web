/**
 * JSDoc model definitions — derived from the production PostgreSQL DDL schema.
 * Import these types in JSDoc @param / @returns annotations across the codebase.
 */

// ── Users & Auth ─────────────────────────────────────────────────────────────

/**
 * @typedef {Object} User
 * @property {string}  id
 * @property {string}  email
 * @property {'customer'|'agent'|'admin'} role
 * @property {string}  full_name
 * @property {string}  phone
 * @property {'citizen'|'resident'|'international'} tier
 * @property {boolean} is_active
 * @property {string}  created_at  - ISO 8601
 * @property {string}  updated_at  - ISO 8601
 */

/**
 * @typedef {Object} Inquiry
 * @property {string}  id
 * @property {string}  customer_name
 * @property {string}  customer_email
 * @property {string}  customer_phone
 * @property {'safari'|'sgr_transfer'|'flight'|'hotel'|'event'|'delivery'} requested_service
 * @property {string}  message
 * @property {boolean} is_converted
 * @property {string|null} assigned_agent_id
 * @property {string}  created_at
 */

// ── Inventory ─────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} DestinationMedia
 * @property {string} url
 * @property {string} alt
 * @property {number} sort_order
 */

/**
 * @typedef {Object} Destination
 * @property {string}              id
 * @property {string}              name
 * @property {string}              slug
 * @property {string}              region
 * @property {string}              description
 * @property {DestinationMedia[]}  media
 * @property {boolean}             is_featured
 * @property {string}              created_at
 */

/**
 * @typedef {Object} Package
 * @property {string}  id
 * @property {string}  title
 * @property {string}  slug
 * @property {string}  description
 * @property {number}  duration_days
 * @property {boolean} is_active
 * @property {string}  created_at
 * @property {string}  updated_at
 */

/**
 * @typedef {Object} PackageDestination
 * @property {string} package_id
 * @property {string} destination_id
 * @property {number} stop_order
 */

/**
 * @typedef {Object} PackageItinerary
 * @property {string}      id
 * @property {string}      package_id
 * @property {number}      day_number
 * @property {string}      activity_title
 * @property {string}      activity_description
 * @property {string|null} included_meals       - e.g. 'B, L, D'
 * @property {string|null} accommodation_hint
 */

/**
 * @typedef {Object} PackagePricing
 * @property {string}  id
 * @property {string}  package_id
 * @property {'citizen'|'resident'|'international'} tier
 * @property {'low'|'regular'|'peak'} season
 * @property {number}  price_per_person
 * @property {string}  currency             - ISO 4217, e.g. 'KES' or 'USD'
 */

// ── Bookings ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Booking
 * @property {string}  id
 * @property {string}  user_id
 * @property {'safari'|'sgr_transfer'|'flight'|'hotel'|'event'|'delivery'} type
 * @property {'pending'|'confirmed'|'in_progress'|'completed'|'cancelled'} status
 * @property {number}  total_amount
 * @property {string}  currency
 * @property {string|null} internal_notes
 * @property {string}  created_at
 * @property {string}  updated_at
 */

/**
 * @typedef {Object} BookingSafari
 * @property {string}  booking_id
 * @property {string}  package_id
 * @property {string}  travel_date          - ISO date
 * @property {number}  party_size
 * @property {'citizen'|'resident'|'international'} tier_applied
 * @property {'low'|'regular'|'peak'} season_applied
 */

/**
 * @typedef {Object} BookingTransfer
 * @property {string}      booking_id
 * @property {string}      pickup_location
 * @property {string}      dropoff_location
 * @property {string}      pickup_time       - ISO 8601 datetime
 * @property {string}      vehicle_type
 * @property {string|null} flight_or_train_number
 */

/**
 * @typedef {Object} BookingDelivery
 * @property {string}      booking_id
 * @property {string}      sender_address
 * @property {string}      recipient_name
 * @property {string}      recipient_phone
 * @property {string}      delivery_address
 * @property {number|null} parcel_weight_kg
 * @property {string|null} delivery_instructions
 */

/**
 * @typedef {Object} BookingHotel
 * @property {string} booking_id
 * @property {string} hotel_name
 * @property {string} room_category
 * @property {string} check_in             - ISO date
 * @property {string} check_out            - ISO date
 * @property {number} number_of_rooms
 */

/**
 * @typedef {Object} BookingEvent
 * @property {string} booking_id
 * @property {string} event_name
 * @property {string} event_type
 * @property {string} venue_name
 * @property {string} event_date           - ISO date
 * @property {number} estimated_attendees
 */

// ── Payments ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Payment
 * @property {string}  id
 * @property {string}  booking_id
 * @property {number}  amount
 * @property {string}  currency
 * @property {'mpesa'|'stripe'|'bank_transfer'} provider
 * @property {string}  provider_tx_id
 * @property {'unpaid'|'partially_paid'|'fully_paid'|'failed'|'refunded'} status
 * @property {Object}  gateway_metadata     - Raw M-Pesa / Stripe webhook payload
 * @property {string}  created_at
 */

// ── Reviews ───────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Review
 * @property {string}      id
 * @property {string}      user_id
 * @property {string|null} package_id
 * @property {string|null} destination_id
 * @property {1|2|3|4|5}  rating
 * @property {string}      comment
 * @property {boolean}     is_visible_on_homepage
 * @property {string}      created_at
 */

// ── Composed / enriched shapes used by the UI ─────────────────────────────────

/**
 * @typedef {Package & { destinations: Destination[], itinerary: PackageItinerary[], pricing: PackagePricing[] }} PackageDetail
 */

/**
 * @typedef {Booking & { safari?: BookingSafari, transfer?: BookingTransfer, delivery?: BookingDelivery, hotel?: BookingHotel, event?: BookingEvent, payments: Payment[] }} BookingDetail
 */
