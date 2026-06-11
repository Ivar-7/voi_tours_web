import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import EmptyState from "@shared/components/feedback/EmptyState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import {
  formatCurrency,
  formatDuration,
  getMinPrice,
} from "@features/packages/utils/packages.utils";

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-800">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse border-b border-stone-800 bg-stone-900/60 last:border-b-0"
        />
      ))}
    </div>
  );
}

export default function PackagesTable({
  packages = [],
  isLoading = false,
  error = null,
  onRetry,
  canManage = false,
  onEdit,
  onDelete,
  onToggleActive,
  togglingId = null,
  emptyAction,
}) {
  if (error) {
    return <ErrorHandler error={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!packages.length) {
    return (
      <EmptyState
        title="No packages yet"
        description="Create your first safari package to make it available on the public site."
        action={emptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-800">
      <table className="min-w-full text-sm">
        <thead className="bg-stone-900 text-left text-xs uppercase tracking-[0.15em] text-stone-400">
          <tr>
            <th className="px-4 py-3">Package</th>
            <th className="px-4 py-3">Destinations</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => {
            const minPrice = getMinPrice(pkg.pricing);
            const priceLabel = minPrice
              ? formatCurrency(minPrice.price, minPrice.currency)
              : "—";

            return (
              <tr
                key={pkg.id}
                className="border-t border-stone-800 bg-stone-950/40 text-stone-200"
              >
                <td className="px-4 py-4">
                  <p className="font-semibold text-stone-50">{pkg.title}</p>
                  <p className="mt-1 text-xs text-stone-500">/{pkg.slug}</p>
                </td>
                <td className="px-4 py-4 text-stone-400">
                  {(pkg.destinations || []).length
                    ? pkg.destinations
                        .map((stop) => stop.name || stop.destination_id)
                        .join(", ")
                    : "—"}
                </td>
                <td className="px-4 py-4">
                  {formatDuration(pkg.duration_days)}
                </td>
                <td className="px-4 py-4">{priceLabel}</td>
                <td className="px-4 py-4">
                  {canManage ? (
                    <button
                      type="button"
                      disabled={togglingId === pkg.id}
                      onClick={() => onToggleActive?.(pkg)}
                      className={[
                        "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                        pkg.is_active
                          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          : "bg-stone-800 text-stone-400 hover:bg-stone-700",
                      ].join(" ")}
                    >
                      {togglingId === pkg.id
                        ? "Saving..."
                        : pkg.is_active
                          ? "Active"
                          : "Inactive"}
                    </button>
                  ) : (
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        pkg.is_active
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-stone-800 text-stone-400",
                      ].join(" ")}
                    >
                      {pkg.is_active ? "Active" : "Inactive"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/packages/${pkg.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-stone-300 transition-colors hover:border-amber-500 hover:text-amber-300"
                      title="View by ID"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/packages/${pkg.slug}`}
                      className="rounded-full border border-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-300 transition-colors hover:border-amber-500 hover:text-amber-300"
                    >
                      Public
                    </Link>
                    {canManage ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit?.(pkg)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-stone-300 transition-colors hover:border-amber-500 hover:text-amber-300"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(pkg)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-900/50 text-red-300 transition-colors hover:border-red-500 hover:bg-red-950/30"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
