import { cn } from "@shared/utils/cn";

// Maps OperationalStatus + PaymentStatus values (src/shared/types/enums.js)
// to the --color-status-* design tokens. Both enums share "pending" and
// "cancelled" so a single lookup covers booking status and payment status.
// Tailwind's scanner needs full literal class strings, so each status gets
// its own pre-built className rather than an interpolated token fragment.
const STATUS_STYLES = {
  pending: "bg-status-pending/10 text-status-pending",
  unpaid: "bg-status-pending/10 text-status-pending",
  confirmed: "bg-status-confirmed/10 text-status-confirmed",
  in_progress: "bg-status-in_progress/10 text-status-in_progress",
  partially_paid: "bg-status-in_progress/10 text-status-in_progress",
  refunded: "bg-status-in_progress/10 text-status-in_progress",
  completed: "bg-status-completed/10 text-status-completed",
  fully_paid: "bg-status-completed/10 text-status-completed",
  cancelled: "bg-status-cancelled/10 text-status-cancelled",
  failed: "bg-status-cancelled/10 text-status-cancelled",
};

const DOT_STYLES = {
  pending: "bg-status-pending",
  unpaid: "bg-status-pending",
  confirmed: "bg-status-confirmed",
  in_progress: "bg-status-in_progress",
  partially_paid: "bg-status-in_progress",
  refunded: "bg-status-in_progress",
  completed: "bg-status-completed",
  fully_paid: "bg-status-completed",
  cancelled: "bg-status-cancelled",
  failed: "bg-status-cancelled",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

function toLabel(status) {
  return String(status || "Unknown")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Badge({ status, size = "sm", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        STATUS_STYLES[status] ?? "bg-border/40 text-text-secondary",
        sizes[size] ?? sizes.sm,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          DOT_STYLES[status] ?? "bg-text-muted",
        )}
      />
      {toLabel(status)}
    </span>
  );
}
