import { authStore } from '../services/authStore';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authStore.isAuthenticated();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
