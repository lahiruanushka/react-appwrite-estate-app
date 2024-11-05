import { useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowBigLeft, LuArrowRight, LuMail } from "react-icons/lu";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Validate email and set error message if invalid
    if (!validateEmail(e.target.value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError || !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    // Simulate sending reset link
    setIsEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card max-w-md mx-auto bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <Link to="/sign-in" className="btn btn-ghost btn-sm w-fit gap-2">
            <LuArrowBigLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          <div className="flex flex-col space-y-4 mt-4">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-base-content/70">
              Enter your email address and we&apos;ll send you instructions to
              reset your password.
            </p>

            {!isEmailSent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email Input */}
                <div className="form-control">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <LuMail className="w-4 h-4 opacity-70" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="grow"
                      required
                    />
                  </label>
                  {emailError && (
                    <span className="text-red-500 text-sm">{emailError}</span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  className="btn btn-primary w-full mt-4"
                  type="submit"
                  disabled={!email || emailError}
                >
                  Send Reset Link
                  <LuArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              // Success Message
              <div className="alert alert-success">
                <div className="flex flex-col items-start gap-2">
                  <h3 className="font-bold">Check your email!</h3>
                  <p className="text-sm">
                    We&apos;ve sent password reset instructions to {email}.
                    Please check your inbox.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
