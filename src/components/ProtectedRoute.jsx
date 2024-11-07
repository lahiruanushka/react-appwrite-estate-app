import { Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) return <Loading />; // Show loading state

  if (loggedIn) {
    // If user is authenticated, redirect to the home
    return <Navigate to="/profile" />;
  }

  return children; // Allow access to the sign-in or sign-up page if not authenticated
};

export default ProtectedRoute;
