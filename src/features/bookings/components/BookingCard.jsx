import { Link } from "react-router-dom";
import {
  Compass,
  TrainFront,
  Plane,
  BedDouble,
  PartyPopper,
  Package,
  ArrowRight,
} from "lucide-react";
import Card from "@shared/components/ui/Card";
import { formatCurrency, formatDate, formatServiceType } from "@shared/utils";
import { ServiceType } from "@shared/types/enums";
import BookingStatusBadge from "./BookingStatusBadge";

const SERVICE_ICONS = {
  [ServiceType.SAFARI]: Compass,
  [ServiceType.SGR_TRANSFER]: TrainFront,
  [ServiceType.FLIGHT]: Plane,
  [ServiceType.HOTEL]: BedDouble,
  [ServiceType.EVENT]: PartyPopper,
  [ServiceType.DELIVERY]: Package,
};

/**
 * @param {{ booking: import('@/shared/types/models').Booking }} props
 */
export default function BookingCard({ booking }) {
  const Icon = SERVICE_ICONS[booking.type] ?? Compass;

  return (
    <Card
      as={Link}
      to={`/dashboard/bookings/${booking.id}`}
      hover
      className="flex items-center gap-4"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-text-primary">
            {formatServiceType(booking.type)}
          </p>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="mt-0.5 text-sm text-text-muted">
          Booked {formatDate(booking.created_at)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-semibold text-text-primary">
          {booking.total_amount != null
            ? formatCurrency(booking.total_amount, booking.currency)
            : "Awaiting quote"}
        </p>
        <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-text-muted">
          View details <ArrowRight className="h-3 w-3" />
        </p>
      </div>
    </Card>
  );
}
