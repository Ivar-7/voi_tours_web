import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarOff } from "lucide-react";

import Alert from "@shared/components/ui/Alert";
import Skeleton from "@shared/components/ui/Skeleton";
import Button from "@shared/components/ui/Button";
import Pagination from "@shared/components/ui/Pagination";
import { usePagination } from "@shared/hooks";
import { OperationalStatus } from "@shared/types/enums";
import { cn } from "@shared/utils/cn";

import BookingCard from "../components/BookingCard";
import { useBookings } from "../hooks/useBookings";

const PAGE_SIZE = 8;

const TABS = [
  { value: "all", label: "All" },
  {
    value: "active",
    label: "Active",
    statuses: [
      OperationalStatus.PENDING,
      OperationalStatus.CONFIRMED,
      OperationalStatus.IN_PROGRESS,
    ],
  },
  {
    value: "completed",
    label: "Completed",
    statuses: [OperationalStatus.COMPLETED],
  },
  {
    value: "cancelled",
    label: "Cancelled",
    statuses: [OperationalStatus.CANCELLED],
  },
];

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: bookings, isLoading, isError, error } = useBookings();

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.value === activeTab);
    if (!tab?.statuses) return bookings ?? [];
    return (bookings ?? []).filter((b) => tab.statuses.includes(b.status));
  }, [bookings, activeTab]);

  const { page, totalPages, goTo } = usePagination({
    totalItems: filtered.length,
    pageSize: PAGE_SIZE,
  });

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-bold text-text-primary">
          My Bookings
        </h1>
        <Button as={Link} to="/dashboard/book/safari" size="sm">
          Book a service
        </Button>
      </div>

      <div className="mt-6 flex gap-2 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-text-muted hover:text-text-primary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <>
            <Skeleton height={84} />
            <Skeleton height={84} />
            <Skeleton height={84} />
          </>
        ) : isError ? (
          <Alert variant="error" title="Couldn't load your bookings">
            {error?.message ?? "Please try again."}
          </Alert>
        ) : pageItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border py-16 text-center">
            <CalendarOff className="h-8 w-8 text-text-muted" />
            <p className="text-sm text-text-muted">
              {activeTab === "all"
                ? "You haven't made any bookings yet."
                : "Nothing here yet."}
            </p>
            <Button as={Link} to="/dashboard/book/safari" size="sm">
              Book a service
            </Button>
          </div>
        ) : (
          pageItems.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>

      {!isLoading && !isError && totalPages > 1 ? (
        <div className="mt-6">
          <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />
        </div>
      ) : null}
    </div>
  );
}
