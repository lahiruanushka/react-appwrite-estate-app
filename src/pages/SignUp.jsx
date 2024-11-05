import { useState } from "react";
import {
  LuArrowRight,
  LuEye,
  LuEyeOff,
  LuLock,
  LuMail,
  LuUser,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import Image from "../assets/images/Premium Vector _ Real Estate Concept_ Businessman buying a house with hand giving keys and house_.jfif";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { firstName, lastName, email, password } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const validateForm = () => {
    const errors = {};

    if (!firstName) errors.firstName = "First Name is required";
    if (!lastName) errors.lastName = "Last Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
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
                {/* First Name Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <LuUser className="w-4 h-4 opacity-70" />
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={onChange}
                      placeholder="Enter your first name"
                      className="grow"
                    />
                  </label>
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <LuUser className="w-4 h-4 opacity-70" />
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={onChange}
                      placeholder="Enter your last name"
                      className="grow"
                    />
                  </label>
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.lastName}
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

                {/* Sign Up Button */}
                <button className="btn btn-primary w-full mt-4" type="submit">
                  Create Account
                  <LuArrowRight className="w-4 h-4" />
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
