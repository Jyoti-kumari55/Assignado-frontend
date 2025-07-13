import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log("1212: ", response.data);

      const { user, token, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
      }
      toast.success(message);
      const redirectPath =
        user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      navigate(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response?.data &&
        error.response?.data?.message
      ) {
        setError(error.response.data.message);
      } else if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError("An unexpected error occured. Please try some time later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black mb-2">
              Welcome Back
            </h3>
            <p className="text-sm sm:text-base text-slate-700">
              Please enter your details to log in.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <Input
                value={email}
                label="Email"
                type="email"
                placeholder="john@example.com"
                onChange={({ target }) => setEmail(target.value)}
                className="w-full"
              />

              <Input
                value={password}
                label="Password"
                type="password"
                placeholder="Your Password"
                onChange={({ target }) => setPassword(target.value)}
                className="w-full"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              // className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-medium rounded-md transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              className={`btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-2">
              <p className="text-sm sm:text-base text-slate-800">
                Don't have an account?
                <Link
                  className="font-medium text-primary underline ml-2 hover:text-blue-400 transition-colors duration-200"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
