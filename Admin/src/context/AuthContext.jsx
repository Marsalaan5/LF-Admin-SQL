// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);

//   // const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user")
//     if(storedToken && storedUser){
//       setIsLoggedIn(true)
//       setToken(storedToken)
//       try {
//       setUser(JSON.parse(storedUser))
//     } catch (error) {
//       console.error("Failed to parse user from localStorage", error);
//       localStorage.removeItem("user");
//     }
//     }
//       // setIsAuthenticated(true);
//   }, []);


//   const login = (newToken, user) => {
//     localStorage.setItem("token", newToken);
//       localStorage.setItem("user", JSON.stringify(user));
    
//     setToken(newToken);
//     setIsLoggedIn(true);
//     setUser(user);
//   };
  

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null)
//     setToken(null);
//     setIsLoggedIn(false);
//     // setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn,login, logout, token, user}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;



import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);  // Default to an empty array

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedPermissions = localStorage.getItem("permissions");

    if (storedToken && storedUser && storedPermissions) {
      setIsLoggedIn(true);
      setToken(storedToken);
      
      try {
        // Try parsing storedPermissions, default to empty array if invalid
        const parsedPermissions = JSON.parse(storedPermissions);
        setPermissions(parsedPermissions || []);
      } catch (error) {
        console.error("Failed to parse permissions from localStorage", error);
        setPermissions([]);  // Default to an empty array on error
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
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
    setPermissions([]);  // Reset to an empty array
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token, user, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
