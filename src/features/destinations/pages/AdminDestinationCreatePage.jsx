import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import DestinationEditorForm from "../components/DestinationEditorForm";
import { useCreateDestination } from "../hooks/useDestinationMutations";
import { createEmptyDestinationForm } from "../utils/destinations.utils";

export default function AdminDestinationCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateDestination();

  async function handleSubmit(payload) {
    const created = await createMutation.mutateAsync(payload);
    toast.success("Destination created.");
    navigate(`/admin/destinations/${created.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
            Create destination
          </h1>
        </div>
        <Link
          to="/admin/destinations"
          className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          Back to list
        </Link>
      </div>

      <DestinationEditorForm
        initialValues={createEmptyDestinationForm()}
        mode="create"
        submitLabel="Create destination"
        saving={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/destinations")}
      />
    </div>
  );
}
