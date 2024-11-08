import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loading from "../components/Loading";
import { logoutUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { getCurrentUser, updateCurrentUser } from "../appwrite/user";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeName, setChangeName] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setFormData({ name: currentUser.name }); // Initialize form data with current name
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

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const handleChangeName = async () => {
    try {
      await updateCurrentUser(formData.name); // Call Appwrite API to update name
      setUser((prev) => ({ ...prev, name: formData.name })); // Update local user state
      toast.success("Name updated successfully!");
    
    } catch (error) {
      console.error("Failed to update name:", error);
      toast.error("Error updating name. Please try again."); // Show error toast
    }
  };

  if (loading) {
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
                  className="btn btn-ghost btn-sm text-success"
                  onClick={() => {
                    setChangeName((prevState) => !prevState);
                    if (changeName) handleChangeName(); // Update name if changing back to disabled
                  }}
                >
                  {changeName ? "Apply change" : "Edit"}
                </button>
              </div>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">
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
