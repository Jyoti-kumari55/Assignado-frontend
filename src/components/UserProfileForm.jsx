import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const UserProfileForm = ({
  formData,
  setFormData,
  editableUserId,
  isAdminEditingOtherUser,
  onUpdateSuccess,
  isCreateMode = false,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImageUrl") {
      setFormData((prev) => ({ ...prev, profileImageUrl: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.name?.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.username?.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.email?.trim()) {
      toast.error("Email is required");
      return false;
    }

    // For create mode, password is required
    if (isCreateMode && !formData.newPassword) {
      toast.error("Password is required");
      return false;
    }

    // For update mode, if changing password, current password is required
    if (!isCreateMode && formData.newPassword && !formData.currentPassword) {
      toast.error("Current password is required to set new password");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let profileImageUrl = formData.profileImageUrl;

      // Upload image if file (only in update mode)
      if (
        !isCreateMode &&
        formData.profileImageUrl &&
        typeof profileImageUrl === "object"
      ) {
        const imgData = new FormData();
        imgData.append("image", formData.profileImageUrl);

        const uploadRes = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          imgData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        profileImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        //  bio: formData.bio,
        // profileImageUrl: profileImageUrl,
      };

      // Add bio and profileImageUrl only in update mode
      if (!isCreateMode) {
        payload.bio = formData.bio;
        payload.profileImageUrl = profileImageUrl;
      }

      // Handle password fields based on mode
      if (isCreateMode) {
        if (formData.newPassword) {
          payload.password = formData.newPassword;
        }
        payload.role = formData.role || "member";
      } else {
        if (formData.currentPassword && formData.newPassword) {
          payload.currentPassword = formData.currentPassword;
          payload.newPassword = formData.newPassword;
        }
      }

      let response;
      if (isCreateMode) {
        // Create new user
        response = await axiosInstance.post(
          API_PATHS.USERS.CREATE_USER,
          payload
        );
        toast.success(response.data.message || "User created successfully!");
      } else {
        const apiPath = isAdminEditingOtherUser
          ? API_PATHS.USERS.UPDATE_ADMIN(editableUserId)
          : API_PATHS.USERS.UPDATE_USER(editableUserId);

        response = await axiosInstance.put(apiPath, payload);
        toast.success(response.data.message || "Profile updated successfully!");
      }

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));

      if (onUpdateSuccess) {
        onUpdateSuccess(response.data.user);
      }

      if (isCreateMode && onClose) {
        onClose();
      }
    } catch (error) {
      console.error(isCreateMode ? "Create error:" : "Update error:", error);
      toast.error(
        error.response?.data?.message ||
          `${isCreateMode ? "Creation" : "Update"} failed.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-8 gap-4 mt-4">
        <div className="col-span-8 md:col-span-4">
          <label className="input-label">Name</label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Full Name"
            className="form-input"
            type="text"
            required
          />
        </div>

        <div className="col-span-8 md:col-span-4">
          <label className="input-label">Username</label>
          <input
            name="username"
            value={formData.username || ""}
            onChange={handleChange}
            placeholder="Username"
            className="form-input"
            type="text"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-4">
          <label className="input-label">Email</label>
          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="form-input"
            type="email"
            required
          />
        </div>

        {/* Role field for create mode */}
        {isCreateMode && (
          <div className="col-span-12 md:col-span-4">
            <label className="input-label">Role</label>
            <select
              name="role"
              value={formData.role || "member"}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        {/* Current Password field */}
        {!isCreateMode && (
          <div className="col-span-12 md:col-span-4">
            <label className="input-label">Current Password</label>
            <input
              name="currentPassword"
              value={formData.currentPassword || ""}
              onChange={handleChange}
              placeholder="Current Password"
              className="form-input"
              type="password"
            />
          </div>
        )}

        <div className="col-span-12 md:col-span-4">
          <label className="input-label">
            {isCreateMode ? "Password" : "New Password"}
            {isCreateMode && <span className="text-red-500"> *</span>}
          </label>
          <input
            name="newPassword"
            value={formData.newPassword || ""}
            onChange={handleChange}
            placeholder={isCreateMode ? "Password" : "New Password"}
            className="form-input"
            type="password"
            required={isCreateMode}
          />
        </div>
      </div>

      {/* Bio field - only in update mode */}
      {!isCreateMode && (
        <div className="mt-4">
          <label className="input-label">Bio</label>
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            placeholder="Write your thoughts about yourself..."
            className="form-input"
            rows={4}
          ></textarea>
        </div>
      )}

      {/* Profile Image field - only in update mode */}
      {!isCreateMode && (
        <div className="mt-4">
          <label className="input-label">Profile Image</label>
          <input
            type="file"
            name="profileImageUrl"
            onChange={handleChange}
            accept="image/*"
            className="form-input"
          />
          {formData.profileImageUrl &&
            typeof formData.profileImageUrl === "string" && (
              <div className="mt-2">
                <img
                  src={formData.profileImageUrl}
                  alt="Profile"
                  className="w-20 h-20 object-cover rounded-full"
                />
              </div>
            )}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-7">
        {isCreateMode && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
        )}

        <button type="submit" className="add-btn" disabled={loading}>
          {loading
            ? isCreateMode
              ? "Creating..."
              : "Updating..."
            : isCreateMode
            ? "CREATE USER"
            : "UPDATE DETAILS"}
        </button>
      </div>
    </form>
  );
};

export default UserProfileForm;
