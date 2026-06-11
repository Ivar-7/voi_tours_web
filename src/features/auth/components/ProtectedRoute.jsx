import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import LoadingState from "@shared/components/feedback/LoadingState";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Checking access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
}
