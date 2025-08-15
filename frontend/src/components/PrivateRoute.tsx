import { authStore } from '../services/authStore';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  // Simplified logic - just check if token exists
  const isAuthenticated = authStore.isAuthenticated();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
