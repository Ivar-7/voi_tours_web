import { formatRegionLabel } from "../utils/destinations.utils";

export default function RegionFilter({
  regions = [],
  active = "all",
  onChange,
}) {
  const items = ["all", ...regions];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((region) => {
        const isActive = region === active;

        return (
          <button
            key={region}
            type="button"
            onClick={() => onChange?.(region)}
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "border-stone-950 bg-stone-950 text-white shadow-lg shadow-stone-900/10 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-950"
                : "border-stone-200 bg-white text-stone-600 hover:border-amber-400 hover:text-stone-950 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:text-white",
            ].join(" ")}
          >
            {region === "all" ? "All" : formatRegionLabel(region)}
          </button>
        );
      })}
    </div>
  );
}
