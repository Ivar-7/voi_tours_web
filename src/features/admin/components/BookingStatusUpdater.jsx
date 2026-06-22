import toast from "react-hot-toast";
import { OperationalStatus } from "@/shared/types/enums";
import { useUpdateBookingStatus } from "../hooks/useAdminBookings";

const STATUS_OPTIONS = Object.values(OperationalStatus);

/**
 * @param {{ bookingId: string, currentStatus: string }} props
 */
export default function BookingStatusUpdater({ bookingId, currentStatus }) {
  const { mutate, isPending } = useUpdateBookingStatus();

  function handleChange(event) {
    const status = event.target.value;
    if (status === currentStatus) return;

    mutate(
      { id: bookingId, status },
      {
        onSuccess: () => toast.success("Booking status updated"),
        onError: (err) => toast.error(err?.message || "Update failed"),
      },
    );
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-full border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-stone-200 transition-colors hover:border-amber-500 disabled:opacity-60"
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
