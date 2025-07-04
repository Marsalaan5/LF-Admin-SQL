import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedPermissions = localStorage.getItem("permissions");

    if (storedToken && storedUser && storedPermissions) {
      setIsLoggedIn(true);
      setToken(storedToken);

      try {
        const parsedPermissions = JSON.parse(storedPermissions);
        setPermissions(parsedPermissions || []);
      } catch (error) {
        console.error("Failed to parse permissions from localStorage", error);
        setPermissions([]); // Default to an empty array on error
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken, newUser, newPermissions) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("permissions", JSON.stringify(newPermissions));

    setToken(newToken);
    setIsLoggedIn(true);
    setUser(newUser);
    setPermissions(newPermissions);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    setUser(null);
    setToken(null);
    setPermissions([]);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, login, logout, token, user, permissions }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
