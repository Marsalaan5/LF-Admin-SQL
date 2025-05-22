
// import React from "react";
// import { Link } from "react-router-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Sidebar({ isOpen }) {
//   return (
//     <div
//       className={`sidebar-container ${isOpen ? "open" : ""}`}
//       style={{
//         height: "100vh",
//         background: "linear-gradient(to right, #ff7e5f, #ff7e5f)",
//         padding: "20px",
//         color: "white",
//         overflowY: "auto",
//         transition: "left 0.3s ease-in-out",
//       }}
//     >
//       <div className="p-2" style={{marginTop:"10PX"}}>
//         <ul className="nav flex-column">
//           <li className="nav-item mb-2">
//             <Link to="/" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-tachometer-alt me-2"></i>
//               <span>Dashboard</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/user_management" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-user me-2"></i>
//               <span>User Management</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/role_management" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-user-shield me-2"></i>
//               <span>Role Management</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/tables" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-table me-2"></i>
//               <span>Table List</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/typography" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-font me-2"></i>
//               <span>Typography</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/icons" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-icons me-2"></i>
//               <span>Staff</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/notifications" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-bell me-2"></i>
//               <span>Notifications</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/maps" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-cog me-2"></i>
//               <span>Setting</span>
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Sidebar({ isOpen, userRole }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5001/auth/menu?role=${userRole}`);
      console.log("Menu items fetched:", response.data); // Log the response data
      setMenuItems(response.data);

      setIsLoading(false);
    } catch (error) {
      setError("Failed to load menu items.");
      setIsLoading(false);
      console.error("Error fetching menu items:", error);
      
    }
  };

  fetchMenuItems();
}, [userRole]);


  const renderMenu = (items) => {
    return items.map((item) => (
      <li key={item.id} className="nav-item mb-2">
        <Link to={item.path} className="nav-link text-white d-flex align-items-center">
          <i className={`${item.icon} me-2`}></i>
          <span>{item.title}</span>
        </Link>
        {/* Render nested items if they exist */}
        {item.children && item.children.length > 0 && (
          <ul className="nav flex-column ms-3">{renderMenu(item.children)}</ul>
        )}
      </li>
    ));
  };

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
      <div className="p-2" style={{ marginTop: "10px" }}>
        {isLoading ? (
          <p>Loading menu...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="nav flex-column">
            {renderMenu(menuItems)}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
