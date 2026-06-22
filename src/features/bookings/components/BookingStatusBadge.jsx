import Badge from "@shared/components/ui/Badge";

/**
 * @param {{ status: import('@shared/types/enums').OperationalStatus }} props
 */
export default function BookingStatusBadge({ status }) {
  return <Badge status={status} />;
}
