import {
  CalendarClock,
  ClipboardList,
  MessageSquarePlus,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@shared/utils";
import StatsCard from "../components/StatsCard";
import RevenueChart from "../components/RevenueChart";
import BookingsTable from "../components/BookingsTable";
import { useAdminStats, useRevenueSeries } from "../hooks/useAdminStats";
import { useAdminBookings } from "../hooks/useAdminBookings";

export default function AdminDashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useAdminStats();
  const { data: revenue = [], isLoading: revenueLoading } =
    useRevenueSeries(30);
  const {
    data: bookingsResult,
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch,
  } = useAdminBookings();

  const recentBookings = (bookingsResult?.data ?? []).slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
          Overview
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          A snapshot of bookings, revenue, and inquiries.
        </p>
      </div>

      {statsError ? (
        <p className="text-sm text-red-400">
          Couldn't load stats: {statsError.message}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total bookings"
            value={statsLoading ? "—" : (stats?.totalBookings ?? 0)}
            icon={<ClipboardList className="h-4 w-4" />}
            variant="sky"
          />
          <StatsCard
            label="Revenue collected"
            value={
              statsLoading ? "—" : formatCurrency(stats?.totalRevenue ?? 0)
            }
            icon={<Wallet className="h-4 w-4" />}
            variant="emerald"
          />
          <StatsCard
            label="Pending bookings"
            value={statsLoading ? "—" : (stats?.pendingBookings ?? 0)}
            icon={<CalendarClock className="h-4 w-4" />}
            variant="amber"
          />
          <StatsCard
            label="New inquiries"
            value={statsLoading ? "—" : (stats?.newInquiries ?? 0)}
            icon={<MessageSquarePlus className="h-4 w-4" />}
            variant="violet"
          />
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-stone-600 dark:text-stone-400">
          Revenue (last 30 days)
        </h2>
        <RevenueChart data={revenue} isLoading={revenueLoading} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-stone-600 dark:text-stone-400">
          Recent bookings
        </h2>
        <BookingsTable
          bookings={recentBookings}
          isLoading={bookingsLoading}
          error={bookingsError}
          onRetry={refetch}
        />
      </div>
    </div>
  );
}
