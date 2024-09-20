import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = () => {
  const { userExists, loading } = useUser(); // Access the profile state

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner while checking
  }

  if (userExists) {
    return <Navigate to="/dashboard" />; // Redirect to dashboard if profile is complete
  }

  return <Outlet />; // Render the complete-profile form if profile is incomplete
};

export default ProtectedRoute;
