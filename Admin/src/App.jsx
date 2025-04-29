
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState,useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import UserManagement from "./pages/UserManagement.jsx";

// function App() {

//   const { isLoggedIn } = useContext(AuthContext);

//   return (
//     <Router>
//       <div>
//         {isLoggedIn && (
//           <div
//             className="col-2 p-0"
//             style={{ position: "fixed", top: 65, left: 0, height: "100vh", width: "250px" }}
//           >
//             <Sidebar />
//           </div>
//         )}
        
//         {isLoggedIn && <Navbar />}

//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           {/* <Route path="/user_management" element={<UserManagement />} /> */}
//           <Route 
//             path="/" 
//             element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
//           />

// <Route
//             path="/user_management"
//             element={isLoggedIn ? <UserManagement /> : <Navigate to="/login" />}
//           />
         
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



function App() {
  const { isLoggedIn } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Add this

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <Router>
      <div>
        {isLoggedIn && (
          <div
            className="col-2 p-0"
            style={{
              position: "fixed",
              top: 65,
              left: 0,
              height: "100vh",
              width: isSidebarOpen ? "250px" : "0px",
              overflow: "hidden",
              transition: "width 0.3s ease"
            }}
          >
            <Sidebar isOpen={isSidebarOpen} />
          </div>
        )}

        {isLoggedIn && <Navbar toggleSidebar={toggleSidebar} />}

        <div
          style={{
            marginLeft: isLoggedIn && isSidebarOpen ? "200px" : "0px",
            transition: "margin-left 0.3s ease"
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/user_management"
              element={isLoggedIn ? <UserManagement /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

