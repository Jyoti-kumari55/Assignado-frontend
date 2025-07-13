import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let profileImageUrl = "";
    if (!fullname) {
      setError("Please enter full name.");
      setLoading(false);

      return;
    }

    if (!username) {
      setError("Please enter unique username.");
      setLoading(false);

      return;
    }

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
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        username,
        email,
        password,
        bio,
        profileImageUrl,
        adminInviteToken,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured. Please try some time later.");
      }
    }
  };

  return (
    <AuthLayout>
      <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-4xl">
        <div className="min-h-screen flex flex-col justify-center py-8 sm:py-10">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h3 className="text-base md:text-lg  font-semibold text-black mb-2">
              Create an Account
            </h3>
            <p className="text-xs md:text-sm text-slate-700">
              Join us today by entering your details below.
            </p>
          </div>

          {/* SignUp Form */}
          <form onSubmit={handleSignUp}>
            {/* Profile Photo Selector */}
            <div className="flex justify-center sm:justify-start">
              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
                className="mb-4 sm:mb-6"
              />
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <Input
                  value={fullname}
                  onChange={({ target }) => setFullName(target.value)}
                  label="Full Name"
                  placeholder="John"
                  type="text"
                  className="w-full"
                />

                <Input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  label="Email"
                  placeholder="john@example.com"
                  type="email"
                  className="w-full"
                />

                <Input
                  value={bio}
                  onChange={({ target }) => setBio(target.value)}
                  label="Bio"
                  placeholder="Write about yourself."
                  type="text"
                  className="w-full"
                />
              </div>

              <div className="space-y-4 sm:space-y-6">
                <Input
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                  label="Username"
                  placeholder="john00_walk"
                  type="text"
                  className="w-full"
                />

                <Input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  label="Password"
                  placeholder="Min 8 Characters"
                  type="password"
                  className="w-full"
                />

                <Input
                  value={adminInviteToken}
                  onChange={({ target }) => setAdminInviteToken(target.value)}
                  label="Admin Invite Token"
                  placeholder="6 Digit Code"
                  type="text"
                  className="w-full"
                />
              </div>
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
              className={`btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "SIGNNING IN..." : "SIGN UP"}
            </button>

            {/* Login Link */}
            <div className="text-center mt-2">
              <p className="text-sm sm:text-base text-slate-800">
                Already have an account?
                <Link
                  className="font-medium text-primary underline ml-2 hover:text-blue-400 transition-colors duration-200"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </AuthLayout>
  );
};

export default SignUp;
