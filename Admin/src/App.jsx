import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-datepicker/dist/react-datepicker.css";
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
// import Category from "./pages/Category.jsx";
import ComplaintManagement from "./pages/ComplaintManagement.jsx";
import Complaint from "./pages/Complaint.jsx";
import { Toaster } from "react-hot-toast";
// import MenuManager from "./pages/MenuManagement.jsx";
import MenuManagement from "./pages/MenuManagement.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Category from "./components/submenu/Category.jsx";
import SubCategory from "./components/submenu/SubCategory.jsx";
import TrackComplaint from "./pages/TrackComplaint.jsx";
// import Ccms from "./components/submenu/Ccms.jsx";
// import Water from "./components/submenu/Water.jsx";
// import ChatBotFlow from "./chatbot/ChatBotFlow.jsx";
// import { ComplaintProvider } from "./context/ComplaintContext.jsx"; // Adjust path if needed

function App() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:id" element={<UserProfile />} />

        {isLoggedIn ? (
          <>
            <Route
              path="/"
              element={
                <AuthLayout>
                  <Dashboard />
                </AuthLayout>
              }
            />
            <Route
              path="/user_management"
              element={
                <AuthLayout>
                  <UserManagement />
                </AuthLayout>
              }
            />
            <Route
              path="/role_management"
              element={
                <AuthLayout>
                  <RoleManagement />
                </AuthLayout>
              }
            />
            <Route
              path="/roles/:roleId/permissions"
              element={
                <AuthLayout>
                  <RoleManagement />
                </AuthLayout>
              }
            />
            <Route
              path="/category"
              element={
                <AuthLayout>
                  <Category />
                </AuthLayout>
              }
            />
            <Route
              path="/subcategories"
              element={
                <AuthLayout>
                  <SubCategory />
                </AuthLayout>
              }
            />
            <Route
              path="/track-complaints"
              element={
                <AuthLayout>
                  <TrackComplaint />
                </AuthLayout>
              }
            />
            {/* <Route
              path="/ccms"
              element={
                <AuthLayout>
                  <Ccms />
                </AuthLayout>
              }
            /> */}
            {/* <Route
              path="/water"
              element={
                <AuthLayout>
                  <Water />
                </AuthLayout>
              }
            /> */}
            <Route
              path="/complaints_management"
              element={
                <AuthLayout>
                  <ComplaintManagement />
                </AuthLayout>
              }
            />
            <Route
              path="/complaints"
              element={
                <AuthLayout>
                  <Complaint />
                </AuthLayout>
              }
            />
            <Route
              path="/menu_management"
              element={
                <AuthLayout>
                  <MenuManagement userRole="Super Admin" />
                </AuthLayout>
              }
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/user_management" element={<Navigate to="/login" />} />
            <Route path="/role_management" element={<Navigate to="/login" />} />
            <Route
              path="/roles/:roleId/permissions"
              element={<Navigate to="/login" />}
            />
            <Route path="/category" element={<Navigate to="/login" />} />
            <Route path="/subcategories" element={<Navigate to="/login" />} />
            {/* <Route path="/ccms" element={<Navigate to="/login" />} /> */}
            <Route
              path="/complaints_management"
              element={<Navigate to="/login" />}
            />
            <Route path="/complaints" element={<Navigate to="/login" />} />
            <Route path="/menu_management" element={<Navigate to="/login" />} />

            <Route path="/users/:id" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
      {/* <ChatBotFlow/> */}
    </Router>
  );
}

export default App;


// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "react-datepicker/dist/react-datepicker.css";
// import "./App.css";

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import { useContext } from "react";
// import { AuthContext } from "./context/AuthContext.jsx";

// import { Toaster } from "react-hot-toast";

// import AuthLayout from "./pages/AuthLayout.jsx";
// import PrivateRoute from "./components/PrivateRoute.jsx";

// // Public pages
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword.jsx";
// import ResetPassword from "./pages/ResetPassword.jsx";

// // Protected pages
// import Dashboard from "./components/Dashboard";
// import UserManagement from "./pages/UserManagement.jsx";
// import RoleManagement from "./pages/RoleManagement.jsx";
// import Profile from "./pages/Profile.jsx";
// import UserProfile from "./pages/UserProfile.jsx";
// import Category from "./pages/Category.jsx";
// import ComplaintManagement from "./pages/ComplaintManagement.jsx";
// import Complaint from "./pages/Complaint.jsx";
// import MenuManagement from "./pages/MenuManagement.jsx";

// function App() {
//   const { isLoading } = useContext(AuthContext);

//   if (isLoading) {
//     return <div className="text-center mt-5">Loading...</div>;
//   }

//   return (
//     <Router>
//       <Toaster position="top-right" reverseOrder={false} />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />

//         {/* Protected Routes */}
//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <AuthLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="users/:id" element={<UserProfile />} />
//           <Route path="user_management" element={<UserManagement />} />
//           <Route path="role_management" element={<RoleManagement />} />
//           <Route path="roles/:roleId/permissions" element={<RoleManagement />} />
//           <Route path="category" element={<Category />} />
//           <Route path="complaints_management" element={<ComplaintManagement />} />
//           <Route path="complaints" element={<Complaint />} />
//           <Route
//             path="menu_management"
//             element={<MenuManagement userRole="Super Admin" />}
//           />
//         </Route>

//         {/* Catch-all redirect */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

