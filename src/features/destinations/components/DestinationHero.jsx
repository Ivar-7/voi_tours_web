import { formatCurrency, formatRegionLabel } from "../utils/destinations.utils";

export default function DestinationHero({ destination }) {
  const price = formatCurrency(destination.priceFrom, destination.currency);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-950 text-white shadow-2xl shadow-stone-900/20 dark:border-stone-800">
      <div className="absolute inset-0">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/20" />
      </div>

      <div className="relative z-10 grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 backdrop-blur">
              {formatRegionLabel(destination.region)}
            </span>
            {destination.featured ? (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-950">
                Featured escape
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {destination.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-200 sm:text-lg">
            {destination.tagline}
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-300">
            {destination.description}
          </p>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-300">
              Starting from
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-amber-300">
              {price || "Contact us"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                Region
              </p>
              <p className="mt-1 font-medium text-white">
                {formatRegionLabel(destination.region)}
              </p>
            </div>
            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                Slug
              </p>
              <p className="mt-1 truncate font-medium text-white">
                {destination.slug}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
