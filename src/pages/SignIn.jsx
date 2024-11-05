import { useState } from "react";
import { LuArrowRight, LuEye, LuEyeOff, LuLock, LuMail } from "react-icons/lu";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import Image from "../assets/images/House Finding On Real Estate Company Stock Vector.jfif";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log(formData);
      // Proceed with form submission or authentication
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
              alt="Sign In"
              className="w-full h-full object-cover rounded-l-2xl"
            />
            {/* Overlay with text */}
            <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 to-transparent rounded-l-2xl flex flex-col justify-end p-6">
              <h2 className="text-2xl font-bold text-base-content">
                Welcome Back!
              </h2>
              <p className="text-base-content/80 mt-2">
                Sign in to access your account
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="card-body p-8">
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold text-center md:text-left">
                Sign In
              </h1>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                    <Link
                      to="/forgot-password"
                      className="label-text-alt link link-primary"
                    >
                      Forgot password?
                    </Link>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <LuLock className="w-4 h-4 opacity-70" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={onChange}
                      placeholder="Enter your password"
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
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Sign In Button */}
                <button className="btn btn-primary w-full mt-4" type="submit">
                  Sign in
                  <LuArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="divider">OR</div>

                {/* OAuth  */}
                <OAuth />

                {/* Sign Up Link */}
                <p className="text-center text-sm mt-4">
                  Don&apos;t have an account?{" "}
                  <Link to="/sign-up" className="link link-primary">
                    Create one now
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

export default SignIn;
