import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingState } from './LoadingState';

export default function ProtectedRoute({ roles, children }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState label="Checking session…" />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (roles && !hasRole(...roles)) {
    return (
      <div className="container py-5">
        <h1 className="h4">Access denied</h1>
        <p className="text-muted-warm">Your role does not have permission to view this page.</p>
      </div>
    );
  }
  return children;
}
