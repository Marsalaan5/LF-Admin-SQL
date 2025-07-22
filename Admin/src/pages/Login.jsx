

// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const currentPath = window.location.pathname;
//     if (token && currentPath !== "/") {
//       navigate("/");
//     }
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMessage("");

//     try {
//       const response = await axios.post("http://localhost:5001/auth/login", {
//         email,
//         password,
//       });

//       login(response.data.token, response.data.result, response.data.permissions);
//       navigate("/");
//     } catch (error) {
//       setErrorMessage(
//         error?.response?.data?.message ||
//           "Something went wrong, please try again later."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Shared input style
//   const inputStyle = {
//     backgroundColor: "#fff",
//     border: "1.5px solid #ddd",
//     borderRadius: "10px",
//     padding: "0.6rem 1rem",
//     fontSize: "1rem",
//     color: "#333",
//     transition: "border-color 0.3s ease",
//   };

//   // Focus handlers for inputs
//   const handleFocus = (e) => (e.target.style.borderColor = "#7b68ee");
//   const handleBlur = (e) => (e.target.style.borderColor = "#ddd");

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/background.avif')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         height: "100vh",
//         width: "100vw",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           position: "absolute",
//           top: 0,
//           left: 0,
//           height: "100%",
//           width: "100%",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <div
//           style={{
//             background:
//               "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.7))",
//             borderRadius: "20px",
//             padding: "2.5rem 3rem",
//             width: "100%",
//             maxWidth: "420px",
//             boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
//             border: "1px solid rgba(255, 255, 255, 0.6)",
//             color: "#222",
//             fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//           }}
//         >
//           <h2 className="text-center text-primary" style={{ marginBottom: "1.5rem" }}>
//             Login
//           </h2>

//           {errorMessage && (
//             <div className="alert alert-danger text-center" role="alert">
//               {errorMessage}
//             </div>
//           )}

//           <form className="text-start" onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label htmlFor="email">
//                 <strong>Email</strong>
//               </label>
//               <input
//                 type="email"
//                 placeholder="Enter Your Email"
//                 autoComplete="off"
//                 name="email"
//                 className="form-control rounded-0"
//                 onChange={(e) => {
//                   setErrorMessage("");
//                   setEmail(e.target.value);
//                 }}
//                 required
//                 style={inputStyle}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               />
//             </div>
//             <div className="mb-3">
//               <label htmlFor="password">
//                 <strong>Password</strong>
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter Your Password"
//                 name="password"
//                 className="form-control rounded-0"
//                 onChange={(e) => {
//                   setErrorMessage("");
//                   setPassword(e.target.value);
//                 }}
//                 required
//                 style={inputStyle}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               />
//             </div>

//             <button
//               type="submit"
//               className="btn btn-primary w-100 rounded"
//               disabled={isLoading}
//               style={{ fontWeight: "600" }}
//             >
//               {isLoading ? "Logging in..." : "Login"}
//             </button>

//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               className="btn btn-link w-100 text-primary mt-2"
//               style={{ fontWeight: "600" }}
//             >
//               Forgot Password?
//             </button>
//           </form>

//           <p className="mt-3 text-center" style={{ fontWeight: "600" }}>
//             Don't have an account?{" "}
//             <Link to="/register" className="text-decoration-none text-success">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;




// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx";

// const roleOptions = [
//   {
//     id: "Water",
//     label: "Water Department",
//     image: "/register/meter.png",
//     backgroundImage: "/register/water.jpg",
//   },
//   {
//     id: "CCMS",
//     label: "City Control Mgmt",
//     image: "/register/ccms.jpg",
//     backgroundImage: "/register/ccms.jpg",
//   },
//   {
//     id: "Other",
//     label: "General User",
//     image: "/register/user.jpg",
//     backgroundImage: "/register/user.avif",
//   },
// ];

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const selectedRole = roleOptions.find((r) => r.id === role);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) navigate("/");
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!role) {
//       setErrorMessage("Please select a role.");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");

//     try {
//       const response = await axios.post("http://localhost:5001/auth/login", {
//         email,
//         password,
//         role,
//       });

//       login(response.data.token, response.data.result, response.data.permissions);
//       navigate("/");
//     } catch (error) {
//       setErrorMessage(
//         error?.response?.data?.message ||
//           "Something went wrong, please try again later."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         backgroundImage: `url(${selectedRole?.backgroundImage || "/register/default-bg.jpg"})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         fontFamily: "sans-serif",
//         padding: "2rem",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.95)",
//           borderRadius: "12px",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//           padding: "3rem",
//           width: "100%",
//           maxWidth: "420px",
//         }}
//       >
//         <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
//           Login to Your Account
//         </h2>

//         {/* Role Select */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "1rem",
//             marginBottom: "1.5rem",
//           }}
//         >
//           {roleOptions.map((opt) => (
//             <div
//               key={opt.id}
//               onClick={() => setRole(opt.id)}
//               style={{
//                 border:
//                   role === opt.id ? "2px solid #4caf50" : "1.5px solid #ccc",
//                 borderRadius: "10px",
//                 padding: "0.8rem",
//                 textAlign: "center",
//                 cursor: "pointer",
//                 background: role === opt.id ? "#f1fff6" : "#fafafa",
//                 width: "80px",
//               }}
//             >
//               <img
//                 src={opt.image}
//                 alt={opt.label}
//                 style={{ width: "40px", marginBottom: "0.5rem" }}
//               />
//               <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
//                 {opt.id}
//               </div>
//             </div>
//           ))}
//         </div>

//         {errorMessage && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "0.75rem",
//               borderRadius: "8px",
//               backgroundColor: "#f8d7da",
//               color: "#721c24",
//               textAlign: "center",
//               fontWeight: "500",
//             }}
//           >
//             {errorMessage}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "1rem" }}>
//             <label htmlFor="email" style={{ fontWeight: "bold" }}>
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={inputStyle}
//             />
//           </div>

//           <div style={{ marginBottom: "1.5rem" }}>
//             <label htmlFor="password" style={{ fontWeight: "bold" }}>
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={inputStyle}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || !role}
//             style={{
//               ...buttonStyle,
//               backgroundColor: role ? "#4caf50" : "#ccc",
//               cursor: role ? "pointer" : "not-allowed",
//             }}
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>

//           <div style={{ marginTop: "1rem", textAlign: "center" }}>
//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "#007bff",
//                 textDecoration: "underline",
//                 cursor: "pointer",
//                 fontSize: "0.95rem",
//                 marginTop: "0.5rem",
//               }}
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
//             Don’t have an account?{" "}
//             <Link to="/register" style={{ color: "#4caf50", fontWeight: 500 }}>
//               Sign Up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "12px",
//   borderRadius: "8px",
//   border: "1.5px solid #ccc",
//   fontSize: "1rem",
//   marginTop: "0.3rem",
//   outline: "none",
// };

// const buttonStyle = {
//   width: "100%",
//   padding: "12px",
//   color: "#fff",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "1rem",
//   fontWeight: 600,
//   transition: "background-color 0.2s ease",
// };

// export default Login;



// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx";

// const fixedRoles = [
//   {
//     id: "Water",
//     label: "Water Department",
//     image: "/register/meter.png",
//     backgroundImage: "/register/water.jpg",
//   },
//   {
//     id: "CCMS",
//     label: "City Control Mgmt",
//     image: "/register/ccms.jpg",
//     backgroundImage: "/register/ccms.jpg",
//   },
//   {
//     id: "Other",
//     label: "General User",
//     image: "/register/user.jpg",
//     backgroundImage: "/register/user.avif",
//   },
// ];

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [otherRole, setOtherRole] = useState("");
//   const [otherRolesList, setOtherRolesList] = useState([]);
//   const [loadingRoles, setLoadingRoles] = useState(false);
//   const [rolesError, setRolesError] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login,token } = useContext(AuthContext);

//   const selectedRole = fixedRoles.find((r) => r.id === role);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) navigate("/");
//   }, [navigate]);


//   useEffect(() => {
//     if (role === "Other") {
//       setLoadingRoles(true);
//       setRolesError(null);

//       axios
//         .get("http://localhost:5001/auth/roles",{
//                headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
    
//           const rolesFromApi = response.data.map((r) =>
//             typeof r === "string" ? r : r.name || r.id
//           );
//           setOtherRolesList(rolesFromApi);
//           setLoadingRoles(false);
//         })
//         .catch((error) => {
//           setRolesError("Failed to load roles. Please try again.");
//           setLoadingRoles(false);
//         });
//     } else {
     
//       setOtherRolesList([]);
//       setOtherRole("");
//       setRolesError(null);
//     }
//   }, [role,token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!role) {
//       setErrorMessage("Please select a role.");
//       return;
//     }

//     if (role === "Other" && !otherRole) {
//       setErrorMessage("Please select a role from the dropdown.");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");

//     try {
//       const loginRole = role === "Other" ? otherRole : role;

//       const response = await axios.post("http://localhost:5001/auth/login", {
//         email,
//         password,
//         role: loginRole,
//       });

//       login(response.data.token, response.data.result, response.data.permissions);
//       navigate("/");
//     } catch (error) {
//       setErrorMessage(
//         error?.response?.data?.message ||
//           "Something went wrong, please try again later."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         backgroundImage: `url(${selectedRole?.backgroundImage || "/register/default-bg.jpg"})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         fontFamily: "sans-serif",
//         padding: "2rem",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.95)",
//           borderRadius: "12px",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//           padding: "3rem",
//           width: "100%",
//           maxWidth: "420px",
//         }}
//       >
//         <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
//           Login to Your Account
//         </h2>

//         {/* Role Select Buttons */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "1rem",
//             marginBottom: "1.5rem",
//           }}
//         >
//           {fixedRoles.map((opt) => (
//             <div
//               key={opt.id}
//               onClick={() => {
//                 setRole(opt.id);
//                 setErrorMessage("");
//                 if (opt.id !== "Other") setOtherRole("");
//               }}
//               style={{
//                 border:
//                   role === opt.id ? "2px solid #4caf50" : "1.5px solid #ccc",
//                 borderRadius: "10px",
//                 padding: "0.8rem",
//                 textAlign: "center",
//                 cursor: "pointer",
//                 background: role === opt.id ? "#f1fff6" : "#fafafa",
//                 width: "80px",
//               }}
//             >
//               <img
//                 src={opt.image}
//                 alt={opt.label}
//                 style={{ width: "40px", marginBottom: "0.5rem" }}
//               />
//               <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>{opt.id}</div>
//             </div>
//           ))}
//         </div>

//         {/* Dropdown for Other role */}
//         {role === "Other" && (
//           <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
//             <label htmlFor="otherRole" style={{ fontWeight: "bold" }}>
//               Select your role
//             </label>

//             {loadingRoles ? (
//               <p>Loading roles...</p>
//             ) : rolesError ? (
//               <p style={{ color: "red" }}>{rolesError}</p>
//             ) : (
//               <select
//                 id="otherRole"
//                 value={otherRole}
//                 onChange={(e) => {
//                   setOtherRole(e.target.value);
//                   setErrorMessage("");
//                 }}
//                 required
//                 style={{
//                   marginTop: "0.5rem",
//                   width: "100%",
//                   padding: "10px",
//                   borderRadius: "8px",
//                   border: "1.5px solid #ccc",
//                   fontSize: "1rem",
//                   outline: "none",
//                 }}
//               >
//                 <option value="">-- Select Role --</option>
//                 {otherRolesList.map((r) => (
//                   <option key={r} value={r}>
//                     {r}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         )}

//         {errorMessage && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "0.75rem",
//               borderRadius: "8px",
//               backgroundColor: "#f8d7da",
//               color: "#721c24",
//               textAlign: "center",
//               fontWeight: "500",
//             }}
//           >
//             {errorMessage}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "1rem" }}>
//             <label htmlFor="email" style={{ fontWeight: "bold" }}>
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={inputStyle}
//             />
//           </div>

//           <div style={{ marginBottom: "1.5rem" }}>
//             <label htmlFor="password" style={{ fontWeight: "bold" }}>
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={inputStyle}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || !role || (role === "Other" && !otherRole)}
//             style={{
//               ...buttonStyle,
//               backgroundColor:
//                 role && (role !== "Other" || otherRole) ? "#4caf50" : "#ccc",
//               cursor:
//                 role && (role !== "Other" || otherRole)
//                   ? "pointer"
//                   : "not-allowed",
//             }}
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>

//           <div style={{ marginTop: "1rem", textAlign: "center" }}>
//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "#007bff",
//                 textDecoration: "underline",
//                 cursor: "pointer",
//                 fontSize: "0.95rem",
//                 marginTop: "0.5rem",
//               }}
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
//             Don’t have an account?{" "}
//             <Link to="/register" style={{ color: "#4caf50", fontWeight: 500 }}>
//               Sign Up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "12px",
//   borderRadius: "8px",
//   border: "1.5px solid #ccc",
//   fontSize: "1rem",
//   marginTop: "0.3rem",
//   outline: "none",
// };

// const buttonStyle = {
//   width: "100%",
//   padding: "12px",
//   color: "#fff",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "1rem",
//   fontWeight: 600,
//   transition: "background-color 0.2s ease",
// };

// export default Login;


// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx";

// const fixedRoles = [
//   {
//     id: "Water",
//     label: "Water Department",
//     image: "/register/meter.png",
//     backgroundImage: "/register/water.jpg",
//   },
//   {
//     id: "CCMS",
//     label: "City Control Mgmt",
//     image: "/register/ccms.jpg",
//     backgroundImage: "/register/ccms.jpg",
//   },
// ];

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState(""); // Will be "Water", "CCMS", or "Other"
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login,token } = useContext(AuthContext);



//   useEffect(() => {
//     // const token = localStorage.getItem("token");
//     if (token) navigate("/");
//   }, [navigate]);



//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!role) {
//     setErrorMessage("Please select a role before logging in.");
//     return;
//   }

//   setIsLoading(true);
//   setErrorMessage("");

//   try {
//     const payload = {
//       email,
//       password,
//     };

//     if (role !== "Other") {
//       payload.role = role;
//     }

//     const response = await axios.post("http://localhost:5001/auth/login", payload);

//     login(response.data.token, response.data.result, response.data.permissions);
//     navigate("/");
//   } catch (error) {
//     setErrorMessage(
//       error?.response?.data?.message || "Something went wrong, please try again."
//     );
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const selectedRoleObject = fixedRoles.find((r) => r.id === role);

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         backgroundImage: `url(${selectedRoleObject?.backgroundImage || "/register/default-bg.jpg"})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         fontFamily: "sans-serif",
//         padding: "2rem",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.95)",
//           borderRadius: "12px",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//           padding: "3rem",
//           width: "100%",
//           maxWidth: "420px",
//         }}
//       >
//         <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
//           Login to Your Account
//         </h2>

//         {/* Role Select Buttons */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "1rem",
//             marginBottom: "2rem",
//           }}
//         >
//           {fixedRoles.map((opt) => (
//             <div
//               key={opt.id}
//               onClick={() => {
//                 setRole(opt.id);
//                 setErrorMessage("");
//               }}
//               style={{
//                 border: role === opt.id ? "2px solid #4caf50" : "1.5px solid #ccc",
//                 borderRadius: "10px",
//                 padding: "0.8rem",
//                 textAlign: "center",
//                 cursor: "pointer",
//                 background: role === opt.id ? "#f1fff6" : "#fafafa",
//                 width: "80px",
//               }}
//             >
//               <img
//                 src={opt.image}
//                 alt={opt.label}
//                 style={{ width: "40px", marginBottom: "0.5rem" }}
//               />
//               <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>{opt.id}</div>
//             </div>
//           ))}

//           {/* Other Button */}
//           <div
//             onClick={() => {
//               setRole("Other");
//               setErrorMessage("");
//             }}
//             style={{
//               border: role === "Other" ? "2px solid #4caf50" : "1.5px solid #ccc",
//               borderRadius: "10px",
//               padding: "0.8rem",
//               textAlign: "center",
//               cursor: "pointer",
//               background: role === "Other" ? "#f1fff6" : "#fafafa",
//               width: "80px",
//               userSelect: "none",
//             }}
//           >
//             <img
//               src="/register/user.jpg"
//               alt="Other"
//               style={{ width: "40px", marginBottom: "0.5rem" }}
//             />
//             <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>Other</div>
//           </div>
//         </div>

//         {errorMessage && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "0.75rem",
//               borderRadius: "8px",
//               backgroundColor: "#f8d7da",
//               color: "#721c24",
//               textAlign: "center",
//               fontWeight: "500",
//             }}
//           >
//             {errorMessage}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "1rem" }}>
//             <label htmlFor="email" style={{ fontWeight: "bold" }}>
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={inputStyle}
//             />
//           </div>

//           <div style={{ marginBottom: "1.5rem" }}>
//             <label htmlFor="password" style={{ fontWeight: "bold" }}>
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={inputStyle}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || !role}
//             style={{
//               ...buttonStyle,
//               backgroundColor: role ? "#4caf50" : "#ccc",
//               cursor: role ? "pointer" : "not-allowed",
//             }}
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>

//           <div style={{ marginTop: "1rem", textAlign: "center" }}>
//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "#007bff",
//                 textDecoration: "underline",
//                 cursor: "pointer",
//                 fontSize: "0.95rem",
//                 marginTop: "0.5rem",
//               }}
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
//             Don’t have an account?{" "}
//             <Link to="/register" style={{ color: "#4caf50", fontWeight: 500 }}>
//               Sign Up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "12px",
//   borderRadius: "8px",
//   border: "1.5px solid #ccc",
//   fontSize: "1rem",
//   marginTop: "0.3rem",
//   outline: "none",
// };

// const buttonStyle = {
//   width: "100%",
//   padding: "12px",
//   color: "#fff",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "1rem",
//   fontWeight: 600,
//   transition: "background-color 0.2s ease",
// };

// export default Login;




import React, { useEffect,useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const fixedRoles = [
  {
    id: "Water",
    label: "Water Department",
    image: "/register/meter.png",
    backgroundImage: "/register/water.jpg",
 
  },
  {
    id: "CCMS",
    label: "City Control Mgmt",
    image: "/register/ccms.jpg",
    backgroundImage: "/register/ccms.jpg",
    
  },

];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();
  const { login,token } = useContext(AuthContext); 
  
  useEffect(() => {
    // const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [token,navigate]);
  

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!role) {
    setErrorMessage("Please select a role before logging in.");
    return;
  }
  
  setIsLoading(true);
  setErrorMessage("");
  
  try {
    const payload = {
      email,
      password,
    };
    
    if (role !== "Other") {
      payload.role = role;
    }

    const response = await axios.post("http://localhost:5001/auth/login", payload);
    
    login(response.data.token, response.data.result, response.data.permissions);
    navigate("/");
  } catch (error) {
    setErrorMessage(
      error?.response?.data?.message || "Something went wrong, please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

const selectedRole = fixedRoles.find((r) => r.id === role);

  return (
    <div
      style={{
        minHeight: "100vh",
        // backgroundImage: `url(${selectedRole?.backgroundImage || "/register/default-bg.jpg"})`,
                backgroundImage: `url(${
  role === "Other"
    ? "/register/user.avif"  
    : selectedRole?.backgroundImage || "/register/user.avif"
})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
          maxWidth: "960px",
          width: "100%",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            flex: 1,
            // backgroundImage: `url(${selectedRole?.backgroundImage || "/register/default-bg.jpg"})`,
            backgroundImage: `url(${
  role === "Other"
    ? "/register/user.avif"  
    : selectedRole?.backgroundImage || "/register/user.avif"
})`,

            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "360px",
              textAlign: "left",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
              {selectedRole ? selectedRole.label : "Welcome Back!"}
            </h2>
            <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
              “{selectedRole?.quote || "Select your role to login."}”
            </p>
            {/* {selectedRole && (
              <p style={{ fontWeight: "bold", color: "#cfcfcf" }}>
                {selectedRole.author}
              </p>
            )} */}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            flex: 1,
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}>
            <h2
              style={{
                textAlign: "center",
                marginBottom: "2rem",
                color: "#333",
              }}
            >
              Login to Your Account
            </h2>

            {/* Role Select */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {fixedRoles.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setRole(opt.id);
                     setErrorMessage("");
                  }}
                  style={{
                    border:
                      role === opt.id ? "2px solid #4caf50" : "1.5px solid #ccc",
                    borderRadius: "10px",
                    padding: "0.8rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: role === opt.id ? "#f1fff6" : "#fafafa",
                    width: "80px",
                    // userSelect: "none",
                  }}
                >
                  <img
                    src={opt.image}
                    alt={opt.label}
                    style={{ width: "40px", marginBottom: "0.5rem" }}
                  />
                  <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                    {opt.id}
                  </div>
                </div>
              ))}

 {/* Other Button */}
          <div
            onClick={() => {
              setRole("Other");
              setErrorMessage("");
            }}
            style={{
              border: role === "Other" ? "2px solid #4caf50" : "1.5px solid #ccc",
              borderRadius: "10px",
              backgroundImage:"/register/water.jpg",
              padding: "0.8rem",
              textAlign: "center",
              cursor: "pointer",
              background: role === "Other" ? "#f1fff6" : "#fafafa",
              width: "80px",
              userSelect: "none",
            }}
          >
            <img
              src="/register/user.jpg"
              alt="Other"
              style={{ width: "40px", marginBottom: "0.5rem" }}
            />
            <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>Other</div>
          </div>
        </div>

        {errorMessage && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: "8px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {errorMessage}
          </div>
        )}

            {/* Form */}
             <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email" style={{ fontWeight: "bold" }}>
              Email
            </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={{ fontWeight: "bold" }}>
              Password
            </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
                />
                </div>

              <button
                type="submit"
                disabled={isLoading || !role}
                style={{
                  ...buttonStyle,
                  backgroundColor: role ? "#4caf50" : "#ccc",
                  cursor: role ? "pointer" : "not-allowed",
                }}
              >

                {isLoading ? "Logging in..." : "Login" }
                
              </button>
              
 <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "0.95rem",
                marginTop: "0.5rem",
              }}
            >
              Forgot Password?
            </button>
          </div>



            <p
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                color: "#666",
              }}
              >
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#4caf50", fontWeight: 500 }}>
                Register
              </Link>
            </p>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1.5px solid #ccc",
  fontSize: "1rem",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  transition: "all 0.2s ease",
};

export default Login;
