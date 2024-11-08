import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateListing from "./pages/CreateListing";

function App() {
  return (
    <Router>
      <Header />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/offers" element={<Offers />} />

        {/* Private Routes */}
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/create-listing" element={<PrivateRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>

        {/* Protected Routes (for guests only) */}
        <Route
          path="/sign-in"
          element={
            <ProtectedRoute>
              <SignIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <ProtectedRoute>
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
