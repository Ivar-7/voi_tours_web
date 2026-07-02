const VARIANTS = {
  amber: "bg-amber-500/10 text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
  sky: "bg-sky-500/10 text-sky-400",
  violet: "bg-violet-500/10 text-violet-400",
};

/**
 * @param {{ label: string, value: string|number, icon?: React.ReactNode, variant?: keyof typeof VARIANTS }} props
 */
export default function StatsCard({ label, value, icon, variant = "amber" }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900/60">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-500">
          {label}
        </p>
        {icon ? (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${VARIANTS[variant] ?? VARIANTS.amber}`}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
        {value}
      </p>
    </div>
  );
}
