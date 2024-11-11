import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "../store/features/authSlice";
import Loading from "./Loading";

export default function PrivateRoute() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status when component mounts
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading state while checking authentication
  if (loading) return <Loading />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
}
