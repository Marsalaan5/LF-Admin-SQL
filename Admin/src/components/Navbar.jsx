// import React, {useEffect, useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import userPlaceholder from "../assets/userr.jpg";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import userr from "../assets/userr.jpg";
// import { io } from "socket.io-client";
// import toast from "react-hot-toast";

// function Navbar({ toggleSidebar }) {

//   const [notifications,setNotifications] = useState([])
//   const [showDropdown,setShowDropdown]= useState(false)

//   const { isLoggedIn, logout, user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSignIn = () => navigate("/login");
//   const handleLogout = () => logout();

//   useEffect(() => {
//    const socket = io("http://localhost:5001")

//    socket.on("connect",()=>{
//     console.log("Connected to socket server")
//    })

//    socket.on ("new-signup",(data)=>{
//     setNotifications((prev)=> [...prev,{message:`New user:${data.name}`}])
//     toast.success( `New user signed up:${data.name}`)
//    })
//     return () => socket.disconnect()
//   }, [])

//   const handleNotificationClick =()=>{
//     setShowDropdown((prev) => !prev)
//   }

//   return (
//     <nav
//       className="navbar fixed-top navbar-light"
//       // style={{ background: "pink" }}
//       style={{
//         background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
//         // borderRadius: '10px',
//         padding: '20px',
//         color: 'white',
//       }}>

//       <div className="container-fluid">
//         <div className="row w-100 align-items-center">
//           <div className="col-2 d-flex align-items-center gap-2">
//             <img
//               src={userr}
//               alt="admin"
//               className="rounded-circle"
//               style={{ width: "40px", height: "40px", objectFit: "cover" }}
//             />
//             <h5 className="mb-0 fw-semibold text-dark">Admin</h5>
//           </div>

//           <div className="col-2 d-flex align-items-center justify-content-center gap-3">
//             <button
//               className="btn btn-outline-secondary"
//               onClick={toggleSidebar}
//             >
//               <i className="fas fa-bars"></i>
//             </button>
//             <div
//               className="search-box d-flex align-items-center border rounded-pill px-3 py-1 bg-white w-100"
//               style={{ maxWidth: "300px" }}
//             >
//               <i
//                 className="fas fa-search me-2 text-muted"
//                 style={{ fontSize: "14px" }}
//               ></i>
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="form-control border-0 shadow-none"
//               />
//             </div>
//           </div>

//           <div className="col-8 d-flex align-items-center justify-content-end gap-3">
//             <button className="btn btn-outline-secondary">
//               <i className="fas fa-envelope"></i>
//               </button>
//             <div className="position-relative" onClick={handleNotificationClick}>
//               <button className="btn btn-outline-secondary">
//                 <i className="fas fa-bell"></i>
//               {notifications.length > 0 && (
//                 <span className="position-absolute top-0 start-100 translate-middle  p-1 bg-danger border border-light rounded-circle" style={{fontSize:"8px"}}></span>
//               )}
//             </button>
// {showDropdown && (
//   <div className="dropdown-menu show" style={{
//     position:"absolute",
//     right:0,
//     top:"100%",
//     minWidth:"250px",
//     maxHeight:"300px",
//     overflow:"auto",
//     zIndex:1000,
//   }}>
// {notifications.length === 0 ? (
//   <span className="dropdown-item text-muted">No Notifications</span>
// ):(
//   notifications.slice().reverse().map((n,i)=>(
//     <span key={i} className="dropdown-item">
//       {n.message}
//     </span>
//   ))

// )}

//   </div>
// )}

//             </div>

//             {isLoggedIn ? (
//               <div className="dropdown">
//                 <button
//                   className="btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle"
//                   type="button"
//                   id="dropdownUser"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
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
//                       .toLowerCase()
//                       .split(" ")
//                       .map(
//                         (word) => word.charAt(0).toUpperCase() + word.slice(1)
//                       )
//                       .join(" ") ||
//                       user?.email ||
//                       "User"}
//                          {user?.role ? ` (${user.role})` : ""}
//                   </span>
//                 </button>
//                 <ul
//                   className="dropdown-menu dropdown-menu-end"
//                   aria-labelledby="dropdownUser"
//                 >
//                   <li>
//                     <a className="dropdown-item" href="/profile">
//                       <i className="fas fa-user me-2"></i>Profile
//                     </a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="/settings">
//                       <i className="fas fa-cog me-2"></i>Settings
//                     </a>
//                   </li>
//                   <li>
//                     <hr className="dropdown-divider" />
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item text-danger"
//                       onClick={handleLogout}
//                     >
//                       <i className="fas fa-sign-out-alt me-2"></i>Logout
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             ) : (
//               <button className="btn btn-secondary" onClick={handleSignIn}>
//                 SignIn
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
// import { useNavigate } from "react-router-dom";
// import userPlaceholder from "../assets/userr.jpg";
// import userr from "../assets/userr.jpg";
// import { io } from "socket.io-client";
// import toast from "react-hot-toast";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Navbar({ toggleSidebar }) {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const { isLoggedIn, logout, user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSignIn = () => navigate("/login");
//   const handleLogout = () => logout();
//   const handleNotificationClick = () => setShowDropdown((prev) => !prev);

//   useEffect(() => {
//     const socket = io("http://localhost:5001");

//     socket.on("connect", () => {
//       console.log("Connected to socket server");
//     });

//     socket.on("new-signup", (data) => {
//       setNotifications((prev) => [...prev, { message: `New user: ${data.name}` }]);
//       toast.success(`New user signed up: ${data.name}`);
//     });

//     return () => socket.disconnect();
//   }, []);

//   return (
//     <nav
//       className="navbar navbar-expand-md navbar-light fixed-top"
//       style={{
//         height:"88px",
//         background: "linear-gradient(to right, #ff7e5f, #feb47b)",
//         padding: "10px 20px",
//         color: "white",
//         zIndex: 1040,
//       }}
//     >
//       <div className="container-fluid">
//         {/* Left side: toggle + avatar */}
//         <div className="d-flex align-items-center gap-3">
//           {/* Sidebar toggle button */}

//           <img
//             src={userr}
//             alt="admin"
//             className="rounded-circle"
//             style={{ width: "40px", height: "40px", objectFit: "cover" }}
//           />
//           <h5 className="mb-0 fw-semibold text-dark">Admin</h5>
//         </div>

//         {/* Bootstrap navbar toggler for collapsing (optional) */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarResponsive"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Right side: navbar content */}
//         <div className="collapse navbar-collapse" id="navbarResponsive">
//           <div className="ms-auto d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 w-100 mt-3 mt-md-0">
//  <button
//             className="btn btn-outline-light"
//             onClick={toggleSidebar}
//             style={{ border: "none", background: "transparent" }}
//           >
//             <i className="fas fa-bars fa-lg"></i>
//           </button>
//             {/* Search Bar */}
//             <div className="search-box d-flex align-items-center border rounded-pill px-3 py-1 bg-white w-100" style={{ maxWidth: "300px" }}>
//               <i className="fas fa-search me-2 text-muted" style={{ fontSize: "14px" }}></i>
//               <input type="text" placeholder="Search" className="form-control border-0 shadow-none" />
//             </div>

//             {/* Icons and user section */}
//             <div className="d-flex align-items-center gap-3">

//               <button className="btn btn-outline-secondary">
//                 <i className="fas fa-envelope"></i>
//               </button>

//               {/* Notifications */}
//               <div className="position-relative" onClick={handleNotificationClick}>
//                 <button className="btn btn-outline-secondary position-relative">
//                   <i className="fas fa-bell"></i>
//                   {notifications.length > 0 && (
//                     <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ fontSize: "8px" }}></span>
//                   )}
//                 </button>
//                 {showDropdown && (
//                   <div
//                     className="dropdown-menu show"
//                     style={{
//                       position: "absolute",
//                       right: 0,
//                       top: "100%",
//                       minWidth: "250px",
//                       maxHeight: "300px",
//                       overflow: "auto",
//                       zIndex: 1000,
//                     }}
//                   >
//                     {notifications.length === 0 ? (
//                       <span className="dropdown-item text-muted">No Notifications</span>
//                     ) : (
//                       notifications.slice().reverse().map((n, i) => (
//                         <span key={i} className="dropdown-item">
//                           {n.message}
//                         </span>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* User dropdown */}
//               {isLoggedIn ? (
//                 <div className="dropdown">
//                   <button
//                     className="btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle"
//                     type="button"
//                     id="dropdownUser"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     <img
//                       src={userPlaceholder}
//                       alt="User"
//                       className="rounded-circle"
//                       width="35"
//                       height="35"
//                     />
//                     <span>
//                       {user?.name
//                         ?.split(" ")
//                         .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//                         .join(" ") || user?.email || "User"}
//                       {user?.role ? ` (${user.role})` : ""}
//                     </span>
//                   </button>
//                   <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUser">
//                     <li>
//                       <a className="dropdown-item" href="/profile">
//                         <i className="fas fa-user me-2"></i>Profile
//                       </a>
//                     </li>
//                     <li>
//                       <a className="dropdown-item" href="/settings">
//                         <i className="fas fa-cog me-2"></i>Settings
//                       </a>
//                     </li>
//                     <li><hr className="dropdown-divider" /></li>
//                     <li>
//                       <button className="dropdown-item text-danger" onClick={handleLogout}>
//                         <i className="fas fa-sign-out-alt me-2"></i>Logout
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               ) : (
//                 <button className="btn btn-secondary" onClick={handleSignIn}>
//                   Sign In
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userPlaceholder from "../assets/userr.jpg";
import userr from "../assets/userr.jpg";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Navbar({ toggleSidebar, isSidebarOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = () => navigate("/login");
  const handleLogout = () => logout();
  const handleNotificationClick = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    const socket = io("http://localhost:5001");
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
    socket.on("new-signup", (data) => {
      setNotifications((prev) => [
        ...prev,
        { message: `New user: ${data.name}` },
      ]);
      toast.success(`New user signed up: ${data.name}`);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <nav
      className="navbar fixed-top navbar-light"
      style={{
        height: "88px",
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
        padding: "10px 20px",
        color: "white",
        zIndex: 1040,
      }}
    >
      <div className="container-fluid">
        <div className="row w-100 align-items-center">
          {/* Column 1: Avatar + Title */}
          <div className="col-12 col-md-2 d-flex align-items-center gap-3 mb-2 mb-md-0">
            <img
              src={userr}
              alt="admin"
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <h5 className="mb-0 fw-semibold text-dark">Admin</h5>
          </div>

          {/* Column 2: Toggle button + Search */}
          <div className="col-12 col-md-2 d-flex align-items-center gap-3 mb-2 mb-md-0">
            {/* <button
              className="btn btn-outline-light"
              onClick={toggleSidebar}
              style={{ border: "none", background: "transparent" }}
            >
              <i className="fas fa-bars fa-lg"></i>
            </button> */}
            <button
              className="btn btn-outline-light"
              onClick={toggleSidebar}
              style={{ border: "none", background: "transparent" }}
              aria-label="Toggle Sidebar"
            >
              <i
                className={`fas fa-${
                  isSidebarOpen ? "chevron-left" : "chevron-right"
                } fa-lg`}
              ></i>
            </button>

            <div
              className="search-box d-flex align-items-center border rounded-pill px-3 py-1 bg-white w-100"
              style={{ maxWidth: "400px" }}
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

          {/* Column 3: Mail + Notifications + Profile */}
          <div className="col-12 col-md-8 d-flex justify-content-end align-items-center gap-3">
            <button className="btn btn-outline-secondary">
              <i className="fas fa-envelope"></i>
            </button>

            {/* Notifications */}
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

            {/* User Profile */}
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
                      ?.split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
