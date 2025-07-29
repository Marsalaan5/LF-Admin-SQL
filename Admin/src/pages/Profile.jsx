import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile:"",
  });

  const navigate = useNavigate();

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
          mobile:response.data.mobile,
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     formData.name === user.name &&
  //     formData.email === user.email &&
  //     formData.password === "" &&
  //     formData.mobile === user.mobile
  //   ) {
  //     formData.email === user.email &&
  //     toast("No changes detected.", {
  //       icon: "⚠️",
  //       style: { backgroundColor: "orange", color: "white" },
  //     });
  //     return;
  //   }

  //   const dataToUpdate = {
  //     name: formData.name,
  //     email: formData.email,
  //     password: formData.password.trim() ? formData.password : undefined,
  //     mobile: formData.mobile,
  //   };

  //   try {
  //     await axios.put("http://localhost:5001/auth/profile", dataToUpdate, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     const updated = await axios.get("http://localhost:5001/auth/profile", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     setUser(updated.data);
  //     setFormData({
  //       name: updated.data.name,
  //       email: updated.data.email,
  //       password: "",
  //       mobile: updated.data.mobile,
  //     });

  //     if (formData.password.trim()) {
  //       localStorage.removeItem("token");
  //       toast.success(
  //         "Password updated successfully. You have been logged out."
  //       );
  //       navigate("/login");
  //       return;
  //     }

  //     setIsEditing(false);
  //     toast.success("Profile updated successfully!");
  //     navigate("/profile");
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     toast.error("Failed to update profile.");
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    formData.name === user.name &&
    formData.email === user.email &&
    formData.password === "" &&
    formData.mobile === user.mobile
  ) {
    toast("No changes detected.", {
      icon: "⚠️",
      style: { backgroundColor: "orange", color: "white" },
    });
    return;
  }

  const dataToUpdate = {
    name: formData.name,
    email: formData.email,
    password: formData.password.trim() ? formData.password : undefined,
    mobile: formData.mobile,
  };

  try {
    const response = await axios.put(
      "http://localhost:5001/auth/profile",
      dataToUpdate,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // response.data now contains the updated user info (without password)
    setUser(response.data);



setFormData({
name:response.data.name

})



    setFormData({
      name: response.data.name,
      email: response.data.email,
      password: "",
      mobile: response.data.mobile,
    });

    if (formData.password.trim()) {
      localStorage.removeItem("token");
      toast.success("Password updated successfully. You have been logged out.");
      navigate("/login");
      return;
    }

    setIsEditing(false);
    toast.success("Profile updated successfully!");
    navigate("/profile");
  } catch (error) {
    console.error("Error updating profile:", error);

    // Display backend error message if available
    const message =
      error.response?.data?.message || "Failed to update profile.";
    toast.error(message);
  }
};


  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5 p-2">
      <div className="p-4 d-flex justify-content-between align-items-center">
        <div className="col-sm-6">
          <h1 className="m-0 text-dark">Profile</h1>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">My-Profile</li>
            </ol>
          </div>
        </div>
      </div>
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">
            {isEditing ? "Edit Profile" : "My Profile"}
          </h3>

          <form onSubmit={handleSubmit}>
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
            <div className="mb-3">
              <label className="form-label">Mobile</label>
              <input
                type="text"
                name="mobile"
                className="form-control"
                value={formData.mobile}
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
      <Toaster position="top-center" />{" "}
    </div>
  );
}

export default Profile;
