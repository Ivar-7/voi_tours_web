import { useState } from "react";
import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Pagination from "@shared/components/ui/Pagination";
import { usePagination, useDebounce } from "@shared/hooks";
import { UserRole } from "@shared/types/enums";
import { useAuth } from "@features/auth/hooks/useAuth";
import UsersTable from "../components/UsersTable";
import { useAdminUsers } from "../hooks/useAdminUsers";

const PAGE_SIZE = 10;

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  ...Object.values(UserRole).map((r) => ({ value: r, label: r })),
];

export default function AdminUsersPage() {
  const { user } = useAuth();
  const canManage = user?.role === UserRole.ADMIN;

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const filters = {
    ...(role ? { role } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  };

  const { data, isLoading, error, refetch } = useAdminUsers(filters);
  const users = data?.data ?? [];

  const { page, totalPages, goTo } = usePagination({
    totalItems: users.length,
    pageSize: PAGE_SIZE,
  });
  const pageItems = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
          Accounts
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
          Users
        </h1>
        {!canManage ? (
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Read-only — only admins can change roles or deactivate accounts.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="w-64">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            options={ROLE_OPTIONS}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
      </div>

      <UsersTable
        users={pageItems}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        canManage={canManage}
      />

      {totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />
      ) : null}
    </div>
  );
}
