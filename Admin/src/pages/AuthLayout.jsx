

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";


// const MobileOverlay = ({ onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       position: "fixed",
//       top: "0",
//       left: "0",
//       width: "100vw",
//       height: "100vh",
//       backgroundColor: "rgba(0,0,0,0.5)",
//       zIndex: 998,
//     }}
//   />
// );


const MobileOverlay = ({ onClick, sidebarWidth }) => (
  <div
    onClick={onClick}
    style={{
      position: "fixed",
      top: 0,
      left: sidebarWidth, // start just after sidebar
      width: `calc(100vw - ${sidebarWidth}px)`, // rest of screen
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 998,
    }}
  />
);


function AuthLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const storedUser = JSON.parse(localStorage.getItem("user")); 
  const userRole = storedUser?.role;


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); 
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarStyles = {
    width: isSidebarOpen ? "250px" : "70px",
    transition: "left 0.3s, width 0.3s",
    height: "100vh",
    position: isMobile ? "fixed" : "fixed",
    top: "60px",
    left: isSidebarOpen ? "0" : isMobile ? "-250px" : "0",
    zIndex: 1001,
    backgroundColor: "#fff",
    boxShadow: isMobile && isSidebarOpen ? "2px 0 5px rgba(0,0,0,0.3)" : "none",
   
      overflow: "visible",
 
    
  };

  const mainContentStyles = {
  marginLeft: isMobile ? "0px" : isSidebarOpen ? "260px" : "70px",
  transition: "margin-left 0.3s",
  width: "100%",
  position: "relative",
  zIndex: 1,
};


  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />


      {/* {isMobile && isSidebarOpen && <MobileOverlay onClick={toggleSidebar} />} */}
      {isMobile && isSidebarOpen && (
  <MobileOverlay onClick={toggleSidebar} sidebarWidth={250} />
)}


     
      <div style={{ display: "flex", position: "relative", zIndex: 0, overflow: "visible" }}>


        <div style={sidebarStyles}>
          <Sidebar isOpen={isSidebarOpen} userRole={userRole} isMobile={isMobile} />
        </div>

    
        <div style={mainContentStyles}>{children}</div>
      </div>
    </>
  );
}

export default AuthLayout;



// import { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// // Mobile overlay for sidebar
// const MobileOverlay = ({ onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100vw",
//       height: "100vh",
//       backgroundColor: "rgba(0,0,0,0.5)",
//       zIndex: 998,
//     }}
//   />
// );

// function AuthLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

//   const storedUser = JSON.parse(localStorage.getItem("user")); // assuming 'user' is the key
//   const userRole = storedUser?.role;

//   // Detect screen size
//   useEffect(() => {
//     const handleResize = () => {
//       const isNowMobile = window.innerWidth < 768;
//       setIsMobile(isNowMobile);
//       if (!isNowMobile) setIsSidebarOpen(true);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const sidebarStyles = {
//     width: isSidebarOpen ? "250px" : "0",
//     transition: "left 0.3s, width 0.3s",
//     height: "100vh",
//     position: "fixed",
//     top: "60px",
//     left: isSidebarOpen ? "0" : isMobile ? "-250px" : "0",
//     zIndex: 999,
//     backgroundColor: "#fff",
//     boxShadow: isMobile && isSidebarOpen ? "2px 0 5px rgba(0,0,0,0.3)" : "none",
//     overflowX: "hidden",
//   };

//   const mainContentStyles = {
//     marginLeft: !isMobile && isSidebarOpen ? "250px" : "0",
//     transition: "margin-left 0.3s",
//     width: "100%",
//     padding: "20px", // Optional: for spacing
//   };

//   return (
//     <>
//       <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

//       {/* Mobile overlay */}
//       {isMobile && isSidebarOpen && <MobileOverlay onClick={toggleSidebar} />}

//       <div style={{ display: "flex" }}>
//         {/* Sidebar */}
//         <div style={sidebarStyles}>
//           <Sidebar isOpen={isSidebarOpen} userRole={userRole} />
//         </div>

//         {/* Main Content */}
//         <div style={mainContentStyles}>
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// }

// export default AuthLayout;
