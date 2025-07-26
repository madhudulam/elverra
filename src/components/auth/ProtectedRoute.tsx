
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMembership?: boolean;
}

const ProtectedRoute = ({ children, requireMembership = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please log in to access this page');
      navigate('/login');
      return;
    }

    if (requireMembership && user) {
      // Check if user has membership - you can implement this logic
      // For now, we'll redirect to membership payment if needed
      // navigate('/membership-payment');
    }
  }, [user, loading, requireMembership, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
