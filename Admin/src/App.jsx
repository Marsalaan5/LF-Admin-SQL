import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'react-datepicker/dist/react-datepicker.css';
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import RoleManagement from "./pages/RoleManagement.jsx";
import AuthLayout from "./pages/AuthLayout.jsx";
import Profile from "./pages/Profile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
// import Categories from "./pages/Category.jsx";
import Category from "./pages/Category.jsx";
import ComplaintManagement from "./pages/ComplaintManagement.jsx";
import Complaint from "./pages/Complaint.jsx";
import { Toaster } from 'react-hot-toast';
// import MenuManager from "./pages/MenuManagement.jsx";
import MenuManagement from "./pages/MenuManagement.jsx";
// import { ComplaintProvider } from "./context/ComplaintContext.jsx"; // Adjust path if needed


function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
            <Toaster position="top-right" reverseOrder={false} />
      {/* <ComplaintProvider> ✅ Add this wrapper here */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users/:id" element={<UserProfile />} />

          {isLoggedIn ? (
            <>
              <Route path="/" element={<AuthLayout><Dashboard /></AuthLayout>} />
              <Route path="/user_management" element={<AuthLayout><UserManagement /></AuthLayout>} />
              <Route path="/role_management" element={<AuthLayout><RoleManagement /></AuthLayout>} />
              <Route path="/roles/:roleId/permissions" element={<AuthLayout><RoleManagement /></AuthLayout>} />
              <Route path="/category" element={<AuthLayout><Category /></AuthLayout>} />
              <Route path="/complaints_management" element={<AuthLayout><ComplaintManagement /></AuthLayout>} />
              <Route path="/complaints" element={<AuthLayout><Complaint /></AuthLayout>} />
              <Route path="/menu_management" element={<AuthLayout><MenuManagement  userRole="Super Admin" /></AuthLayout>} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/user_management" element={<Navigate to="/login" />} />
              <Route path="/role_management" element={<Navigate to="/login" />} />
              <Route path="/roles/:roleId/permissions" element={<Navigate to="/login" />} />
              <Route path="/category" element={<Navigate to="/login" />} />
              <Route path="/complaints_management" element={<Navigate to="/login" />} />
              <Route path="/complaints" element={<Navigate to="/login" />} />
              <Route path="/menu_management" element={<Navigate to="/login" />} />

              <Route path="/users/:id" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      {/* </ComplaintProvider> */}
    </Router>
  );
}


export default App;