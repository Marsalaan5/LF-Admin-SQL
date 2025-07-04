import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Sidebar({ isOpen, userRole }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, [userRole]);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5001/auth/menu?role=${userRole}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMenuItems(response.data);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to load menu items", error);
      setIsLoading(false);
    }
  };

  const renderMenu = (items) =>
    items.map((item) => (
      <li key={item.id} className="nav-item mb-2">
        <Link
          to={item.status === "active" ? item.path : "#"}
          className={`nav-link d-flex align-items-center ${
            item.status === "active" ? "text-white" : "text-secondary"
          }`}
        >
          <i className={`${item.icon} me-2`}></i>
          <span>{item.title}</span>
        </Link>
        {item.children && item.children.length > 0 && (
          <ul className="nav flex-column ms-3">{renderMenu(item.children)}</ul>
        )}
      </li>
    ));

  return (
    <div
      className={`sidebar-container ${isOpen ? "open" : ""}`}
      style={{
        height: "100vh",
        background: "linear-gradient(to right, #ff7e5f, #ff7e5f)",
        padding: "20px",
        color: "white",
        overflowY: "auto",
        transition: "left 0.3s ease-in-out",
      }}
    >
      <div className="p-2 mt-2">
        {isLoading ? (
          <p>Loading menu...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="nav flex-column">{renderMenu(menuItems)}</ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
