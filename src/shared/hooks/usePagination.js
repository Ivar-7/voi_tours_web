// TODO: Implement usePagination
// Returns { page, totalPages, goTo, next, prev, canNext, canPrev }
// Props: totalItems, pageSize, initialPage

export function usePagination({ totalItems = 0, pageSize = 10, initialPage = 1 } = {}) {
  // placeholder
  return { page: 1, totalPages: 1, goTo: () => {}, next: () => {}, prev: () => {}, canNext: false, canPrev: false };
}
