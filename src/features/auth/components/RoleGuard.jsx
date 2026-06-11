import { Navigate } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';
import LoadingState from '@shared/components/feedback/LoadingState';

export default function RoleGuard({ roles, children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
