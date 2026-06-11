import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';
import LoadingState from '@shared/components/feedback/LoadingState';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Checking your session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_#fdf8f0,_#f5f0e8_45%,_#efe7da_100%)] px-4 py-8 text-stone-900">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl shadow-stone-900/10 backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-between bg-stone-950 p-10 text-white md:flex">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                  SC
                </span>
                <span>
                  <span className="block font-serif text-lg font-bold">
                    Savanna Crown
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-amber-300/80">
                    Tours & Travel
                  </span>
                </span>
              </Link>
              <p className="mt-8 max-w-md text-sm leading-6 text-stone-300">
                Sign in to manage your bookings, payments, and travel plans.
              </p>
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Voi Town, Kenya
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8 md:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-sm font-bold text-amber-300">
                  SC
                </span>
                <span>
                  <span className="block font-serif text-lg font-bold">
                    Savanna Crown
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-stone-500">
                    Tours & Travel
                  </span>
                </span>
              </Link>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
