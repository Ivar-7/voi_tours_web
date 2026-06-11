import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useDestinations } from "@features/destinations/hooks/useDestinations";
import { seasonOptions, tierOptions } from "../types/packages.types";
import {
  createEmptyItineraryRow,
  packageFormToPayload,
  packageToFormValues,
  slugify,
  validatePackageForm,
} from "../utils/packages.utils";

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{error}</p>;
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-5">
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function InputRow({ label, children, hint, error }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          {hint}
        </p>
      ) : null}
      <FieldError error={error} />
    </label>
  );
}

function baseInputClass(hasError = false) {
  return [
    "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors",
    "bg-stone-50 text-stone-900 placeholder:text-stone-400",
    "dark:bg-stone-950 dark:text-stone-50 dark:placeholder:text-stone-500",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:focus:ring-amber-900/30",
  ].join(" ");
}

export default function PackageEditorForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save package",
  saving = false,
}) {
  const [form, setForm] = useState(packageToFormValues(initialValues));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { data: destinations = [] } = useDestinations();

  const destinationLookup = useMemo(
    () => new Map(destinations.map((item) => [item.id, item])),
    [destinations],
  );

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSlugFromTitle() {
    setForm((current) => ({
      ...current,
      slug: slugify(current.title),
    }));
  }

  function toggleDestination(destinationId) {
    setForm((current) => {
      const exists = current.destinationIds.includes(destinationId);
      return {
        ...current,
        destinationIds: exists
          ? current.destinationIds.filter((id) => id !== destinationId)
          : [...current.destinationIds, destinationId],
      };
    });
  }

  function updateItineraryRow(index, field, value) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  }

  function addItineraryRow() {
    setForm((current) => ({
      ...current,
      itinerary: [
        ...current.itinerary,
        createEmptyItineraryRow(current.itinerary.length + 1),
      ],
    }));
  }

  function removeItineraryRow(index) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.filter((_, rowIndex) => rowIndex !== index),
    }));
  }

  function updatePricingCell(index, field, value) {
    setForm((current) => ({
      ...current,
      pricing: current.pricing.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validatePackageForm(form);
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length) return;

    try {
      await onSubmit(packageFormToPayload(form, destinationLookup));
    } catch (error) {
      setServerError(error?.message || "Unable to save package.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
          {serverError}
        </div>
      ) : null}

      <Section
        title="Package basics"
        description="Core details shown on browse cards and the detail hero."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InputRow label="Title" error={errors.title}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={baseInputClass(Boolean(errors.title))}
              placeholder="3-Day Tsavo Safari"
            />
          </InputRow>

          <InputRow
            label="Slug"
            error={errors.slug}
            hint="Used in /packages/:slug URLs."
          >
            <div className="flex gap-2">
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className={baseInputClass(Boolean(errors.slug))}
                placeholder="3-day-tsavo-safari"
              />
              <button
                type="button"
                onClick={handleSlugFromTitle}
                className="shrink-0 rounded-2xl border border-stone-200 px-4 py-3 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                Generate
              </button>
            </div>
          </InputRow>

          <InputRow label="Duration (days)" error={errors.duration_days}>
            <input
              name="duration_days"
              type="number"
              min="1"
              value={form.duration_days}
              onChange={handleChange}
              className={baseInputClass(Boolean(errors.duration_days))}
            />
          </InputRow>

          <InputRow label="Hero image URL" error={errors.hero_image}>
            <input
              name="hero_image"
              value={form.hero_image}
              onChange={handleChange}
              className={baseInputClass(Boolean(errors.hero_image))}
              placeholder="https://..."
            />
          </InputRow>
        </div>

        <div className="mt-5 space-y-5">
          <InputRow label="Description" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className={baseInputClass(Boolean(errors.description))}
            />
          </InputRow>

          <InputRow
            label="Highlights"
            hint="Comma-separated list shown on cards."
          >
            <input
              name="highlightsText"
              value={form.highlightsText}
              onChange={handleChange}
              className={baseInputClass()}
              placeholder="Game drives, Bush camp, Mzima Springs"
            />
          </InputRow>

          <label className="inline-flex items-center gap-3">
            <input
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
              Package is active and visible to customers
            </span>
          </label>
        </div>
      </Section>

      <Section
        title="Destinations"
        description="Select stops included in this itinerary."
      >
        <div className="flex flex-wrap gap-2">
          {destinations.map((destination) => {
            const selected = form.destinationIds.includes(destination.id);
            return (
              <button
                key={destination.id}
                type="button"
                onClick={() => toggleDestination(destination.id)}
                className={[
                  "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                  selected
                    ? "bg-amber-500 text-stone-950"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300",
                ].join(" ")}
              >
                {destination.name}
              </button>
            );
          })}
          {!destinations.length ? (
            <p className="text-sm text-stone-500">
              No destinations available yet.
            </p>
          ) : null}
        </div>
      </Section>

      <Section
        title="Itinerary"
        description="Day-by-day activities for the detail page."
      >
        <div className="space-y-4">
          {form.itinerary.map((row, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                  Day {row.day_number || index + 1}
                </p>
                {form.itinerary.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeItineraryRow(index)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputRow label="Activity title">
                  <input
                    value={row.activity_title}
                    onChange={(event) =>
                      updateItineraryRow(
                        index,
                        "activity_title",
                        event.target.value,
                      )
                    }
                    className={baseInputClass()}
                  />
                </InputRow>
                <InputRow label="Meals included">
                  <input
                    value={row.included_meals}
                    onChange={(event) =>
                      updateItineraryRow(
                        index,
                        "included_meals",
                        event.target.value,
                      )
                    }
                    className={baseInputClass()}
                    placeholder="B, L, D"
                  />
                </InputRow>
              </div>

              <div className="mt-4 space-y-4">
                <InputRow label="Activity description">
                  <textarea
                    value={row.activity_description}
                    onChange={(event) =>
                      updateItineraryRow(
                        index,
                        "activity_description",
                        event.target.value,
                      )
                    }
                    rows={3}
                    className={baseInputClass()}
                  />
                </InputRow>
                <InputRow label="Accommodation hint">
                  <input
                    value={row.accommodation_hint}
                    onChange={(event) =>
                      updateItineraryRow(
                        index,
                        "accommodation_hint",
                        event.target.value,
                      )
                    }
                    className={baseInputClass()}
                    placeholder="Bush camp near Tsavo East"
                  />
                </InputRow>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItineraryRow}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add day
          </button>
        </div>
      </Section>

      <Section
        title="Pricing matrix"
        description="Set per-person rates for each passenger tier and season."
      >
        <FieldError error={errors.pricing} />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.15em] text-stone-500">
                <th className="px-2 py-2">Tier</th>
                <th className="px-2 py-2">Season</th>
                <th className="px-2 py-2">Price</th>
                <th className="px-2 py-2">Currency</th>
              </tr>
            </thead>
            <tbody>
              {form.pricing.map((row, index) => (
                <tr key={`${row.tier}-${row.season}`}>
                  <td className="px-2 py-2 font-medium text-stone-800 dark:text-stone-100">
                    {tierOptions.find((item) => item.value === row.tier)?.label}
                  </td>
                  <td className="px-2 py-2 text-stone-600 dark:text-stone-300">
                    {
                      seasonOptions.find((item) => item.value === row.season)
                        ?.label
                    }
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min="0"
                      value={row.price_per_person}
                      onChange={(event) =>
                        updatePricingCell(
                          index,
                          "price_per_person",
                          event.target.value,
                        )
                      }
                      className={baseInputClass()}
                      placeholder="28000"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      value={row.currency}
                      onChange={(event) =>
                        updatePricingCell(index, "currency", event.target.value)
                      }
                      className={baseInputClass()}
                      placeholder="KES"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="flex flex-wrap justify-end gap-3">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
