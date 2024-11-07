import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  if (isAuthenticated) {
    // If user is authenticated, redirect to the home
    return <Navigate to="/profile" />;
  }

  return children; // Allow access to the sign-in or sign-up page if not authenticated
};

export default ProtectedRoute;
