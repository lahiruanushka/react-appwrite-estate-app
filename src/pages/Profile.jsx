import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../appwrite/auth";
import { useNavigate } from "react-router";
import Loading from "../components/Loading";
import { logoutUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/sign-in");
  };

  if (loading) {
    <Loading />;
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
                value={user.name}
                disabled
                className="input input-bordered w-full"
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
                <button className="btn btn-ghost btn-sm text-success">
                  Edit
                </button>
              </div>
              <button
                onClick={() => handleLogout()}
                className="btn btn-primary btn-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
