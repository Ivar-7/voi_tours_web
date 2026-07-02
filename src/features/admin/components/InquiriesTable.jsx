import toast from "react-hot-toast";
import EmptyState from "@shared/components/feedback/EmptyState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import { formatDate, formatServiceType } from "@shared/utils";
import { useConvertInquiry } from "../hooks/useAdminInquiries";
import InquiryAssigner from "./InquiryAssigner";

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse border-b border-stone-200 bg-stone-100 last:border-b-0 dark:border-stone-800 dark:bg-stone-900/60"
        />
      ))}
    </div>
  );
}

/**
 * @param {{ inquiries: import('@/shared/types/models').Inquiry[], isLoading?: boolean, error?: unknown, onRetry?: () => void }} props
 */
export default function InquiriesTable({
  inquiries = [],
  isLoading = false,
  error = null,
  onRetry,
}) {
  const { mutate: convert, isPending: isConverting } = useConvertInquiry();

  if (error) return <ErrorHandler error={error} onRetry={onRetry} />;
  if (isLoading) return <TableSkeleton />;

  if (!inquiries.length) {
    return (
      <EmptyState
        title="No inquiries yet"
        description="New leads from the public inquiry form will show up here."
      />
    );
  }

  function handleConvert(id) {
    convert(id, {
      onSuccess: () => toast.success("Marked as converted"),
      onError: (err) => toast.error(err?.message || "Update failed"),
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-transparent">
      <table className="min-w-full text-sm">
        <thead className="bg-stone-100 text-left text-xs uppercase tracking-[0.15em] text-stone-500 dark:bg-stone-900 dark:text-stone-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Agent</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr
              key={inquiry.id}
              className="border-t border-stone-200 bg-white text-stone-700 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-200"
            >
              <td className="px-4 py-4 font-medium text-stone-900 dark:text-stone-50">
                {inquiry.customer_name}
              </td>
              <td className="px-4 py-4 text-stone-500 dark:text-stone-400">
                {inquiry.customer_email}
              </td>
              <td className="px-4 py-4">
                {formatServiceType(inquiry.requested_service)}
              </td>
              <td className="px-4 py-4">
                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    inquiry.is_converted
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400",
                  ].join(" ")}
                >
                  {inquiry.is_converted ? "Converted" : "New"}
                </span>
              </td>
              <td className="px-4 py-4">
                <InquiryAssigner
                  inquiryId={inquiry.id}
                  currentAgentId={inquiry.assigned_agent_id}
                />
              </td>
              <td className="px-4 py-4 text-stone-500 dark:text-stone-400">
                {formatDate(inquiry.created_at)}
              </td>
              <td className="px-4 py-4 text-right">
                {!inquiry.is_converted ? (
                  <button
                    type="button"
                    disabled={isConverting}
                    onClick={() => handleConvert(inquiry.id)}
                    className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-amber-500 hover:text-amber-600 disabled:opacity-60 dark:border-stone-700 dark:text-stone-300 dark:hover:text-amber-300"
                  >
                    Mark converted
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
