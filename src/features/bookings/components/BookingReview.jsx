import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPassengerTier,
} from "@shared/utils";
import { ServiceType } from "@shared/types/enums";

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
  const visibleFields = fields.filter((field) => {
    const value = formData?.[field.key];
    return value !== undefined && value !== null && value !== "";
  });

  return (
    <div className="rounded-card border border-border bg-surface p-card-p">
      <h3 className="text-sm font-semibold text-text-primary">
        Review your details
      </h3>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {visibleFields.map((field) => (
          <div key={field.key}>
            <dt className="text-xs uppercase tracking-wide text-text-muted">
              {field.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-text-primary">
              {field.format
                ? field.format(formData[field.key])
                : String(formData[field.key])}
            </dd>
          </div>
        ))}
      </dl>

      {formData?.total_amount != null ? (
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium text-text-secondary">
            Estimated total
          </span>
          <span className="text-lg font-semibold text-text-primary">
            {formatCurrency(formData.total_amount, formData.currency)}
          </span>
        </div>
      ) : (
        <p className="mt-5 border-t border-border pt-4 text-sm text-text-muted">
          We'll confirm the price once our team reviews this request.
        </p>
      )}
    </div>
  );
}
