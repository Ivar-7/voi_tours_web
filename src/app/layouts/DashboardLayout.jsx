import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';
import LoadingState from '@shared/components/feedback/LoadingState';
import { logout } from '@features/auth/api/auth.api';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white',
  ].join(' ');

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const name = user?.full_name || user?.email || 'Traveler';

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-sm font-bold text-white">
              SC
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-lg font-bold">
                Savanna Crown
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Dashboard
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/dashboard/bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
            <NavLink to="/dashboard/book/safari" className={navLinkClass}>
              Book a Service
            </NavLink>
            <NavLink to="/dashboard/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Customer dashboard
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-100 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2 md:hidden">
          <NavLink to="/dashboard/bookings" className={navLinkClass}>
            My Bookings
          </NavLink>
          <NavLink to="/dashboard/book/safari" className={navLinkClass}>
            Book a Service
          </NavLink>
          <NavLink to="/dashboard/profile" className={navLinkClass}>
            Profile
          </NavLink>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
