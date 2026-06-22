import { useSyncExternalStore } from "react";

/**
 * @param {string} query — e.g. `"(min-width: 768px)"`
 * @returns {boolean} whether the media query currently matches
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);

      return () => media.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
