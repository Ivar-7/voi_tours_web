import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Pencil, Star, Trash2 } from "lucide-react";

import DestinationHero from "../components/DestinationHero";
import DestinationGallery from "../components/DestinationGallery";
import LoadingState from "@shared/components/feedback/LoadingState";
import ErrorHandler from "@shared/components/feedback/ErrorHandler";
import EmptyState from "@shared/components/feedback/EmptyState";
import { useDestinationById } from "../hooks/useDestinationById";
import {
  useDeleteDestination,
  useToggleFeatured,
} from "../hooks/useDestinationMutations";
import { formatCurrency, formatRegionLabel } from "../utils/destinations.utils";

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-stone-900 dark:text-stone-50">
        {value}
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminDestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destinationQuery = useDestinationById(id);
  const deleteMutation = useDeleteDestination();
  const toggleFeaturedMutation = useToggleFeatured();

  async function handleDelete() {
    const destination = destinationQuery.data;
    if (!destination) return;

    const confirmed = window.confirm(
      `Delete "${destination.name}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(destination.id);
      toast.success("Destination deleted.");
      navigate("/admin/destinations");
    } catch (error) {
      toast.error(error?.message || "Could not delete destination.");
    }
  }

  async function handleToggleFeatured() {
    const destination = destinationQuery.data;
    if (!destination) return;

    try {
      await toggleFeaturedMutation.mutateAsync({
        id: destination.id,
        featured: !destination.featured,
      });
      toast.success(
        destination.featured
          ? "Removed from featured list."
          : "Marked as featured.",
      );
    } catch (error) {
      toast.error(error?.message || "Could not update featured status.");
    }
  }

  if (destinationQuery.isLoading) {
    return <LoadingState message="Loading destination details..." />;
  }

  if (destinationQuery.error) {
    return <ErrorHandler error={destinationQuery.error} />;
  }

  if (!destinationQuery.data) {
    return (
      <EmptyState
        title="Destination not found"
        description="The destination ID does not exist in Firestore."
        action={{
          label: "Back to destinations",
          onClick: () => navigate("/admin/destinations"),
        }}
      />
    );
  }

  const destination = destinationQuery.data;
  const price = formatCurrency(destination.priceFrom, destination.currency);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/admin/destinations"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/destinations/${destination.slug}`}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Public page
          </Link>
          <button
            type="button"
            onClick={handleToggleFeatured}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <Star className="h-4 w-4" />
            {destination.featured ? "Unfeature" : "Feature"}
          </button>
          <Link
            to={`/admin/destinations/${destination.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:bg-stone-900 dark:text-red-200 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <DestinationHero destination={destination} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
            Firestore record
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Document ID" value={destination.id} />
            <InfoRow label="Slug" value={destination.slug} />
            <InfoRow
              label="Region"
              value={formatRegionLabel(destination.region)}
            />
            <InfoRow label="Starting price" value={price || "N/A"} />
            <InfoRow
              label="Featured"
              value={destination.featured ? "Yes" : "No"}
            />
            <InfoRow label="Currency" value={destination.currency || "KES"} />
            <InfoRow
              label="Created at"
              value={formatDate(destination.createdAt)}
            />
            <InfoRow
              label="Updated at"
              value={formatDate(destination.updatedAt)}
            />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
            Metadata
          </h2>
          <div className="mt-5 space-y-4">
            <InfoRow
              label="Created by"
              value={destination.createdBy || "N/A"}
            />
            <InfoRow
              label="Updated by"
              value={destination.updatedBy || "N/A"}
            />
            <InfoRow
              label="Highlights"
              value={(destination.highlights || []).join(", ") || "N/A"}
            />
            <InfoRow
              label="Tags"
              value={(destination.tags || []).join(", ") || "N/A"}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
            SEO
          </h2>
          <div className="mt-5 space-y-4">
            <InfoRow label="Title" value={destination.seo?.title || "N/A"} />
            <InfoRow
              label="Description"
              value={destination.seo?.description || "N/A"}
            />
            <InfoRow
              label="Keywords"
              value={(destination.seo?.keywords || []).join(", ") || "N/A"}
            />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
            Gallery
          </h2>
          <div className="mt-5">
            <DestinationGallery
              images={
                destination.gallery?.length
                  ? destination.gallery
                  : [destination.heroImage]
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
