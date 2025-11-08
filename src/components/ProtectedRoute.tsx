import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isGuest = typeof window !== 'undefined' && localStorage.getItem('guestMode') === 'true';

  useEffect(() => {
    if (!loading && !user && !isGuest && location.pathname === '/chat') {
      toast.error("You haven't signed in or chosen Guest.");
    }
  }, [loading, user, isGuest, location.pathname]);

  if (loading) return null; // Let /auth show its loader

  if (!user && !isGuest) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
