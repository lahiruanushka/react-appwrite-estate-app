import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { LuHome } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { logout, updateUserProfile } from "../store/features/authSlice";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [changeName, setChangeName] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name });
    }
  }, [user]);

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const handleChangeName = async () => {
    if (!changeName) return; // If enabling edit mode, don't proceed

    if (formData.name === user.name) {
      setChangeName(false);
      return; // No changes made
    }

    if (formData.name.trim().length < 3) {
      console.error("Name must be at least 3 characters long");
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateUserProfile({ name: formData.name })).unwrap();
      setChangeName(false);
    } catch (error) {
      console.error(error.message || "Failed to update name");
      // Revert name change on error
      setFormData({ name: user.name });
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl justify-center mb-6">
              My Profile
            </h2>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                disabled={!changeName}
                onChange={onChange}
                className="input input-bordered w-full"
                placeholder="Your name"
                minLength={3}
                required
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2">
                <span>Want to change your name?</span>
                <button
                  className={`btn btn-ghost btn-sm ${
                    changeName ? "text-success" : "text-primary"
                  }`}
                  onClick={() => {
                    if (changeName) {
                      handleChangeName();
                    } else {
                      setChangeName(true);
                    }
                  }}
                  disabled={loading}
                >
                  {loading
                    ? "Updating..."
                    : changeName
                    ? "Apply change"
                    : "Edit"}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <Link
          to="/create-listing"
          className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
        >
          <LuHome className="w-6 h-6 bg-primary-content rounded-full p-1 border-2" />
          <span>Sell or rent your home</span>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
