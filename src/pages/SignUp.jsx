import { useState } from "react";
import {
  LuArrowRight,
  LuEye,
  LuEyeOff,
  LuLock,
  LuMail,
  LuUser,
} from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import Image from "../assets/images/Premium Vector _ Real Estate Concept_ Businessman buying a house with hand giving keys and house_.jfif";
import { account } from "../lib/appwrite";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { handleSignup } from "../lib/auth";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
    // Clear errors when user starts typing
    if (formErrors[e.target.id]) {
      setFormErrors((prev) => ({
        ...prev,
        [e.target.id]: null,
      }));
    }
    setError(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8)
      errors.password = "Password must be at least 8 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        await handleSignup(formData.name, formData.email, formData.password); // Call signup function
        navigate("/"); // Redirect to main page after successful signup
      } catch (error) {
        console.error("Error during signup:", error);
        setError("Failed to create your account. Please try again later");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card max-w-4xl mx-auto bg-base-100 shadow-xl">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative hidden md:block">
            <img
              src={Image}
              alt="Sign Up"
              className="w-full h-full object-cover rounded-l-2xl"
            />
            {/* Overlay with text */}
            <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 to-transparent rounded-l-2xl flex flex-col justify-end p-6">
              <h2 className="text-2xl font-bold text-base-content">
                Join Us Today!
              </h2>
              <p className="text-base-content/80 mt-2">
                Create an account to get started
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="card-body p-8">
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold text-center md:text-left">
                Create Account
              </h1>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/*  Name Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <LuUser className="w-4 h-4 opacity-70" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={onChange}
                      placeholder="Enter your name"
                      className="grow"
                    />
                  </label>
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <LuMail className="w-4 h-4 opacity-70" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={onChange}
                      placeholder="Enter your email"
                      className="grow"
                    />
                  </label>
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <LuLock className="w-4 h-4 opacity-70" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={onChange}
                      placeholder="Create a password"
                      className="grow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn btn-ghost btn-circle btn-sm"
                    >
                      {showPassword ? (
                        <LuEyeOff className="w-4 h-4" />
                      ) : (
                        <LuEye className="w-4 h-4" />
                      )}
                    </button>
                  </label>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                {/* Sign Up Button */}
                <button
                  className={`btn w-full mt-4 flex items-center justify-center ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "btn-primary"
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      Create Account
                      <LuArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="divider">OR</div>

                {/* OAuth */}
                <OAuth />

                {/* Sign In Link */}
                <p className="text-center text-sm mt-4">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="link link-primary">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
