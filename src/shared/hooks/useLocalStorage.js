import { useCallback, useState } from "react";

function readValue(key, initialValue) {
  if (typeof window === "undefined") return initialValue;

  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
}

/**
 * Returns `[storedValue, setValue]` synced with `localStorage`, mirroring
 * `useState`'s API (supports both direct values and updater functions).
 *
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() =>
    readValue(key, initialValue),
  );

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            // Storage unavailable (private mode, quota exceeded) — state
            // still updates in-memory for the current session.
          }
        }

        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
