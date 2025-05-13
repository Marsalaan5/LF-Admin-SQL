import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
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

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
                  {/* <UserManagement /> */}
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
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/user_management" element={<Navigate to="/login" />} />
            <Route path="/role_management" element={<Navigate to="/login" />} />
            {/* <Route path="/roles/:roleId/permissions" element={<RoleManagement />} /> */}
            <Route
              path="/roles/:roleId/permissions"
              element={<Navigate to="/login" />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
