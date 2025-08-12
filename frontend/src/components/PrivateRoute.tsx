import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, isAuthenticated }: any) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}
