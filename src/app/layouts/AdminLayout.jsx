import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';
import LoadingState from '@shared/components/feedback/LoadingState';

const adminItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/packages', label: 'Packages' },
];

const navLinkClass = ({ isActive }) =>
  [
    'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
    isActive
      ? 'bg-amber-500 text-stone-950'
      : 'text-stone-300 hover:bg-stone-800 hover:text-white',
  ].join(' ');

export default function AdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading admin tools..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const name = user?.full_name || user?.email || 'Admin';

  return (
    <div className="min-h-dvh bg-stone-950 text-stone-50">
      <div className="grid min-h-dvh lg:grid-cols-[18rem_1fr]">
        <aside className="border-b border-stone-800 bg-stone-900 px-5 py-6 lg:border-b-0 lg:border-r">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-stone-950">
              SC
            </span>
            <span>
              <span className="block font-serif text-lg font-bold">
                Savanna Crown
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-stone-400">
                Admin
              </span>
            </span>
          </Link>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Welcome back
            </p>
            <p className="mt-2 text-sm font-medium text-stone-200">{name}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {adminItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="border-b border-stone-800 bg-stone-950/80 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-200">
                  Management console
                </p>
                <p className="text-xs text-stone-500">
                  Bookings, users, inquiries, and packages
                </p>
              </div>
              <Link
                to="/dashboard"
                className="rounded-full border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-800"
              >
                Back to dashboard
              </Link>
            </div>
          </header>

          <main className="flex-1 px-5 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
}
