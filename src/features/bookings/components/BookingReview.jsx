import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPassengerTier,
} from "@shared/utils";
import { ServiceType } from "@shared/types/enums";
import { getBookingServiceMeta } from "../utils/bookingUi";

const FIELD_CONFIG = {
  [ServiceType.SAFARI]: [
    { key: "package_name", label: "Package" },
    { key: "travel_date", label: "Travel date", format: formatDate },
    { key: "party_size", label: "Party size" },
    { key: "tier_applied", label: "Tier", format: formatPassengerTier },
    { key: "season_applied", label: "Season" },
  ],
  [ServiceType.SGR_TRANSFER]: [
    { key: "pickup_location", label: "Pickup location" },
    { key: "dropoff_location", label: "Drop-off location" },
    { key: "pickup_time", label: "Pickup time", format: formatDateTime },
    { key: "vehicle_type", label: "Vehicle type" },
    { key: "flight_or_train_number", label: "Flight / train number" },
  ],
  [ServiceType.FLIGHT]: [
    { key: "pickup_location", label: "Pickup location" },
    { key: "dropoff_location", label: "Drop-off location" },
    { key: "pickup_time", label: "Pickup time", format: formatDateTime },
    { key: "vehicle_type", label: "Vehicle type" },
    { key: "flight_or_train_number", label: "Flight / train number" },
  ],
  [ServiceType.DELIVERY]: [
    { key: "sender_address", label: "Sender address" },
    { key: "recipient_name", label: "Recipient" },
    { key: "recipient_phone", label: "Recipient phone" },
    { key: "delivery_address", label: "Delivery address" },
    { key: "parcel_weight_kg", label: "Parcel weight (kg)" },
    { key: "delivery_instructions", label: "Instructions" },
  ],
  [ServiceType.HOTEL]: [
    { key: "hotel_name", label: "Hotel" },
    { key: "room_category", label: "Room category" },
    { key: "check_in", label: "Check-in", format: formatDate },
    { key: "check_out", label: "Check-out", format: formatDate },
    { key: "number_of_rooms", label: "Rooms" },
  ],
  [ServiceType.EVENT]: [
    { key: "event_name", label: "Event" },
    { key: "event_type", label: "Event type" },
    { key: "venue_name", label: "Venue" },
    { key: "event_date", label: "Event date", format: formatDate },
    { key: "estimated_attendees", label: "Estimated attendees" },
  ],
};

/**
 * Read-only summary of a booking form before it's submitted.
 *
 * @param {{ type: string, formData: object }} props
 */
export default function BookingReview({ type, formData }) {
  const fields = FIELD_CONFIG[type] ?? [];
  const meta = getBookingServiceMeta(type);
  const Icon = meta.icon;
  const visibleFields = fields.filter((field) => {
    const value = formData?.[field.key];
    return value !== undefined && value !== null && value !== "";
  });

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.accent}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-stone-950 dark:text-stone-50">
            Review your details
          </h3>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Confirm the {meta.shortLabel.toLowerCase()} request before sending
            it to the operations team.
          </p>
        </div>
      </div>

      {visibleFields.length ? (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {visibleFields.map((field) => (
            <div
              key={field.key}
              className="rounded-xl bg-stone-50 p-4 dark:bg-stone-950/60"
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                {field.label}
              </dt>
              <dd className="mt-2 text-sm font-medium text-stone-950 dark:text-stone-50">
                {field.format
                  ? field.format(formData[field.key])
                  : String(formData[field.key])}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm text-stone-600 dark:bg-stone-950/60 dark:text-stone-400">
          No request details are available yet.
        </p>
      )}

      {formData?.total_amount != null ? (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <span className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
            Estimated total
          </span>
          <span className="text-lg font-semibold text-emerald-950 dark:text-emerald-100">
            {formatCurrency(formData.total_amount, formData.currency)}
          </span>
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
          We'll confirm the price once our team reviews this request.
        </p>
      )}
    </div>
  );
}
