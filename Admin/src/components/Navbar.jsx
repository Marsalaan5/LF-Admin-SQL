
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userPlaceholder from "../assets/userr.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import userr from "../assets/userr.jpg";

function Navbar({ toggleSidebar }) {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = () => navigate("/login");
  const handleLogout = () => logout();

  return (
    <nav
      className="navbar fixed-top navbar-light"
      // style={{ background: "pink" }}
      style={{
        background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
        // borderRadius: '10px',
        padding: '20px',
        color: 'white',
      }}>
    
      <div className="container-fluid">
        <div className="row w-100 align-items-center">
          <div className="col-2 d-flex align-items-center gap-2">
            <img
              src={userr}
              alt="admin"
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <h5 className="mb-0 fw-semibold text-dark">Admin</h5>
          </div>

          <div className="col-2 d-flex align-items-center justify-content-center gap-3">
            <button
              className="btn btn-outline-secondary"
              onClick={toggleSidebar}
            >
              <i className="fas fa-bars"></i>
            </button>
            <div
              className="search-box d-flex align-items-center border rounded-pill px-3 py-1 bg-white w-100"
              style={{ maxWidth: "300px" }}
            >
              <i
                className="fas fa-search me-2 text-muted"
                style={{ fontSize: "14px" }}
              ></i>
              <input
                type="text"
                placeholder="Search"
                className="form-control border-0 shadow-none"
              />
            </div>
          </div>

          <div className="col-8 d-flex align-items-center justify-content-end gap-3">
            <button className="btn btn-outline-secondary">
              <i className="fas fa-envelope"></i>
            </button>
            <button className="btn btn-outline-secondary">
              <i className="fas fa-bell"></i>
            </button>

            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle"
                  type="button"
                  id="dropdownUser"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={userPlaceholder}
                    alt="User"
                    className="rounded-circle"
                    width="35"
                    height="35"
                  />
                  <span>
                    {user?.name
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ") ||
                      user?.email ||
                      "User"}
                         {user?.role ? ` (${user.role})` : ""}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownUser"
                >
                  <li>
                    <a className="dropdown-item" href="/profile">
                      <i className="fas fa-user me-2"></i>Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/settings">
                      <i className="fas fa-cog me-2"></i>Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={handleSignIn}>
                SignIn
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
