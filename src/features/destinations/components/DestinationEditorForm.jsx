import { useState } from "react";
import {
  destinationFormToPayload,
  destinationToFormValues,
  slugify,
  validateDestinationForm,
} from "../utils/destinations.utils";

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
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-900/50 dark:focus:ring-red-900/30"
      : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:focus:ring-amber-900/30",
  ].join(" ");
}

export default function DestinationEditorForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save destination",
  saving = false,
  mode = "create",
}) {
  const [form, setForm] = useState(destinationToFormValues(initialValues));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const isEditMode = mode === "edit";

  function handleChange(event) {
    const { name, type, value, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSlugFromName() {
    setForm((current) => ({
      ...current,
      slug: slugify(current.name),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateDestinationForm(form);
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length) return;

    try {
      await onSubmit(destinationFormToPayload(form));
    } catch (error) {
      setServerError(error?.message || "Unable to save destination.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
          {serverError}
        </div>
      ) : null}

      <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
        {isEditMode
          ? "Update the Firestore document and keep the public page in sync."
          : "Create a new destination document in Firestore."}
      </div>

      <Section
        title="Destination basics"
        description="Set the identifying fields, region, and public-facing label."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InputRow label="Name" error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={baseInputClass(errors.name)}
              placeholder="Tsavo East National Park"
            />
          </InputRow>

          <InputRow
            label="Slug"
            error={errors.slug}
            hint="Used in the public URL, for example `tsavo-east`."
          >
            <div className="flex gap-3">
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className={baseInputClass(errors.slug)}
                placeholder="tsavo-east"
              />
              <button
                type="button"
                onClick={handleSlugFromName}
                className="shrink-0 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                Generate
              </button>
            </div>
          </InputRow>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <InputRow label="Tagline" error={errors.tagline}>
            <input
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              className={baseInputClass(errors.tagline)}
              placeholder="Red elephants & endless savanna"
            />
          </InputRow>

          <InputRow label="Region" error={errors.region}>
            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              className={baseInputClass(errors.region)}
            >
              <option value="coast">Coast</option>
              <option value="savanna">Savanna</option>
              <option value="mountain">Mountain</option>
              <option value="lake">Lake</option>
              <option value="urban">Urban</option>
              <option value="marine">Marine</option>
            </select>
          </InputRow>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-950">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <span>
            <span className="block text-sm font-semibold text-stone-900 dark:text-stone-50">
              Featured destination
            </span>
            <span className="block text-xs text-stone-500 dark:text-stone-400">
              Surface this destination on the home page and featured sections.
            </span>
          </span>
        </label>
      </Section>

      <Section
        title="Content and media"
        description="Describe the destination and provide image URLs."
      >
        <div className="space-y-5">
          <InputRow label="Hero image URL" error={errors.heroImage}>
            <input
              name="heroImage"
              value={form.heroImage}
              onChange={handleChange}
              className={baseInputClass(errors.heroImage)}
              placeholder="https://..."
            />
          </InputRow>

          <InputRow label="Description" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              className={baseInputClass(errors.description)}
              placeholder="Tell travelers what makes this destination special."
            />
          </InputRow>

          <InputRow
            label="Highlights"
            error={errors.highlightsText}
            hint="Separate items with commas or new lines."
          >
            <textarea
              name="highlightsText"
              value={form.highlightsText}
              onChange={handleChange}
              rows={4}
              className={baseInputClass(errors.highlightsText)}
              placeholder="Game drives, sunrise views, bush camp"
            />
          </InputRow>

          <InputRow
            label="Gallery image URLs"
            hint="Paste one or more gallery image URLs separated by commas or new lines."
          >
            <textarea
              name="galleryText"
              value={form.galleryText}
              onChange={handleChange}
              rows={4}
              className={baseInputClass()}
              placeholder="https://... , https://..."
            />
          </InputRow>

          <InputRow
            label="Tags"
            hint="Optional keywords for search and filtering."
          >
            <input
              name="tagsText"
              value={form.tagsText}
              onChange={handleChange}
              className={baseInputClass()}
              placeholder="wildlife, coast, safari"
            />
          </InputRow>
        </div>
      </Section>

      <Section
        title="Pricing and SEO"
        description="Optional price guidance and search metadata."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InputRow label="Starting price">
            <input
              name="priceFrom"
              type="number"
              min="0"
              value={form.priceFrom}
              onChange={handleChange}
              className={baseInputClass(errors.priceFrom)}
              placeholder="28000"
            />
            <FieldError error={errors.priceFrom} />
          </InputRow>

          <InputRow label="Currency">
            <input
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className={baseInputClass()}
              placeholder="KES"
            />
          </InputRow>
        </div>

        <div className="mt-5 grid gap-5">
          <InputRow label="SEO title" hint="Optional page title override.">
            <input
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              className={baseInputClass()}
              placeholder="Tsavo East National Park | Savanna Crown"
            />
          </InputRow>

          <InputRow label="SEO description" hint="Optional meta description.">
            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              rows={3}
              className={baseInputClass()}
              placeholder="Plan a memorable safari at Tsavo East..."
            />
          </InputRow>

          <InputRow
            label="SEO keywords"
            hint="Comma separated, for example safari, wildlife, Kenya."
          >
            <input
              name="seoKeywordsText"
              value={form.seoKeywordsText}
              onChange={handleChange}
              className={baseInputClass()}
              placeholder="safari, wildlife, Kenya"
            />
          </InputRow>
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
