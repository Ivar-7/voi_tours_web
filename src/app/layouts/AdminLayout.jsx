import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import LoadingState from "@shared/components/feedback/LoadingState";
import RouteProgress from "@shared/components/feedback/RouteProgress";
import PageTransition from "@shared/components/layout/PageTransition";
import Navbar from "@shared/components/layout/Navbar";

const adminItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/destinations", label: "Destinations" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/inquiries", label: "Inquiries" },
  { to: "/admin/packages", label: "Packages" },
];

const navLinkClass = ({ isActive }) =>
  [
    "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
    isActive
      ? "bg-amber-500 text-stone-950"
      : "text-stone-300 hover:bg-stone-800 hover:text-white",
  ].join(" ");

export default function AdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading admin tools..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const name = user?.full_name || user?.email || "Admin";

  return (
    // The admin console is intentionally always dark; its pages are styled
    // for a dark surface only.
    <div className="dark">
      <div className="min-h-dvh bg-stone-950 text-stone-50">
        <Navbar />

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[16rem_1fr] lg:px-8">
          <aside className="h-fit rounded-2xl border border-stone-800 bg-stone-900 p-4 lg:sticky lg:top-24">
            <div className="px-2 pb-3">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Management console
              </p>
              <p className="mt-1 truncate text-sm font-medium text-stone-200">
                {name}
              </p>
            </div>

            <nav className="space-y-1">
              {adminItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="min-w-0">
            <RouteProgress />
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
