import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import userPlaceholder from "../assets/userr.jpg";
import userr from "../assets/userr.jpg";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import axios from "axios";

import "@fortawesome/fontawesome-free/css/all.min.css";

function Navbar({ toggleSidebar, isSidebarOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;


  const { isLoggedIn, logout, user, token } = useContext(AuthContext);

  const navigate = useNavigate();
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);
  const handleSignIn = () => navigate("/login");
  const handleLogout = () => logout();
  const handleNotificationClick = () => setShowDropdown((prev) => !prev);

  const fetchSearchResults = debounce(async (term) => {
    if (!term) return;
    try {
      const res = await axios.get(
        `http://localhost:5001/auth/search?q=${term}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search error", error);
    }
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    fetchSearchResults(value);
  };

 useEffect(() => {
  if (!user?.id || !token) return;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  fetchNotifications();
}, [user?.id, token]);


useEffect(() => {
  if (!user?.id || !token) return;

  console.log("Connecting socket with userId:", user.id);

  const socket = io("http://localhost:5001", {
    query: { userId: user.id },
  });

  socket.on("connect", () =>
    console.log("Connected to socket server with userId:", user.id)
  );
socket.on("new-notification", (data) => {
  if (data.userId === user.id) {
    // setNotifications((prev) => [data, ...prev]); 
    setNotifications((prev) => [data, ...prev]);


    toast.success(data.message || "New Notification");
  } else {
    console.warn("Notification received for another user:", data);
  }
});

  

  return () => socket.disconnect();
}, [user?.id, token]);


const markAllAsRead = async () => {
  try {
    await axios.put(
      "http://localhost:5001/auth/notifications/mark-all-read",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updated = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updated);
  } catch (error) {
    console.error("Failed to mark all as read", error);
  }
};


  return (
    <nav
      className="navbar fixed-top navbar-light"
      style={{
        // background: "linear-gradient(to right, #ff7e5f, #feb47b)",
        background: "linear-gradient(135deg, #4b6cb7, #182848)",
        padding: "10px 20px",
        color: "white",
        zIndex: 1040,
      }}
    >
      <div className="container-fluid">
        {/* DESKTOP NAVBAR (3-column layout) */}
        <div className="d-none d-md-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center gap-2">
            <Link to="/">
              <img
                src={userr}
                alt="admin"
                className="rounded-circle"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </Link>
            <h5 className="mb-0 fw-semibold text-white">Admin</h5>

            <div
              className="d-flex align-items-center gap-3"
              style={{ marginLeft: "99px" }}
            >
              <button
                className="btn btn-outline-light"
                onClick={toggleSidebar}
                style={{ border: "none", background: "transparent" }}
              >
                <i
                  className={`fas fa-${
                    isSidebarOpen ? "chevron-left" : "chevron-right"
                  } fa-lg`}
                ></i>
              </button>

              <div
                className="search-box d-flex align-items-center position-relative border rounded-pill px-3 py-1 bg-white"
                style={{ width: "300px" }}
              >
                <i
                  className="fas fa-search me-2 text-muted"
                  style={{ fontSize: "14px" }}
                ></i>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control border-0 shadow-none"
                  onChange={handleSearchChange}
                  value={searchTerm}
                />

                {/* Search results dropdown */}
                {searchResults.length > 0 && (
                  <div
                    className="position-absolute bg-white border mt-2 rounded shadow-sm"
                    style={{
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1050,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="px-3 py-2 border-bottom"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <strong>{user.name}</strong>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {user.email} — {user.role}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary">
              <i className="fas fa-envelope"></i>
            </button>


            <div className="position-relative" onClick={handleNotificationClick}>
  <button className="btn btn-outline-secondary position-relative">
    <i className="fas fa-bell"></i>
    {unreadCount > 0 && (
      <span
        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        style={{ fontSize: "0.65rem" }}
      >
        {unreadCount}
      </span>
    )}
  </button>

  {showDropdown && (
    <div
      className="dropdown-menu show"
      style={{
        position: "absolute",
        right: 0,
        top: "100%",
        minWidth: "280px",
        maxHeight: "300px",
        overflowY: "auto",
        zIndex: 1000,
        backgroundColor: "#fff",
        borderRadius: "5px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center px-3 py-2">
        <strong>Notifications</strong>
        {unreadCount > 0 && (
          <button
            className="btn btn-sm btn-link text-primary"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      <hr className="my-1" />
      {notifications.length === 0 ? (
        <span className="dropdown-item text-muted">No Notifications</span>
      ) : (
        notifications
          .slice()
          // .reverse()
          .map((n, i) => (
            <span
              key={i}
              className={`dropdown-item ${!n.is_read ? "fw-bold" : ""}`}
            >
              {n.message}
              <div className="text-muted small">
                {new Date(n.created_at).toLocaleString()}
              </div>
            </span>
          ))
      )}
    </div>
  )}
</div>

            {isLoggedIn ? (
              <div className="dropdown" style={{ position: "relative" }}>
                <button
                  className={`btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle ${
                    dropdownOpen ? "show" : ""
                  }`}
                  type="button"
                  id="dropdownUser"
                  aria-expanded={dropdownOpen}
                  onClick={toggleDropdown}
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
                      ?.split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ") ||
                      user?.email ||
                      "User"}
                    {/* {user?.role ? ` (${user.role})` : ""} */}
                  </span>
                </button>

                <ul
                  className={`dropdown-menu dropdown-menu-end ${
                    dropdownOpen ? "show" : ""
                  }`}
                  aria-labelledby="dropdownUser"
                  style={{ position: "absolute" }}
                >
                  {/* Show user role here */}
                  {user?.role && (
                    <li>
                      <span
                        className="dropdown-item text-muted"
                        style={{ cursor: "default", fontStyle: "italic" }}
                      >
                        <i className="fas fa-user-tag me-2"></i>
                        Role:{" "}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </li>
                  )}

                  <li>
                    <a
                      className="dropdown-item"
                      href="/profile"
                      onClick={closeDropdown}
                    >
                      <i className="fas fa-user me-2"></i>Profile
                    </a>
                  </li>

                  <li>
                    <a
                      className="dropdown-item"
                      href="/settings"
                      onClick={closeDropdown}
                    >
                      <i className="fas fa-cog me-2"></i>Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        closeDropdown();
                        handleLogout();
                      }}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={handleSignIn}>
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* MOBILE NAVBAR */}
        <div className="d-flex d-md-none justify-content-between w-100 align-items-center">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-light"
              onClick={toggleSidebar}
              style={{ border: "none", background: "transparent" }}
            >
              <i
                className={`fas fa-${
                  isSidebarOpen ? "chevron-left" : "chevron-right"
                } fa-lg`}
              ></i>
            </button>
            <img
              src={userr}
              alt="admin"
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <h5 className="mb-0 fw-semibold text-dark">Admin</h5>
          </div>

          <button
            className="btn d-md-none"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            style={{ background: "transparent", border: "none" }}
          >
            <i className="fas fa-bars fa-lg text-white"></i>
          </button>
        </div>

        {isMobileNavOpen && (
          <div className="d-flex flex-column gap-3 mt-3 d-md-none">
            <div className="search-box d-flex flex-column position-relative border rounded px-3 py-2 bg-white w-100">
              <div className="d-flex align-items-center">
                <i
                  className="fas fa-search me-2 text-muted"
                  style={{ fontSize: "14px" }}
                ></i>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control border-0 shadow-none"
                  onChange={handleSearchChange}
                  value={searchTerm}
                />
              </div>

              {searchResults.length > 0 && (
                <div
                  className="bg-white border mt-2 rounded shadow-sm"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1050,
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="px-3 py-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      <strong>{user.name}</strong>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {user.email} — {user.role}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              <button className="btn btn-outline-secondary">
                <i className="fas fa-envelope"></i>
              </button>
              <div
                className="position-relative"
                onClick={handleNotificationClick}
              >
                <button className="btn btn-outline-secondary position-relative">
                  <i className="fas fa-bell"></i>
                  {notifications.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                      style={{ fontSize: "8px" }}
                    ></span>
                  )}
                </button>
                {showDropdown && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      minWidth: "250px",
                      maxHeight: "300px",
                      overflow: "auto",
                      zIndex: 1000,
                      backgroundColor: "#fff",
                      borderRadius: "5px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {notifications.length === 0 ? (
                      <span className="dropdown-item text-muted">
                        No Notifications
                      </span>
                    ) : (
                      notifications
                        .slice()
                        .reverse()
                        .map((n, i) => (
                          <span key={i} className="dropdown-item">
                            {n.message}
                          </span>
                        ))
                    )}
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <div className="dropdown" style={{ position: "relative" }}>
                  <button
                    className={`btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle ${
                      dropdownOpen ? "show" : ""
                    }`}
                    type="button"
                    id="dropdownUser"
                    aria-expanded={dropdownOpen}
                    onClick={toggleDropdown}
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
                        ?.split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ") ||
                        user?.email ||
                        "User"}
                      {/* {user?.role ? ` (${user.role})` : ""} */}
                    </span>
                  </button>

                  <ul
                    className={`dropdown-menu dropdown-menu-end ${
                      dropdownOpen ? "show" : ""
                    }`}
                    aria-labelledby="dropdownUser"
                    style={{ position: "absolute" }}
                  >
                    {/* Show user role here */}
                    {user?.role && (
                      <li>
                        <span
                          className="dropdown-item text-muted"
                          style={{ cursor: "default", fontStyle: "italic" }}
                        >
                          <i className="fas fa-user-tag me-2"></i>
                          Role:{" "}
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </li>
                    )}
                    <li>
                      <a
                        className="dropdown-item"
                        href="/profile"
                        onClick={closeDropdown}
                      >
                        <i className="fas fa-user me-2"></i>Profile
                      </a>
                    </li>

                    <li>
                      <a
                        className="dropdown-item"
                        href="/settings"
                        onClick={closeDropdown}
                      >
                        <i className="fas fa-cog me-2"></i>Settings
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          closeDropdown();
                          handleLogout();
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button className="btn btn-secondary" onClick={handleSignIn}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;



// import React, { useEffect, useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import userPlaceholder from "../assets/userr.jpg";
// import { io } from "socket.io-client";
// import toast from "react-hot-toast";
// import { debounce } from "lodash";
// import axios from "axios";

// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Navbar({ toggleSidebar, isSidebarOpen }) {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const { isLoggedIn, logout, user, token } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const toggleDropdown = () => setDropdownOpen((prev) => !prev);
//   const closeDropdown = () => setDropdownOpen(false);
//   const handleSignIn = () => navigate("/login");
//   const handleLogout = () => logout();
//   const handleNotificationClick = () => setShowDropdown((prev) => !prev);

//   const fetchSearchResults = debounce(async (term) => {
//     if (!term) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:5001/auth/search?q=${term}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setSearchResults(res.data);
//     } catch (error) {
//       console.error("Search error", error);
//     }
//   }, 500);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (value.trim() === "") {
//       setSearchResults([]);
//       return;
//     }

//     fetchSearchResults(value);
//   };

//   // Socket to receive notifications
//   useEffect(() => {
//     const socket = io("http://localhost:5001");
//     socket.on("connect", () => console.log("Connected to socket server"));

//     socket.on("new-signup", (data) => {
//       const message = `New user signed up: ${data.name}`;
//       setNotifications((prev) => [...prev, { message }]);
//       // toast.success(message);
//     });

//     socket.on("new-notification", (data) => {
//       const message = data.message || "You have a new notification";
//       setNotifications((prev) => [...prev, { message }]);
//       // toast.success(message);
//     });

//     return () => socket.disconnect();
//   }, []);

//   return (
//     <nav
//       className="navbar fixed-top navbar-light"
//       style={{
//         background: "linear-gradient(135deg, #4b6cb7, #182848)",
//         padding: "10px 20px",
//         color: "white",
//         zIndex: 1040,
//       }}
//     >
//       <div className="container-fluid">
//         {/* DESKTOP NAVBAR */}
//         <div className="d-none d-md-flex justify-content-between align-items-center w-100">
//           <div className="d-flex align-items-center gap-2">
//             <Link to="/">
//               <img
//                 src={userPlaceholder}
//                 alt="admin"
//                 className="rounded-circle"
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   objectFit: "cover",
//                   cursor: "pointer",
//                 }}
//               />
//             </Link>
//             <h5 className="mb-0 fw-semibold text-white">Admin</h5>

//             <div
//               className="d-flex align-items-center gap-3"
//               style={{ marginLeft: "99px" }}
//             >
//               <button
//                 className="btn btn-outline-light"
//                 onClick={toggleSidebar}
//                 style={{ border: "none", background: "transparent" }}
//               >
//                 <i
//                   className={`fas fa-${
//                     isSidebarOpen ? "chevron-left" : "chevron-right"
//                   } fa-lg`}
//                 ></i>
//               </button>

//               <div
//                 className="search-box d-flex align-items-center position-relative border rounded-pill px-3 py-1 bg-white"
//                 style={{ width: "300px" }}
//               >
//                 <i
//                   className="fas fa-search me-2 text-muted"
//                   style={{ fontSize: "14px" }}
//                 ></i>
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="form-control border-0 shadow-none"
//                   onChange={handleSearchChange}
//                   value={searchTerm}
//                 />
//                 {searchResults.length > 0 && (
//                   <div
//                     className="position-absolute bg-white border mt-2 rounded shadow-sm"
//                     style={{
//                       top: "100%",
//                       left: 0,
//                       right: 0,
//                       zIndex: 1050,
//                       maxHeight: "200px",
//                       overflowY: "auto",
//                     }}
//                   >
//                     {searchResults.map((user) => (
//                       <div
//                         key={user.id}
//                         className="px-3 py-2 border-bottom"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => navigate(`/users/${user.id}`)}
//                       >
//                         <strong>{user.name}</strong>
//                         <div
//                           className="text-muted"
//                           style={{ fontSize: "0.85rem" }}
//                         >
//                           {user.email} — {user.role}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="d-flex align-items-center gap-3">
//             {/* Notification Button */}
//             <div className="position-relative" onClick={handleNotificationClick}>
//               <button className="btn btn-outline-secondary position-relative">
//                 <i className="fas fa-bell"></i>
//                 {notifications.length > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
//                     style={{ fontSize: "8px" }}
//                   ></span>
//                 )}
//               </button>

//               {showDropdown && (
//                 <div
//                   className="dropdown-menu show"
//                   style={{
//                     position: "absolute",
//                     right: 0,
//                     top: "100%",
//                     minWidth: "250px",
//                     maxHeight: "300px",
//                     overflow: "auto",
//                     zIndex: 1000,
//                     backgroundColor: "#fff",
//                     borderRadius: "5px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//                   }}
//                 >
//                   {notifications.slice(0, 5).map((n, i) => (
//                     <span key={i} className="dropdown-item">
//                       {n.message}
//                     </span>
//                   ))}
//                   {notifications.length > 1 && (
//                     <button
//                       className="dropdown-item text-primary"
//                       onClick={() => navigate("/notifications")}
//                     >
//                       View All Notifications
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* User Dropdown */}
//             {isLoggedIn ? (
//               <div className="dropdown" style={{ position: "relative" }}>
//                 <button
//                   className={`btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle ${
//                     dropdownOpen ? "show" : ""
//                   }`}
//                   type="button"
//                   id="dropdownUser"
//                   aria-expanded={dropdownOpen}
//                   onClick={toggleDropdown}
//                 >
//                   <img
//                     src={userPlaceholder}
//                     alt="User"
//                     className="rounded-circle"
//                     width="35"
//                     height="35"
//                   />
//                   <span>
//                     {user?.name
//                       ?.split(" ")
//                       .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//                       .join(" ") ||
//                       user?.email ||
//                       "User"}
//                   </span>
//                 </button>

//                 <ul
//                   className={`dropdown-menu dropdown-menu-end ${
//                     dropdownOpen ? "show" : ""
//                   }`}
//                   aria-labelledby="dropdownUser"
//                   style={{ position: "absolute" }}
//                 >
//                   {user?.role && (
//                     <li>
//                       <span
//                         className="dropdown-item text-muted"
//                         style={{ cursor: "default", fontStyle: "italic" }}
//                       >
//                         <i className="fas fa-user-tag me-2"></i>
//                         Role:{" "}
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                       </span>
//                     </li>
//                   )}
//                   <li>
//                     <a
//                       className="dropdown-item"
//                       href="/profile"
//                       onClick={closeDropdown}
//                     >
//                       <i className="fas fa-user me-2"></i>
//                       Profile
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       className="dropdown-item"
//                       href="/settings"
//                       onClick={closeDropdown}
//                     >
//                       <i className="fas fa-cogs me-2"></i>
//                       Settings
//                     </a>
//                   </li>
//                   <li>
//                     <hr className="dropdown-divider" />
//                   </li>
//                   <li>
//                     <a
//                       className="dropdown-item text-danger"
//                       href="#"
//                       onClick={() => {
//                         handleLogout();
//                         closeDropdown();
//                       }}
//                     >
//                       <i className="fas fa-sign-out-alt me-2"></i>
//                       Logout
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             ) : (
//               <button className="btn btn-outline-light" onClick={handleSignIn}>
//                 Sign In
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



// import React, { useEffect, useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import userPlaceholder from "../assets/userr.jpg";
// import { io } from "socket.io-client";
// import toast from "react-hot-toast";
// import { debounce } from "lodash";
// import axios from "axios";

// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Navbar({ toggleSidebar, isSidebarOpen }) {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const { isLoggedIn, logout, user, token } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Toggle Dropdown
//   const toggleDropdown = () => setDropdownOpen((prev) => !prev);
//   const closeDropdown = () => setDropdownOpen(false);

//   // Handle Sign In and Logout
//   const handleSignIn = () => navigate("/login");
//   const handleLogout = () => logout();

//   // Toggle Notification Dropdown
//   const handleNotificationClick = () => setShowDropdown((prev) => !prev);

//   // Capitalize name helper function
//   const capitalizeName = (name) => {
//     return name
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   // Search handling with debounce
//   const fetchSearchResults = debounce(async (term) => {
//     if (!term) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:5001/auth/search?q=${term}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setSearchResults(res.data);
//     } catch (error) {
//       console.error("Search error", error);
//     }
//   }, 500);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (value.trim() === "") {
//       setSearchResults([]);
//       return;
//     }

//     fetchSearchResults(value);
//   };

//   // Socket for real-time notifications
//   useEffect(() => {
//     const socket = io("http://localhost:5001");

//     socket.on("connect", () => console.log("Connected to socket server"));

//     socket.on("new-signup", (data) => {
//       const message = `New user signed up: ${data.name}`;
//       setNotifications((prev) => [...prev, { message }]);
//       toast.success(message);
//     });

//     socket.on("new-notification", (data) => {
//       const message = data.message || "You have a new notification";
//       setNotifications((prev) => [...prev, { message }]);
//       toast.success(message);
//     });

//     // Cleanup socket on unmount
//     return () => socket.disconnect();
//   }, []);

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownOpen && !event.target.closest(".dropdown")) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   return (
//     <nav
//       className="navbar fixed-top navbar-light"
//       style={{
//         background: "linear-gradient(135deg, #4b6cb7, #182848)",
//         padding: "10px 20px",
//         color: "white",
//         zIndex: 1040,
//       }}
//     >
//       <div className="container-fluid">
//         {/* DESKTOP NAVBAR */}
//         <div className="d-none d-md-flex justify-content-between align-items-center w-100">
//           <div className="d-flex align-items-center gap-2">
//             <Link to="/">
//               <img
//                 src={userPlaceholder}
//                 alt="admin"
//                 className="rounded-circle"
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   objectFit: "cover",
//                   cursor: "pointer",
//                 }}
//               />
//             </Link>
//             <h5 className="mb-0 fw-semibold text-white">Admin</h5>

//             <div
//               className="d-flex align-items-center gap-3"
//               style={{ marginLeft: "99px" }}
//             >
//               <button
//                 className="btn btn-outline-light"
//                 onClick={toggleSidebar}
//                 style={{ border: "none", background: "transparent" }}
//               >
//                 <i
//                   className={`fas fa-${
//                     isSidebarOpen ? "chevron-left" : "chevron-right"
//                   } fa-lg`}
//                 ></i>
//               </button>

//               <div
//                 className="search-box d-flex align-items-center position-relative border rounded-pill px-3 py-1 bg-white"
//                 style={{ width: "300px" }}
//               >
//                 <i
//                   className="fas fa-search me-2 text-muted"
//                   style={{ fontSize: "14px" }}
//                 ></i>
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="form-control border-0 shadow-none"
//                   onChange={handleSearchChange}
//                   value={searchTerm}
//                 />
//                 {searchResults.length > 0 && (
//                   <div
//                     className="position-absolute bg-white border mt-2 rounded shadow-sm"
//                     style={{
//                       top: "100%",
//                       left: 0,
//                       right: 0,
//                       zIndex: 1050,
//                       maxHeight: "200px",
//                       overflowY: "auto",
//                     }}
//                   >
//                     {searchResults.map((user) => (
//                       <div
//                         key={user.id}
//                         className="px-3 py-2 border-bottom"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => navigate(`/users/${user.id}`)}
//                       >
//                         <strong>{user.name}</strong>
//                         <div
//                           className="text-muted"
//                           style={{ fontSize: "0.85rem" }}
//                         >
//                           {user.email} — {user.role}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="d-flex align-items-center gap-3">
//             {/* Notification Button */}
//             <div className="position-relative" onClick={handleNotificationClick}>
//               <button className="btn btn-outline-secondary position-relative">
//                 <i className="fas fa-bell"></i>
//                 {notifications.length > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
//                     style={{ fontSize: "8px" }}
//                   ></span>
//                 )}
//               </button>

//               {showDropdown && (
//                 <div
//                   className="dropdown-menu show"
//                   style={{
//                     position: "absolute",
//                     right: 0,
//                     top: "100%",
//                     minWidth: "250px",
//                     maxHeight: "300px",
//                     overflow: "auto",
//                     zIndex: 1000,
//                     backgroundColor: "#fff",
//                     borderRadius: "5px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//                   }}
//                 >
//                   {notifications.slice(0, 5).map((n, i) => (
//                     <span key={i} className="dropdown-item">
//                       {n.message}
//                     </span>
//                   ))}
//                   {notifications.length > 1 && (
//                     <button
//                       className="dropdown-item text-primary"
//                       onClick={() => navigate("/notifications")}
//                     >
//                       View All Notifications
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* User Dropdown */}
//             {isLoggedIn ? (
//               <div className="dropdown" style={{ position: "relative" }}>
//                 <button
//                   className={`btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle ${
//                     dropdownOpen ? "show" : ""
//                   }`}
//                   type="button"
//                   id="dropdownUser"
//                   aria-expanded={dropdownOpen ? "true" : "false"} // ARIA for toggling
//                   onClick={toggleDropdown}
//                 >
//                   <img
//                     src={userPlaceholder}
//                     alt="User"
//                     className="rounded-circle"
//                     width="35"
//                     height="35"
//                   />
//                   <span>{user?.name ? capitalizeName(user.name) : "User"}</span>
//                 </button>

//                 <ul
//                   className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`}
//                   aria-labelledby="dropdownUser"
//                   style={{ position: "absolute" }}
//                 >
//                   {user?.role && (
//                     <li>
//                       <span
//                         className="dropdown-item text-muted"
//                         style={{ cursor: "default", fontStyle: "italic" }}
//                       >
//                         <i className="fas fa-user-tag me-2"></i>
//                         Role:{" "}
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                       </span>
//                     </li>
//                   )}
//                   <li>
//                     <a
//                       className="dropdown-item"
//                       href="/profile"
//                       onClick={closeDropdown}
//                     >
//                       <i className="fas fa-user me-2"></i>
//                       Profile
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       className="dropdown-item"
//                       href="/settings"
//                       onClick={closeDropdown}
//                     >
//                       <i className="fas fa-cogs me-2"></i>
//                       Settings
//                     </a>
//                   </li>
//                   <li>
//                     <hr className="dropdown-divider" />
//                   </li>
//                   <li>
//                     <a
//                       className="dropdown-item text-danger"
//                       href="#"
//                       onClick={() => {
//                         handleLogout();
//                         closeDropdown();
//                       }}
//                     >
//                       <i className="fas fa-sign-out-alt me-2"></i>
//                       Logout
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             ) : (
//               <button className="btn btn-outline-light" onClick={handleSignIn}>
//                 Sign In
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
