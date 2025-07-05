// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// function UserProfile(){
//   const { id } = useParams();
//   const { token } = useContext(AuthContext);
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     axios
//       .get(`http://localhost:5001/auth/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setUser(res.data);
//       })
//       .catch((err) => {
//         setError("Failed to load user profile.");
//         console.error(err);
//       });
//   }, [id, token, navigate]);

//   if (error) return <div className="alert alert-danger">{error}</div>;
//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">User Profile</h2>
//       <div className="card p-4 shadow-sm">
//         <h4>{user.name}</h4>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>Status:</strong> {user.status}</p>
//         <p><strong>Role:</strong> {user.role}</p>
//         <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import userr from "../assets/userr.jpg";

function UserProfile() {
  const { id } = useParams();
  const { token, users } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5001/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.error(err);
        setError("Failed to load user profile.");
      });
  }, [id, token, navigate]);

  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5 p-2">
      {/* Header */}
      {/* <div className="row mb-4 align-items-center">
        <div className="d-flex col-md-6">
          <h1 className="m-0 text-dark">User Profile</h1>
        </div>
        <div className="col-md-6 text-md-end">
          <ol className="breadcrumb justify-content-md-end mb-0">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active">User-Profile-Management</li>
          </ol>
        </div>
      </div> */}
      {/* <div className="container-fluid mt-5 p-2 border shadow-sm"> */}
      <div className="p-4 d-flex justify-content-between align-items-center">
        <div className="col-sm-6">
          <h1 className="m-0 text-dark">User Profile</h1>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">User-Profile-View</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card shadow-sm p-4">
        <div className="d-flex align-items-center mb-4">
          <img
            src={userr}
            alt={user.name}
            className="rounded-circle me-4"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <div>
            <h3 className="mb-0">{user.name}</h3>
            <p className="text-muted mb-0">{user.email}</p>
            <p className="text-muted mb-0">{user.mobile}</p>
          </div>
          

         
        </div>

        <hr />

        <div className="row mb-3">
          <div className="col-md-6">
            <strong>Role:</strong> {user.role}
          </div>
          
          <div className="col-md-6">
            <strong>Status:</strong>{" "}
            <span
              className={`badge ${
                user.status === "active" ? "bg-success" : "bg-danger"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <strong>Joined:</strong>{" "}
            {user.insertTime
              ? new Date(user.insertTime).toLocaleDateString()
              : "N/A"}
          </div>
          <div className="col-md-6">
            <strong>Last Login:</strong>{" "}
            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
          </div>
        </div>

        {/* Optional failed login attempts */}
        {/* <div className="row mb-3">
          <div className="col-md-6">
            <strong>Failed Login Attempts:</strong> {user.failedLoginAttempts ?? 0}
          </div>
        </div> */}

        <div className="text-end">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
