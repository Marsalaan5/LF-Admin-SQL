// // context/ComplaintContext.js

// import React, { createContext, useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "./AuthContext"

// export const ComplaintContext = createContext();

// export const ComplaintProvider = ({ children }) => {
//   const { token } = useContext(AuthContext);
//   const [complaints, setComplaints] = useState([]);
//   const [error, setError] = useState(null);

//   const fetchComplaints = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/complaints", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setComplaints(res.data);
//       localStorage.setItem("complaints", JSON.stringify(res.data));
//     } catch (err) {
//       console.error("Error fetching complaints:", err);
//       setError("Error loading complaints");
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchComplaints();
//     }
//   }, [token]);

//   return (
//     <ComplaintContext.Provider
//       value={{ complaints, setComplaints, fetchComplaints, error }}
//     >
//       {children}
//     </ComplaintContext.Provider>
//   );
// };



// // context/ComplaintContext.js
// import React, { createContext, useState, useCallback } from "react";
// import axios from "axios";

// export const ComplaintContext = createContext();

// export const ComplaintProvider = ({ children }) => {
//   const [complaints, setComplaints] = useState([]);

//   const fetchComplaints = useCallback(async (token) => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/complaints", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setComplaints(res.data);
//       localStorage.setItem("complaints", JSON.stringify(res.data));
//     } catch (error) {
//       console.error("Error fetching complaints", error);
//     }
//   }, []);

//   return (
//     <ComplaintContext.Provider value={{ complaints, setComplaints, fetchComplaints }}>
//       {children}
//     </ComplaintContext.Provider>
//   );
// };
