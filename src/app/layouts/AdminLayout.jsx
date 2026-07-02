import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import LoadingState from "@shared/components/feedback/LoadingState";
import RouteProgress from "@shared/components/feedback/RouteProgress";
import PageTransition from "@shared/components/layout/PageTransition";
import Navbar from "@shared/components/layout/Navbar";

export default function AdminLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading admin tools..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <Navbar />

      <main className="mx-auto min-w-0 max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RouteProgress />
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
