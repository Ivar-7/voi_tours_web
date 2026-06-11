import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import {
  formatCurrency,
  formatDuration,
  getMinPrice,
} from "../utils/packages.utils";

export default function PackageHero({ package: pkg, showBookCta = true }) {
  const minPrice = getMinPrice(pkg.pricing);
  const priceLabel = minPrice
    ? formatCurrency(minPrice.price, minPrice.currency)
    : null;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-950 text-white shadow-2xl shadow-stone-900/20 dark:border-stone-800">
      <div className="absolute inset-0">
        <img
          src={
            pkg.hero_image ||
            "https://images.unsplash.com/photo-1503197979108-c824168d51a8?w=1200&q=80"
          }
          alt={pkg.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/20" />
      </div>

      <div className="relative z-10 grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 backdrop-blur">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDuration(pkg.duration_days)}
            </span>
            {!pkg.is_active ? (
              <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Inactive
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {pkg.title}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
            {pkg.description}
          </p>

          {(pkg.destinations || []).length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {pkg.destinations.map((stop) => (
                <span
                  key={`${stop.destination_id}-${stop.stop_order}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-stone-100"
                >
                  <MapPin className="h-3.5 w-3.5 text-amber-300" />
                  {stop.name || stop.destination_id}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-300">
              Starting from
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-amber-300">
              {priceLabel || "Contact us"}
            </p>
          </div>

          {showBookCta ? (
            <Link
              to={`/dashboard/book/safari?package=${pkg.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              Book this safari
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
