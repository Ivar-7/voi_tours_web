import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck2, CalendarOff, Clock3, Plus, WalletCards } from "lucide-react";

import Alert from "@shared/components/ui/Alert";
import Skeleton from "@shared/components/ui/Skeleton";
import Button from "@shared/components/ui/Button";
import Pagination from "@shared/components/ui/Pagination";
import { usePagination } from "@shared/hooks";
import { OperationalStatus } from "@shared/types/enums";
import { cn } from "@shared/utils/cn";

import BookingCard from "../components/BookingCard";
import { useBookings } from "../hooks/useBookings";
import { BOOKING_SERVICE_OPTIONS } from "../utils/bookingUi";

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
  const allBookings = useMemo(() => bookings ?? [], [bookings]);

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.value === activeTab);
    if (!tab?.statuses) return allBookings;
    return allBookings.filter((b) => tab.statuses.includes(b.status));
  }, [allBookings, activeTab]);

  const stats = useMemo(
    () => ({
      total: allBookings.length,
      active: allBookings.filter((booking) =>
        TABS.find((tab) => tab.value === "active").statuses.includes(
          booking.status,
        ),
      ).length,
      completed: allBookings.filter(
        (booking) => booking.status === OperationalStatus.COMPLETED,
      ).length,
      quoted: allBookings.filter((booking) => booking.total_amount != null)
        .length,
    }),
    [allBookings],
  );

  const { page, totalPages, goTo } = usePagination({
    totalItems: filtered.length,
    pageSize: PAGE_SIZE,
  });

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
            Travel desk
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-stone-950 dark:text-stone-50">
            My bookings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-400">
            Review requests, track operational status, and continue payment
            when a quote is ready.
          </p>
        </div>
        <Button as={Link} to="/dashboard/book" className="gap-2">
          <Plus className="h-4 w-4" />
          Book a service
        </Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: CalendarCheck2 },
          { label: "Active", value: stats.active, icon: Clock3 },
          { label: "Completed", value: stats.completed, icon: CalendarCheck2 },
          { label: "Quoted", value: stats.quoted, icon: WalletCards },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900/70"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  {item.label}
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-serif text-3xl font-bold text-stone-950 dark:text-stone-50">
                {item.value}
              </p>
            </div>
          );
        })}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
            Start a new request
          </h2>
          <Link
            to="/dashboard/book"
            className="text-sm font-semibold text-amber-700 hover:text-amber-600 dark:text-amber-300"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKING_SERVICE_OPTIONS.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.type}
                to={`/dashboard/book/${service.type}`}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-50/40 dark:border-stone-800 dark:bg-stone-900/70 dark:hover:border-amber-500/60 dark:hover:bg-amber-950/10"
              >
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", service.accent)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-950 dark:text-stone-50">
                    {service.label}
                  </p>
                  <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                    {service.detail}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                activeTab === tab.value
                  ? "bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <>
            <Skeleton height={112} />
            <Skeleton height={112} />
            <Skeleton height={112} />
          </>
        ) : isError ? (
          <Alert variant="error" title="Couldn't load your bookings">
            {error?.message ?? "Please try again."}
          </Alert>
        ) : pageItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-16 text-center dark:border-stone-700 dark:bg-stone-900/50">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-300">
              <CalendarOff className="h-6 w-6" />
            </span>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {activeTab === "all"
                ? "You haven't made any bookings yet."
                : "Nothing here yet."}
            </p>
            <Button as={Link} to="/dashboard/book" size="sm">
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
        <div>
          <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />
        </div>
      ) : null}
    </div>
  );
}
