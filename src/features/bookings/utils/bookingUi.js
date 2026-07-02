import {
  BedDouble,
  BriefcaseBusiness,
  CalendarDays,
  Compass,
  MapPin,
  Package,
  PartyPopper,
  Plane,
  TrainFront,
} from "lucide-react";
import { ServiceType } from "@shared/types/enums";

export const BOOKING_SERVICE_META = {
  [ServiceType.SAFARI]: {
    icon: Compass,
    label: "Safari",
    shortLabel: "Safari",
    description: "Reserve curated park itineraries with tier-aware pricing.",
    detail: "Package, travel date, and group size",
    eta: "Quote or instant total",
    accent:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  [ServiceType.SGR_TRANSFER]: {
    icon: TrainFront,
    label: "SGR Transfer",
    shortLabel: "SGR",
    description: "Coordinate pickup and drop-off around SGR train schedules.",
    detail: "Pickup, drop-off, time, and vehicle",
    eta: "Team quote",
    accent:
      "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  },
  [ServiceType.FLIGHT]: {
    icon: Plane,
    label: "Flight Transfer",
    shortLabel: "Flight",
    description: "Arrange airport pickup, transfer routing, and vehicle fit.",
    detail: "Airport, destination, time, and flight",
    eta: "Team quote",
    accent:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  },
  [ServiceType.HOTEL]: {
    icon: BedDouble,
    label: "Hotel",
    shortLabel: "Hotel",
    description: "Request rooms by hotel, category, dates, and occupancy.",
    detail: "Hotel, dates, room type, and rooms",
    eta: "Team quote",
    accent:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  [ServiceType.EVENT]: {
    icon: PartyPopper,
    label: "Event",
    shortLabel: "Event",
    description: "Plan transport and logistics for private or corporate events.",
    detail: "Event, venue, date, and attendance",
    eta: "Team quote",
    accent:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
  },
  [ServiceType.DELIVERY]: {
    icon: Package,
    label: "Delivery",
    shortLabel: "Delivery",
    description: "Book parcel movement with sender and recipient details.",
    detail: "Addresses, recipient, weight, and notes",
    eta: "Team quote",
    accent:
      "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  },
};

export const BOOKING_SERVICE_OPTIONS = Object.values(ServiceType).map(
  (type) => ({
    type,
    ...BOOKING_SERVICE_META[type],
  }),
);

export const BOOKING_FLOW_POINTS = [
  {
    icon: BriefcaseBusiness,
    title: "Request",
    description: "Submit the exact service details the operations team needs.",
  },
  {
    icon: CalendarDays,
    title: "Confirm",
    description: "Review the booking and approve the request before it is sent.",
  },
  {
    icon: MapPin,
    title: "Coordinate",
    description: "Track status, payment, and updates from your dashboard.",
  },
];

export function getBookingServiceMeta(type) {
  return (
    BOOKING_SERVICE_META[type] ?? {
      icon: Compass,
      label: "Booking",
      shortLabel: "Booking",
      description: "Service request",
      detail: "Booking details",
      eta: "Team quote",
      accent:
        "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    }
  );
}

export function getBookingPrimaryDetail(booking) {
  if (!booking) return "Details pending";

  switch (booking.type) {
    case ServiceType.SAFARI:
      return booking.safari?.travel_date
        ? `Travel date ${booking.safari.travel_date}`
        : "Safari itinerary";
    case ServiceType.SGR_TRANSFER:
    case ServiceType.FLIGHT:
      return booking.transfer?.dropoff_location
        ? `To ${booking.transfer.dropoff_location}`
        : "Transfer route";
    case ServiceType.HOTEL:
      return booking.hotel?.hotel_name || "Hotel stay";
    case ServiceType.EVENT:
      return booking.event?.event_name || "Event logistics";
    case ServiceType.DELIVERY:
      return booking.delivery?.delivery_address
        ? `To ${booking.delivery.delivery_address}`
        : "Delivery request";
    default:
      return "Booking details";
  }
}
