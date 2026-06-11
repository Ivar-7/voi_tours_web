// TODO: Implement useMediaQuery
// Returns boolean indicating whether the media query matches
// e.g. useMediaQuery('(min-width: 768px)')

import { useSyncExternalStore } from "react";

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
