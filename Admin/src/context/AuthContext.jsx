// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [permissions, setPermissions] = useState([]);

//   const hasPermission = (perm) => permissions?.includes(perm);


//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
//     const storedPermissions = localStorage.getItem("permissions");

//     if (storedToken && storedUser && storedPermissions) {
//       setIsLoggedIn(true);
//       setToken(storedToken);

//       try {
//         const parsedPermissions = JSON.parse(storedPermissions);
//         setPermissions(parsedPermissions || []);
//       } catch (error) {
//         console.error("Failed to parse permissions from localStorage", error);
//         setPermissions([]);
//       }

//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Failed to parse user from localStorage", error);
//         localStorage.removeItem("user");
//       }
//     }
//     setIsLoading(false);
//   }, []);

  // const login = (newToken, newUser, newPermissions) => {
  //   localStorage.setItem("token", newToken);
  //   localStorage.setItem("user", JSON.stringify(newUser));
  //   localStorage.setItem("permissions", JSON.stringify(newPermissions));

  //   setToken(newToken);
  //   setIsLoggedIn(true);
  //   setUser(newUser);
  //   setPermissions(newPermissions);
  // };

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("permissions");
  //   setUser(null);
  //   setToken(null);
  //   setPermissions([]);
  //   setIsLoggedIn(false);
  // };

//   return (
//     <AuthContext.Provider
//       value={{ isLoggedIn, isLoading, login, logout, token, user, permissions, hasPermission }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

import React, { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({}); // keep as object

  // ✅ PERMISSION CHECKER: check if user has at least one of the actions
  const hasPermission = (module, ...actions) => {
    if (!permissions || typeof permissions !== "object") return false;
    if (!permissions[module]) return false;

    return actions.some((action) => permissions[module][action] === true);
  };

  // ✅ Load from localStorage when app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedPermissions = localStorage.getItem("permissions");

    if (storedToken && storedUser && storedPermissions) {
      setToken(storedToken);
      setIsLoggedIn(true);

      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        setUser(null);
      }

      try {
        const parsedPermissions = JSON.parse(storedPermissions);
        if (parsedPermissions && typeof parsedPermissions === "object") {
          setPermissions(parsedPermissions);
        } else {
          setPermissions({});
        }
      } catch (err) {
        console.error("Failed to parse permissions from localStorage", err);
        setPermissions({});
      }
    } else {
      setPermissions({});
    }

    setIsLoading(false);
  }, []);

  // ✅ Login and store everything in localStorage (NO flattening)
  const login = (newToken, newUser, newPermissions) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("permissions", JSON.stringify(newPermissions));

    setToken(newToken);
    setUser(newUser);
    setPermissions(newPermissions);
    setIsLoggedIn(true);
  };

  // ✅ Logout and clean up
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");

    setToken(null);
    setUser(null);
    setPermissions({});
    setIsLoggedIn(false);
  };

  // ✅ Provide everything to children
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        token,
        user,
        permissions,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;























































