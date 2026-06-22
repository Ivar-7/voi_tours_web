import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@shared/utils/cn";

function getPageNumbers(page, totalPages) {
  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  return [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
}

function NavButton({ disabled, onClick, children, label }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-border text-text-secondary transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <NavButton
        label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </NavButton>

      {pageNumbers.map((pageNumber, index) => {
        const prev = pageNumbers[index - 1];
        const showEllipsis = prev !== undefined && pageNumber - prev > 1;

        return (
          <span key={pageNumber} className="flex items-center gap-1.5">
            {showEllipsis ? (
              <span className="px-1 text-sm text-text-muted">…</span>
            ) : null}
            <button
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-btn text-sm font-medium transition-colors",
                pageNumber === page
                  ? "bg-brand-600 text-text-inverse"
                  : "text-text-secondary hover:bg-surface-raised",
              )}
            >
              {pageNumber}
            </button>
          </span>
        );
      })}

      <NavButton
        label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </NavButton>
    </nav>
  );
}
