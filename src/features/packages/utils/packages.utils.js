import { PassengerTier, PricingSeason } from "@/shared/types/enums";
import { seasonOptions, tierOptions } from "../types/packages.types";

import {
  excerpt,
  formatCurrency,
  joinList,
  slugify,
  splitList,
} from "@features/destinations/utils/destinations.utils";

export { slugify, formatCurrency, excerpt, splitList, joinList };

export function formatDuration(days) {
  const value = Number(days);
  if (!value || Number.isNaN(value)) return "Duration TBC";

  const nights = Math.max(value - 1, 0);
  return `${value} Day${value === 1 ? "" : "s"} / ${nights} Night${nights === 1 ? "" : "s"}`;
}

export function formatTierLabel(tier) {
  return tierOptions.find((item) => item.value === tier)?.label || tier;
}

export function formatSeasonLabel(season) {
  return seasonOptions.find((item) => item.value === season)?.label || season;
}

export function getMinPrice(pricing = []) {
  if (!pricing.length) return null;

  const sorted = [...pricing].sort(
    (a, b) => Number(a.price_per_person) - Number(b.price_per_person),
  );

  return {
    price: Number(sorted[0].price_per_person),
    currency: sorted[0].currency || "KES",
  };
}

export function createEmptyItineraryRow(dayNumber = 1) {
  return {
    day_number: dayNumber,
    activity_title: "",
    activity_description: "",
    included_meals: "",
    accommodation_hint: "",
  };
}

export function createEmptyPricingGrid() {
  const grid = [];

  Object.values(PassengerTier).forEach((tier) => {
    Object.values(PricingSeason).forEach((season) => {
      grid.push({
        tier,
        season,
        price_per_person: "",
        currency: "KES",
      });
    });
  });

  return grid;
}

export function createEmptyPackageForm() {
  return {
    title: "",
    slug: "",
    description: "",
    duration_days: "3",
    hero_image: "",
    highlightsText: "",
    is_active: true,
    destinationIds: [],
    itinerary: [createEmptyItineraryRow(1)],
    pricing: createEmptyPricingGrid(),
  };
}

export function packageToFormValues(pkg) {
  if (!pkg) return createEmptyPackageForm();

  const pricingMap = new Map(
    (pkg.pricing || []).map((row) => [`${row.tier}:${row.season}`, row]),
  );

  const pricing = createEmptyPricingGrid().map((cell) => {
    const existing = pricingMap.get(`${cell.tier}:${cell.season}`);
    if (!existing) return cell;

    return {
      ...cell,
      price_per_person: existing.price_per_person ?? "",
      currency: existing.currency || "KES",
    };
  });

  return {
    title: pkg.title || "",
    slug: pkg.slug || "",
    description: pkg.description || "",
    duration_days: pkg.duration_days != null ? String(pkg.duration_days) : "3",
    hero_image: pkg.hero_image || "",
    highlightsText: joinList(pkg.highlights || []),
    is_active: pkg.is_active !== false,
    destinationIds: (pkg.destinations || []).map((item) => item.destination_id),
    itinerary: (pkg.itinerary || []).length
      ? pkg.itinerary.map((row, index) => ({
          day_number: row.day_number ?? index + 1,
          activity_title: row.activity_title || "",
          activity_description: row.activity_description || "",
          included_meals: row.included_meals || "",
          accommodation_hint: row.accommodation_hint || "",
        }))
      : [createEmptyItineraryRow(1)],
    pricing,
  };
}

export function packageFormToPayload(form, destinationLookup = new Map()) {
  const highlights = splitList(form.highlightsText);
  const durationDays = Number(form.duration_days);

  const destinations = (form.destinationIds || []).map(
    (destinationId, index) => ({
      destination_id: destinationId,
      name: destinationLookup.get(destinationId)?.name || "",
      stop_order: index + 1,
    }),
  );

  const itinerary = (form.itinerary || [])
    .map((row, index) => ({
      day_number: Number(row.day_number) || index + 1,
      activity_title: row.activity_title?.trim() || "",
      activity_description: row.activity_description?.trim() || "",
      included_meals: row.included_meals?.trim() || null,
      accommodation_hint: row.accommodation_hint?.trim() || null,
    }))
    .filter((row) => row.activity_title || row.activity_description);

  const pricing = (form.pricing || [])
    .filter(
      (row) => row.price_per_person !== "" && row.price_per_person != null,
    )
    .map((row) => ({
      tier: row.tier,
      season: row.season,
      price_per_person: Number(row.price_per_person),
      currency: row.currency || "KES",
    }));

  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    duration_days: Number.isNaN(durationDays) ? 1 : durationDays,
    hero_image: form.hero_image.trim(),
    highlights,
    is_active: Boolean(form.is_active),
    destinations,
    itinerary,
    pricing,
  };
}

export function validatePackageForm(form) {
  const errors = {};

  if (!form.title?.trim()) errors.title = "Title is required.";
  if (!form.slug?.trim()) errors.slug = "Slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug || "")) {
    errors.slug = "Slug must be lowercase letters, numbers, and hyphens only.";
  }
  if (!form.description?.trim())
    errors.description = "Description is required.";

  const duration = Number(form.duration_days);
  if (!duration || Number.isNaN(duration) || duration < 1) {
    errors.duration_days = "Duration must be at least 1 day.";
  }

  if (!form.hero_image?.trim())
    errors.hero_image = "Hero image URL is required.";

  const hasPricing = (form.pricing || []).some(
    (row) => row.price_per_person !== "" && row.price_per_person != null,
  );
  if (!hasPricing) errors.pricing = "Add at least one pricing cell.";

  return errors;
}
