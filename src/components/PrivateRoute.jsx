import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Loading from "./Loading";

export default function PrivateRoute() {
    const { loggedIn, checkingStatus } = useAuthStatus();

    if (checkingStatus) {
        return <Loading />; // Show loading state while checking auth status
    }

    return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />; // Redirect if not logged in
}