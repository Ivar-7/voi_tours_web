import { PassengerTier, PricingSeason } from "@/shared/types/enums";
import { useAuth } from "@features/auth/hooks/useAuth";
import { usePackagePricing } from "../hooks/usePackagePricing";
import {
  formatCurrency,
  formatSeasonLabel,
  formatTierLabel,
} from "../utils/packages.utils";

const tiers = Object.values(PassengerTier);
const seasons = Object.values(PricingSeason);

export default function PackagePricingTable({
  pricing = [],
  selectedTier,
  selectedSeason = PricingSeason.REGULAR,
}) {
  const { user } = useAuth();
  const activeTier = selectedTier || user?.tier || PassengerTier.INTERNATIONAL;
  const highlighted = usePackagePricing(pricing, activeTier, selectedSeason);

  return (
    <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
          Pricing matrix
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
          Per-person rates by tier & season
        </h2>
        {highlighted.price ? (
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
            Your estimated rate ({formatTierLabel(activeTier)},{" "}
            {formatSeasonLabel(selectedSeason)}):{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-50">
              {formatCurrency(highlighted.price, highlighted.currency)}
            </span>
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="rounded-tl-2xl bg-stone-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:bg-stone-950 dark:text-stone-400">
                Tier
              </th>
              {seasons.map((season, index) => (
                <th
                  key={season}
                  className={[
                    "bg-stone-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:bg-stone-950 dark:text-stone-400",
                    index === seasons.length - 1 ? "rounded-tr-2xl" : "",
                  ].join(" ")}
                >
                  {formatSeasonLabel(season)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, rowIndex) => (
              <tr key={tier}>
                <td className="border-t border-stone-200 px-4 py-4 font-semibold text-stone-800 dark:border-stone-800 dark:text-stone-100">
                  {formatTierLabel(tier)}
                </td>
                {seasons.map((season) => {
                  const cell = pricing.find(
                    (row) => row.tier === tier && row.season === season,
                  );
                  const isHighlighted =
                    tier === activeTier && season === selectedSeason;

                  return (
                    <td
                      key={`${tier}-${season}`}
                      className={[
                        "border-t border-stone-200 px-4 py-4 dark:border-stone-800",
                        isHighlighted
                          ? "bg-amber-50 font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
                          : "text-stone-600 dark:text-stone-300",
                        rowIndex === tiers.length - 1 ? "rounded-b-2xl" : "",
                      ].join(" ")}
                    >
                      {cell
                        ? formatCurrency(cell.price_per_person, cell.currency)
                        : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
