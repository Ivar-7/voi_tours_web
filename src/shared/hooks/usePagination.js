import { useMemo, useState } from "react";

/**
 * @param {{ totalItems?: number, pageSize?: number, initialPage?: number }} [params]
 * @returns {{ page: number, totalPages: number, goTo: (page: number) => void, next: () => void, prev: () => void, canNext: boolean, canPrev: boolean }}
 */
export function usePagination({
  totalItems = 0,
  pageSize = 10,
  initialPage = 1,
} = {}) {
  const [page, setPage] = useState(initialPage);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );

  return {
    page,
    totalPages,
    goTo: (nextPage) => setPage(Math.min(Math.max(1, nextPage), totalPages)),
    next: () => setPage((current) => Math.min(current + 1, totalPages)),
    prev: () => setPage((current) => Math.max(current - 1, 1)),
    canNext: page < totalPages,
    canPrev: page > 1,
  };
}
