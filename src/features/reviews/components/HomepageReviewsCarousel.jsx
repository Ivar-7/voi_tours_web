import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReviews } from "../hooks/useReviews";
import StarRating from "./StarRating";

const AUTO_ADVANCE_MS = 6000;

/**
 * Auto-playing carousel of `is_visible_on_homepage` reviews. Self-contained
 * — fetches its own data, so HomePage can drop it in with no props.
 */
export default function HomepageReviewsCarousel() {
  const { data: reviews = [], isLoading } = useReviews({
    homepage: true,
    limit: 6,
  });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reviews.length < 2) return undefined;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % reviews.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [paused, reviews.length]);

  if (isLoading || !reviews.length) return null;

  const review = reviews[index % reviews.length];

  function goTo(next) {
    setIndex(((next % reviews.length) + reviews.length) % reviews.length);
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative mx-auto max-w-2xl"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5 rounded-2xl border border-amber-800/50 bg-amber-900/40 p-8 text-center backdrop-blur-sm"
        >
          <StarRating value={review.rating} readOnly size="md" />
          <p className="text-lg leading-relaxed text-amber-100">
            "{review.comment}"
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700 text-sm font-bold text-amber-100">
              {review.user_name?.charAt(0) ?? "?"}
            </div>
            <p className="text-sm font-semibold text-amber-50">
              {review.user_name}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {reviews.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous review"
            className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-950/80 text-amber-200 transition-colors hover:bg-amber-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next review"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex h-9 w-9 items-center justify-center rounded-full bg-amber-950/80 text-amber-200 transition-colors hover:bg-amber-900"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mt-5 flex justify-center gap-2">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index % reviews.length
                    ? "w-6 bg-amber-400"
                    : "w-1.5 bg-amber-800"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
