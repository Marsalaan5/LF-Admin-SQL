import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Sidebar({isOpen}) {
  return (
    <div
      className={`sidebar container-fluid ${isOpen ? "open" : "closed"}`}
      style={{ width: "250px", minHeight: "100vh", background: "pink",}}
    >
      <div className="p-3">
        <ul className=" nav flex-column">
          <li className="nav-item mb-2">
            <Link
              to="/"
              className="nav-link text-white d-flex align-items-center"
            >
              <i className="fas fa-tachometer-alt me-2"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/user_management"
              className="nav-link text-white d-flex align-items-center"
            >
              <i className="fas fa-user me-2"></i>
              <span>User Management</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/tables"
              className="nav-link text-white d-flex align-items-center"
            >
              <i className="fas fa-table me-2"></i>
              <span>Table List</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/typography"
              className="nav-link text-white d-flex align-items-center"
            >
              <i className="fas fa-font me-2"></i>
              <span>Typography</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/icons"
              className="nav-link text-white d-flex align-items-center"
            >
              <i className="fas fa-icons me-2"></i>
              <span>Icons</span>
            </Link>
          </li>
         
          <li className="nav-item mb-2">
            <Link
              to="/notifications"
              className="nav-link text-white d-flex align-items-center"
            >
              <i className="fas fa-bell me-2"></i>
              <span>Notifications</span>
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              to="/maps"
              className="nav-link text-white d-flex align-items-center"
            >
               <i className="fas fa-cog me-2"></i>  {/* Settings Icon */}
              <span>Setting</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
