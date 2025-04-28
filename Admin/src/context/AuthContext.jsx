import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user")
    if(storedToken && storedUser){
      setIsLoggedIn(true)
      setToken(storedToken)
      try {
      setUser(JSON.parse(storedUser))
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    }
    }
      // setIsAuthenticated(true);
  }, []);


  const login = (newToken, user) => {
    localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(user));
    
    setToken(newToken);
    setIsLoggedIn(true);
    setUser(user);
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null)
    setToken(null);
    setIsLoggedIn(false);
    // setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,login, logout, token, user}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
