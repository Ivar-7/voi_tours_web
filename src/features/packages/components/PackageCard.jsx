import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import {
  excerpt,
  formatCurrency,
  formatDuration,
  getMinPrice,
} from "../utils/packages.utils";

export default function PackageCard({ package: pkg, index = 0 }) {
  const minPrice = getMinPrice(pkg.pricing);
  const priceLabel = minPrice
    ? formatCurrency(minPrice.price, minPrice.currency)
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/10 dark:border-stone-800 dark:bg-stone-900"
    >
      <Link to={`/packages/${pkg.slug}`} className="flex h-full flex-col">
        <div className="relative h-64 overflow-hidden">
          <img
            src={
              pkg.hero_image ||
              "https://images.unsplash.com/photo-1503197979108-c824168d51a8?w=800&q=80"
            }
            alt={pkg.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent" />
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-900 backdrop-blur dark:bg-stone-950/80 dark:text-stone-50">
              <CalendarDays className="h-3.5 w-3.5 text-amber-500" />
              {formatDuration(pkg.duration_days)}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-serif text-2xl font-bold text-white">
              {pkg.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
            {excerpt(pkg.description, 140)}
          </p>

          {(pkg.destinations || []).length ? (
            <div className="flex flex-wrap gap-2">
              {pkg.destinations.slice(0, 3).map((stop) => (
                <span
                  key={`${stop.destination_id}-${stop.stop_order}`}
                  className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                >
                  <MapPin className="h-3 w-3 text-amber-500" />
                  {stop.name || stop.destination_id}
                </span>
              ))}
            </div>
          ) : null}

          {(pkg.highlights || []).length ? (
            <div className="flex flex-wrap gap-2">
              {pkg.highlights.slice(0, 3).map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-auto flex items-center justify-between border-t border-stone-200 pt-4 dark:border-stone-800">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                {priceLabel ? "From" : "Explore"}
              </p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
                {priceLabel || "View details"}
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-white transition-transform duration-300 group-hover:translate-x-1 dark:bg-stone-100 dark:text-stone-950">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
