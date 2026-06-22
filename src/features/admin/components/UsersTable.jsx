import toast from "react-hot-toast";
import EmptyState from "@shared/components/feedback/EmptyState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import { formatDate, formatPassengerTier } from "@shared/utils";
import { UserRole } from "@shared/types/enums";
import { useUpdateUserAccess } from "../hooks/useAdminUsers";

const ROLE_OPTIONS = Object.values(UserRole);

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

/**
 * @param {{ users: import('@/shared/types/models').User[], isLoading?: boolean, error?: unknown, onRetry?: () => void, canManage?: boolean }} props
 */
export default function UsersTable({
  users = [],
  isLoading = false,
  error = null,
  onRetry,
  canManage = false,
}) {
  const { mutate, isPending } = useUpdateUserAccess();

  if (error) return <ErrorHandler error={error} onRetry={onRetry} />;
  if (isLoading) return <TableSkeleton />;

  if (!users.length) {
    return (
      <EmptyState
        title="No users yet"
        description="Registered customers will show up here."
      />
    );
  }

  function handleRoleChange(uid, role) {
    mutate(
      { uid, payload: { role } },
      {
        onSuccess: () => toast.success("Role updated"),
        onError: (err) => toast.error(err?.message || "Update failed"),
      },
    );
  }

  function handleToggleActive(user) {
    mutate(
      { uid: user.id, payload: { is_active: !user.is_active } },
      {
        onSuccess: () =>
          toast.success(user.is_active ? "User deactivated" : "User activated"),
        onError: (err) => toast.error(err?.message || "Update failed"),
      },
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-800">
      <table className="min-w-full text-sm">
        <thead className="bg-stone-900 text-left text-xs uppercase tracking-[0.15em] text-stone-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Tier</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t border-stone-800 bg-stone-950/40 text-stone-200"
            >
              <td className="px-4 py-4 font-medium text-stone-50">
                {user.full_name || "—"}
              </td>
              <td className="px-4 py-4 text-stone-400">{user.email}</td>
              <td className="px-4 py-4 text-stone-400">{user.phone || "—"}</td>
              <td className="px-4 py-4">{formatPassengerTier(user.tier)}</td>
              <td className="px-4 py-4">
                {canManage ? (
                  <select
                    value={user.role}
                    disabled={isPending}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="rounded-full border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-stone-200 transition-colors hover:border-amber-500 disabled:opacity-60"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="rounded-full bg-stone-800 px-3 py-1 text-xs font-semibold text-stone-300">
                    {user.role}
                  </span>
                )}
              </td>
              <td className="px-4 py-4">
                {canManage ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggleActive(user)}
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                      user.is_active
                        ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                        : "bg-stone-800 text-stone-400 hover:bg-stone-700",
                    ].join(" ")}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </button>
                ) : (
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      user.is_active
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-stone-800 text-stone-400",
                    ].join(" ")}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-stone-400">
                {formatDate(user.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
