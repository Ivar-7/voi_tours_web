import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatDuration } from "../utils/packages.utils";

export default function PackageItinerary({ itinerary = [], durationDays }) {
  const [openDay, setOpenDay] = useState(itinerary[0]?.day_number ?? 1);
  const sorted = [...itinerary].sort((a, b) => a.day_number - b.day_number);

  if (!sorted.length) {
    return (
      <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
          Itinerary
        </h2>
        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
          The day-by-day itinerary for this package will be published soon.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Day by day
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
            Your safari itinerary
          </h2>
        </div>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
          {formatDuration(durationDays)}
        </p>
      </div>

      <div className="space-y-3">
        {sorted.map((day) => {
          const isOpen = openDay === day.day_number;

          return (
            <div
              key={day.id || day.day_number}
              className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800"
            >
              <button
                type="button"
                onClick={() => setOpenDay(isOpen ? null : day.day_number)}
                className="flex w-full items-center justify-between gap-4 bg-stone-50 px-5 py-4 text-left transition-colors hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-900"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                    Day {day.day_number}
                  </p>
                  <p className="mt-1 font-semibold text-stone-900 dark:text-stone-50">
                    {day.activity_title}
                  </p>
                </div>
                <ChevronDown
                  className={[
                    "h-5 w-5 text-stone-500 transition-transform",
                    isOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              {isOpen ? (
                <div className="space-y-4 border-t border-stone-200 px-5 py-4 dark:border-stone-800">
                  <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">
                    {day.activity_description}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {day.included_meals ? (
                      <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-950">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                          Meals
                        </p>
                        <p className="mt-1 text-sm font-medium text-stone-800 dark:text-stone-100">
                          {day.included_meals}
                        </p>
                      </div>
                    ) : null}
                    {day.accommodation_hint ? (
                      <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-950">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                          Stay
                        </p>
                        <p className="mt-1 text-sm font-medium text-stone-800 dark:text-stone-100">
                          {day.accommodation_hint}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
