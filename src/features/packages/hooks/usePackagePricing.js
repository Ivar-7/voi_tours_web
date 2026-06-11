import { useMemo } from "react";

/**
 * Derives package price for the given tier and season.
 *
 * @param {import('@/shared/types/models').PackagePricing[]} [pricing]
 * @param {string} [tier]
 * @param {string} [season]
 * @returns {{ price: number | null, currency: string }}
 */
export function usePackagePricing(pricing, tier, season) {
  return useMemo(() => {
    if (!pricing || !tier || !season) {
      return { price: null, currency: "KES" };
    }

    const row = pricing.find(
      (p) =>
        p.tier.toLowerCase() === tier.toLowerCase() &&
        p.season.toLowerCase() === season.toLowerCase(),
    );

    return {
      price: row ? row.price_per_person : null,
      currency: row ? row.currency : "KES",
    };
  }, [pricing, tier, season]);
}
