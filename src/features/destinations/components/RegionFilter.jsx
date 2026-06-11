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
                ? "border-amber-500 bg-amber-500 text-stone-950"
                : "border-stone-800 bg-stone-900 text-stone-300 hover:border-amber-500 hover:text-amber-300",
            ].join(" ")}
          >
            {region === "all" ? "All" : formatRegionLabel(region)}
          </button>
        );
      })}
    </div>
  );
}
