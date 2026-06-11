import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import EmptyState from "@shared/components/feedback/EmptyState";

export default function DestinationGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex(
          (current) => (current - 1 + images.length) % images.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, images.length]);

  if (!images.length) {
    return (
      <EmptyState
        title="Gallery coming soon"
        description="This destination does not have extra gallery images yet."
      />
    );
  }

  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1.45fr_0.55fr]">
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className="group relative overflow-hidden rounded-[1.5rem]"
        >
          <img
            src={images[0]}
            alt="Gallery image 1"
            className="h-[28rem] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index + 1)}
              className="group relative overflow-hidden rounded-[1.25rem]"
            >
              <img
                src={image}
                alt={`Gallery image ${index + 2}`}
                className="h-[13.25rem] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 px-4 py-8 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative max-h-[90dvh] w-full max-w-6xl overflow-hidden rounded-[1.5rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage}
              alt="Expanded gallery"
              className="max-h-[90dvh] w-full object-contain"
            />
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-stone-950 transition-colors hover:bg-amber-400"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (current) => (current - 1 + images.length) % images.length,
                )
              }
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-950 transition-colors hover:bg-amber-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current + 1) % images.length)
              }
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-950 transition-colors hover:bg-amber-400"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
