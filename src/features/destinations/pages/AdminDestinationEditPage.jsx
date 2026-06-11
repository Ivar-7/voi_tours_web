import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import DestinationEditorForm from "../components/DestinationEditorForm";
import LoadingState from "@shared/components/feedback/LoadingState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import { useDestinationById } from "../hooks/useDestinationById";
import { useUpdateDestination } from "../hooks/useDestinationMutations";

export default function AdminDestinationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destinationQuery = useDestinationById(id);
  const updateMutation = useUpdateDestination();

  async function handleSubmit(payload) {
    await updateMutation.mutateAsync({ id, payload });
    toast.success("Destination updated.");
    navigate(`/admin/destinations/${id}`);
  }

  if (destinationQuery.isLoading) {
    return <LoadingState message="Loading destination..." />;
  }

  if (destinationQuery.error) {
    return <ErrorHandler error={destinationQuery.error} />;
  }

  if (!destinationQuery.data) {
    return <ErrorHandler error={new Error("Destination not found.")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
            Edit destination
          </h1>
        </div>
        <Link
          to={`/admin/destinations/${id}`}
          className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          View details
        </Link>
      </div>

      <DestinationEditorForm
        initialValues={destinationQuery.data}
        mode="edit"
        submitLabel="Save changes"
        saving={updateMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/destinations/${id}`)}
      />
    </div>
  );
}
