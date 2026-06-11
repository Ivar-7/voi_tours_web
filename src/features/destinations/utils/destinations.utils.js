import { DestinationRegion } from "../types/destinations.types";

export const destinationRegionOptions = Object.values(DestinationRegion).map(
  (value) => ({
    value,
    label: formatRegionLabel(value),
  }),
);

export function formatRegionLabel(region) {
  switch (region) {
    case DestinationRegion.COAST:
      return "Coast";
    case DestinationRegion.SAVANNA:
      return "Savanna";
    case DestinationRegion.MOUNTAIN:
      return "Mountain";
    case DestinationRegion.LAKE:
      return "Lake";
    case DestinationRegion.URBAN:
      return "Urban";
    case DestinationRegion.MARINE:
      return "Marine";
    default:
      return region
        ? region.charAt(0).toUpperCase() + region.slice(1)
        : "Unknown";
  }
}

export function formatCurrency(amount, currency = "KES") {
  if (amount === null || amount === undefined || amount === "") return null;

  const value = Number(amount);
  if (Number.isNaN(value)) return null;

  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  }
}

export function excerpt(text, maxLength = 160) {
  if (!text) return "";

  const plain = String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}...`;
}

export function splitList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) return [];

  return String(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinList(values = []) {
  return Array.isArray(values) ? values.join(", ") : "";
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function destinationToFormValues(destination) {
  if (!destination) {
    return createEmptyDestinationForm();
  }

  return {
    slug: destination.slug || "",
    name: destination.name || "",
    tagline: destination.tagline || "",
    description: destination.description || "",
    region: destination.region || DestinationRegion.COAST,
    heroImage: destination.heroImage || "",
    galleryText: joinList(destination.gallery || []),
    highlightsText: joinList(destination.highlights || []),
    tagsText: joinList(destination.tags || []),
    featured: Boolean(destination.featured),
    priceFrom: destination.priceFrom ?? "",
    currency: destination.currency || "KES",
    seoTitle: destination.seo?.title || "",
    seoDescription: destination.seo?.description || "",
    seoKeywordsText: joinList(destination.seo?.keywords || []),
  };
}

export function createEmptyDestinationForm() {
  return {
    slug: "",
    name: "",
    tagline: "",
    description: "",
    region: DestinationRegion.COAST,
    heroImage: "",
    galleryText: "",
    highlightsText: "",
    tagsText: "",
    featured: false,
    priceFrom: "",
    currency: "KES",
    seoTitle: "",
    seoDescription: "",
    seoKeywordsText: "",
  };
}

export function destinationFormToPayload(form) {
  const priceFrom = form.priceFrom === "" ? undefined : Number(form.priceFrom);
  const seoKeywords = splitList(form.seoKeywordsText);
  const seoTitle = form.seoTitle.trim();
  const seoDescription = form.seoDescription.trim();
  const seo = {};

  if (seoTitle) seo.title = seoTitle;
  if (seoDescription) seo.description = seoDescription;
  if (seoKeywords.length) seo.keywords = seoKeywords;

  const payload = {
    slug: form.slug.trim(),
    name: form.name.trim(),
    tagline: form.tagline.trim(),
    description: form.description.trim(),
    region: form.region,
    heroImage: form.heroImage.trim(),
    gallery: splitList(form.galleryText),
    highlights: splitList(form.highlightsText),
    tags: splitList(form.tagsText),
    featured: Boolean(form.featured),
    currency: form.currency.trim() || "KES",
  };

  if (Number.isFinite(priceFrom)) {
    payload.priceFrom = priceFrom;
  }

  if (Object.keys(seo).length) {
    payload.seo = seo;
  }

  return payload;
}

export function validateDestinationForm(form) {
  const errors = {};

  if (!form.slug.trim()) errors.slug = "Slug is required.";
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.tagline.trim()) errors.tagline = "Tagline is required.";
  if (!form.description.trim()) errors.description = "Description is required.";
  if (!form.region) errors.region = "Region is required.";
  if (!form.heroImage.trim()) errors.heroImage = "Hero image URL is required.";
  if (splitList(form.highlightsText).length === 0) {
    errors.highlightsText = "Add at least one highlight.";
  }
  if (form.priceFrom !== "" && Number.isNaN(Number(form.priceFrom))) {
    errors.priceFrom = "Price must be a valid number.";
  }

  return errors;
}
