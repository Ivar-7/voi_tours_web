import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { UserRole } from "@/shared/types/enums";
import { useAuth } from "@features/auth/hooks/useAuth";
import Modal from "@shared/components/ui/Modal";
import PackageEditorForm from "@features/packages/components/PackageEditorForm";
import PackagesTable from "../components/PackagesTable";
import {
  useAdminPackages,
  useCreatePackage,
  useDeletePackage,
  useTogglePackageActive,
  useUpdatePackage,
} from "../hooks/useAdminPackages";

export default function AdminPackagesPage() {
  const { user } = useAuth();
  const canManage = user?.role === UserRole.ADMIN;

  const [statusFilter, setStatusFilter] = useState("all");
  const [modalMode, setModalMode] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const filters = useMemo(() => {
    if (statusFilter === "active") return { is_active: true };
    if (statusFilter === "inactive") return { is_active: false };
    return {};
  }, [statusFilter]);

  const {
    data: packages = [],
    isLoading,
    error,
    refetch,
  } = useAdminPackages(filters);
  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();
  const toggleMutation = useTogglePackageActive();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openCreateModal() {
    setSelectedPackage(null);
    setModalMode("form");
  }

  function openEditModal(pkg) {
    setSelectedPackage(pkg);
    setModalMode("form");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedPackage(null);
    setDeleteTarget(null);
  }

  async function handleSubmit(payload) {
    if (selectedPackage) {
      await updateMutation.mutateAsync({ id: selectedPackage.id, payload });
      toast.success("Package updated");
    } else {
      await createMutation.mutateAsync(payload);
      toast.success("Package created");
    }
    closeModal();
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Package deleted");
      closeModal();
    } catch (err) {
      toast.error(err?.message || "Unable to delete package");
    }
  }

  async function handleToggleActive(pkg) {
    setTogglingId(pkg.id);
    try {
      await toggleMutation.mutateAsync({
        id: pkg.id,
        is_active: !pkg.is_active,
      });
      toast.success(
        pkg.is_active ? "Package deactivated" : "Package activated",
      );
    } catch (err) {
      toast.error(err?.message || "Unable to update package status");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            Inventory
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
            Safari packages
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Create, edit, and publish curated safari itineraries.
          </p>
        </div>

        {canManage ? (
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Create package
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setStatusFilter(option.value)}
            className={[
              "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
              statusFilter === option.value
                ? "bg-amber-500 text-stone-950"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>

      <PackagesTable
        packages={packages}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        canManage={canManage}
        onEdit={openEditModal}
        onDelete={(pkg) => {
          setDeleteTarget(pkg);
          setModalMode("delete");
        }}
        onToggleActive={handleToggleActive}
        togglingId={togglingId}
        emptyAction={
          canManage
            ? { label: "Create package", onClick: openCreateModal }
            : undefined
        }
      />

      <Modal
        isOpen={modalMode === "form"}
        onClose={closeModal}
        title={selectedPackage ? "Edit package" : "Create package"}
        size="xl"
      >
        <PackageEditorForm
          initialValues={selectedPackage}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          saving={isSaving}
          submitLabel={selectedPackage ? "Update package" : "Create package"}
        />
      </Modal>

      <Modal
        isOpen={modalMode === "delete"}
        onClose={closeModal}
        title="Delete package"
        size="sm"
      >
        <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
          Delete <span className="font-semibold">{deleteTarget?.title}</span>?
          This cannot be undone and will remove the package from the public
          site.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 dark:border-stone-700 dark:text-stone-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete package"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
