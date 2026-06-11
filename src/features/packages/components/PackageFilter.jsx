import { seasonOptions } from "../types/packages.types";

const durationOptions = [
  { value: "", label: "Any duration" },
  { value: "1-3", label: "1–3 days" },
  { value: "4-5", label: "4–5 days" },
  { value: "6+", label: "6+ days" },
];

export default function PackageFilter({
  filters,
  onChange,
  destinations = [],
}) {
  function update(partial) {
    onChange({ ...filters, ...partial });
  }

  function handleDurationChange(value) {
    if (!value) {
      update({ duration_min: undefined, duration_max: undefined });
      return;
    }

    if (value === "1-3") update({ duration_min: 1, duration_max: 3 });
    if (value === "4-5") update({ duration_min: 4, duration_max: 5 });
    if (value === "6+") update({ duration_min: 6, duration_max: undefined });
  }

  const durationValue =
    filters.duration_min === 1 && filters.duration_max === 3
      ? "1-3"
      : filters.duration_min === 4 && filters.duration_max === 5
        ? "4-5"
        : filters.duration_min === 6 && !filters.duration_max
          ? "6+"
          : "";

  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
        Filter packages
      </p>

      <div className="mt-5 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
            Destination
          </span>
          <select
            value={filters.destination || ""}
            onChange={(event) =>
              update({ destination: event.target.value || undefined })
            }
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-950 dark:focus:ring-amber-900/30"
          >
            <option value="">All destinations</option>
            {destinations.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
            Duration
          </span>
          <select
            value={durationValue}
            onChange={(event) => handleDurationChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-950 dark:focus:ring-amber-900/30"
          >
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
            Season
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update({ season: undefined })}
              className={[
                "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                !filters.season
                  ? "bg-amber-500 text-stone-950"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700",
              ].join(" ")}
            >
              Any
            </button>
            {seasonOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ season: option.value })}
                className={[
                  "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                  filters.season === option.value
                    ? "bg-amber-500 text-stone-950"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange({})}
          className="w-full rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
