import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";  // Import react-hot-toast

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Fetch the user profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5001/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any changes
    if (
      formData.name === user.name &&
      formData.email === user.email &&
      formData.password === ""
    ) {
      toast("No changes detected.", { icon: "⚠️", style: { backgroundColor: "orange", color: "white" } });  // Info toast
      return; // Exit the function if no changes were made
    }

    const dataToUpdate = {
      name: formData.name,
      email: formData.email,
      password: formData.password.trim() ? formData.password : undefined, // Only send password if it's provided
    };

    try {
      // Send the update request to the backend
      await axios.put("http://localhost:5001/auth/profile", dataToUpdate, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Fetch the updated profile data
      const updated = await axios.get("http://localhost:5001/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser(updated.data);
      setFormData({
        name: updated.data.name,
        email: updated.data.email,
        password: "",
      });

      // If the password was updated, log the user out by clearing the token
      if (formData.password.trim()) {
        localStorage.removeItem("token"); // Clear the token from localStorage
        toast.success("Password updated successfully. You have been logged out.");  // Success toast
        navigate("/login"); // Redirect to the login page
        return; // Exit the function
      }

      setIsEditing(false);
      toast.success("Profile updated successfully!");  // Success toast
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");  // Error toast
    }
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">
            {isEditing ? "Edit Profile" : "My Profile"}
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Password */}
            {isEditing && (
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="text-center">
              {isEditing ? (
                <>
                  <button type="submit" className="btn btn-primary me-2">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <Toaster position="top-center" />  {/* Toast container to show notifications */}
    </div>
  );
}

export default Profile;
