import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import LoadingState from "@shared/components/feedback/LoadingState";
import RouteProgress from "@shared/components/feedback/RouteProgress";
import PageTransition from "@shared/components/layout/PageTransition";
import Navbar from "@shared/components/layout/Navbar";

const tabs = [
  { to: "/dashboard/bookings", label: "My Bookings" },
  { to: "/dashboard/book", label: "Book a Service" },
  { to: "/dashboard/profile", label: "Profile" },
];

const navLinkClass = ({ isActive }) =>
  [
    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950"
      : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white",
  ].join(" ");

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const name = user?.full_name || user?.email || "Traveler";

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Navbar />

      <div className="border-b border-stone-200/80 bg-white/70 dark:border-stone-800 dark:bg-stone-950/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <NavLink key={tab.to} to={tab.to} className={navLinkClass}>
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <p className="hidden text-xs text-stone-500 dark:text-stone-400 sm:block">
            Signed in as <span className="font-medium">{name}</span>
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RouteProgress />
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
