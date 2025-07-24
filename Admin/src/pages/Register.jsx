


// import React, { useContext, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [mobile, setMobile] = useState("");  // <-- new mobile state

//   const navigate = useNavigate();
//   const { token } = useContext(AuthContext);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!name || !email || !password || !role || !mobile) {
//       alert("Please fill all fields including role and mobile");
//       return;
//     }

//     axios
//       .post(
//         "http://localhost:5001/auth/register",
//         {
//           name,
//           email,
//           password,
//           role,
//           mobile,  // <-- send mobile as well
//         },
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//         }
//       )
//       .then((result) => {
//         console.log(result);
//         navigate("/login");
//       })
//       .catch((err) => {
//         console.log(err);
//         alert("Something went wrong. Please try again.");
//       });
//   };

//   // Common style and handlers for inputs
//   const inputStyle = {
//     backgroundColor: "#fff",
//     border: "1.5px solid #ddd",
//     borderRadius: "10px",
//     padding: "0.6rem 1rem",
//     fontSize: "1rem",
//     color: "#333",
//     transition: "border-color 0.3s ease",
//   };

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
//           <h2
//             className="text-center text-primary"
//             style={{ marginBottom: "1.5rem" }}
//           >
//             Register
//           </h2>

//           <form className="text-start" onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label htmlFor="name">
//                 <strong>Name</strong>
//               </label>
//               <input
//                 type="text"
//                 className="form-control rounded-0"
//                 name="name"
//                 placeholder="Enter Your Name"
//                 autoComplete="off"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 style={inputStyle}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="email">
//                 <strong>Email</strong>
//               </label>
//               <input
//                 type="email"
//                 className="form-control rounded-0"
//                 name="email"
//                 placeholder="Enter Your Email"
//                 autoComplete="off"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
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
//                 className="form-control rounded-0"
//                 name="password"
//                 placeholder="Enter Your Password"
//                 autoComplete="off"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={inputStyle}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               />
//             </div>

//             {/* New Mobile Field */}
//             <div className="mb-3">
//               <label htmlFor="mobile">
//                 <strong>Mobile</strong>
//               </label>
//               <input
//                 type="tel"
//                 className="form-control rounded-0"
//                 name="mobile"
//                 placeholder="Enter Your Mobile Number"
//                 autoComplete="off"
//                 required
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 style={inputStyle}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="role">
//                 <strong>Role</strong>
//               </label>
//               <select
//                 className="form-control rounded-0"
//                 name="role"
//                 required
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 style={inputStyle}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               >
//                 <option value="">Select Role</option>
//                 <option value="Water">Water</option>
//                 <option value="Electrician">Electrician</option>
//                 <option value="User">User</option>
//               </select>
//             </div>

//             <button className="btn btn-primary w-100 rounded">Register</button>

//             <p className="mt-3 text-center">
//               Already have an account?{" "}
//               <Link to="/login" className="text-decoration-none text-success">
//                 Sign In
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;



// // Register.js
// import React, { useContext, useState, useEffect, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// const roleOptions = [
//   {
//     id: "Water",
//     label: "Water Department",
//     image: "/register/meter.png",
//     description: "Ensure seamless water supply and infrastructure maintenance.",
//     // background: "/register/waterbackground.jpg",
//     quote: "Managing urban water needs made smarter.",
//     author: "Aarav Sharma, Water Ops",
//   },
//   {
//     id: "CCMS",
//     label: "City Control Mgmt",
//     image: "/register/ccms.jpg",
//     description: "Monitor and control city infrastructure efficiently.",
//     // background: "/roles/ccms-bg.jpg",
//     quote: "Smarter cities start with smarter control systems.",
//     author: "Rekha Patel, CCMS Admin",
//   },
//   {
//     id: "User",
//     label: "General User",
//     image: "/resgister/user.jpg",
//     description: "Raise complaints, track issues, and stay informed.",
//     background: "/roles/user-bg.jpg",
//     quote: "Citizen voices matter – and now they’re heard.",
//     author: "Soham Verma, Local Resident",
//   },
// ];

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [role, setRole] = useState("");

//   const navigate = useNavigate();
//   const { token } = useContext(AuthContext);
//   const selectedRole = roleOptions.find((r) => r.id === role);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!name || !email || !password || !mobile || !role) {
//       alert("Please fill all fields.");
//       return;
//     }
//     axios.post(
//       "http://localhost:5001/auth/register",
//       { name, email, password, role, mobile },
//       { headers: { Authorization: token ? `Bearer ${token}` : "" } }
//     )
//     .then(() => navigate("/login"))
//     .catch((err) => {
//       console.error(err);
//       alert("Something went wrong.");
//     });
//   };

//   return (
//   <div style={{
//   display: "flex",
//   minHeight: "100vh",
//   overflow: "hidden",
//   fontFamily: "sans-serif"
// }}>

//       {/* LEFT PANEL */}
//      <div
//   style={{
//     flex: 1,
//     backgroundImage: `url(${selectedRole?.background || "/default-bg.jpg"})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "2rem",
//   }}
// >
//   <div
//     style={{
//       backgroundColor: "rgba(0, 0, 0, 0.6)",
//       padding: "2rem",
//       borderRadius: "16px",
//       maxWidth: "400px",
//       textAlign: "left",
//     }}
//   >
//     <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
//       {selectedRole ? selectedRole.label : "Welcome!"}
//     </h2>
//     <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
//       “{selectedRole?.quote || "Select a role to see relevant details."}”
//     </p>
//     {selectedRole && (
//       <p style={{ fontWeight: "bold", color: "#cfcfcf" }}>{selectedRole.author}</p>
//     )}
//   </div>
// </div>

  

//       {/* RIGHT PANEL */}
//   <div style={{
//   flex: 1,
//   backgroundColor: "#fff",
//   padding: "3rem",
//   overflowY: "auto",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }}>

//         <div style={{ maxWidth: "480px", margin: "0 auto" }}>
//           <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
//             Register an Account
//           </h2>

//           {/* Role Select Icons */}
//           <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
//             {roleOptions.map((opt) => (
//               <div
//                 key={opt.id}
//                 onClick={() => setRole(opt.id)}
//                 style={{
//                   border: role === opt.id ? "2px solid #4caf50" : "1.5px solid #ccc",
//                   borderRadius: "10px",
//                   padding: "0.8rem",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   background: role === opt.id ? "#f1fff6" : "#fafafa",
//                 }}
//               >
//                 <img src={opt.image} alt={opt.label} style={{ width: "40px", marginBottom: "0.5rem" }} />
//                 <div style={{ fontWeight: "500", color: "#444" }}>{opt.id}</div>
//               </div>
//             ))}
//           </div>

//           {/* Form Fields */}
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               style={inputStyle}
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={inputStyle}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={inputStyle}
//             />
//             <input
//               type="tel"
//               placeholder="Mobile Number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               required
//               style={inputStyle}
//             />

//             <button
//               type="submit"
//               disabled={!role}
//               style={{
//                 ...buttonStyle,
//                 backgroundColor: role ? "#4caf50" : "#ccc",
//                 cursor: role ? "pointer" : "not-allowed",
//               }}
//             >
//               Register
//             </button>
//           </form>

//           <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
//             Already have an account?{" "}
//             <Link to="/login" style={{ color: "#4caf50", fontWeight: 500 }}>
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "12px",
//   marginBottom: "1rem",
//   borderRadius: "8px",
//   border: "1.5px solid #ccc",
//   fontSize: "1rem",
//   outline: "none",
// };

// const buttonStyle = {
//   width: "100%",
//   padding: "12px",
//   color: "#fff",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "1rem",
//   transition: "all 0.2s ease",
// };

// export default Register;



// // Register.js
// import React, { useContext, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// const roleOptions = [
//   {
//     id: "Water",
//     label: "Water Department",
//     image: "/register/meter.png",
//     description: "Ensure seamless water supply and infrastructure maintenance.",
//     quote: "Managing urban water needs made smarter.",
//     author: "Aarav Sharma, Water Ops",
//   },
//   {
//     id: "CCMS",
//     label: "City Control Mgmt",
//     image: "/register/ccms.jpg",
//     description: "Monitor and control city infrastructure efficiently.",
//     quote: "Smarter cities start with smarter control systems.",
//     author: "Rekha Patel, CCMS Admin",
//   },
//   {
//     id: "User",
//     label: "General User",
//     image: "/register/user.jpg",
//     description: "Raise complaints, track issues, and stay informed.",
//     quote: "Citizen voices matter – and now they’re heard.",
//     author: "Soham Verma, Local Resident",
//   },
// ];

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [role, setRole] = useState("");

//   const navigate = useNavigate();
//   const { token } = useContext(AuthContext);
//   const selectedRole = roleOptions.find((r) => r.id === role);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!name || !email || !password || !mobile || !role) {
//       alert("Please fill all fields.");
//       return;
//     }
//     axios
//       .post(
//         "http://localhost:5001/auth/register",
//         { name, email, password, role, mobile },
//         { headers: { Authorization: token ? `Bearer ${token}` : "" } }
//       )
//       .then(() => navigate("/login"))
//       .catch((err) => {
//         console.error(err);
//         alert("Something went wrong.");
//       });
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//         justifyContent: "center",
//         alignItems: "center",
//         fontFamily: "sans-serif",
//         padding: "2rem",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           backgroundColor: "#fff",
//           borderRadius: "12px",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//           overflow: "hidden",
//           maxWidth: "960px",
//           width: "100%",
//         }}
//       >
//         {/* LEFT PANEL */}
//         <div
//           style={{
//             flex: 1,
//             backgroundImage: `url(${selectedRole?.background || "/default-bg.jpg"})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             padding: "2rem",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#fff",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "rgba(0, 0, 0, 0.6)",
//               padding: "2rem",
//               borderRadius: "16px",
//               maxWidth: "360px",
//               textAlign: "left",
//             }}
//           >
//             <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
//               {selectedRole ? selectedRole.label : "Welcome!"}
//             </h2>
//             <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
//               “{selectedRole?.quote || "Select a role to see relevant details."}”
//             </p>
//             {selectedRole && (
//               <p style={{ fontWeight: "bold", color: "#cfcfcf" }}>
//                 {selectedRole.author}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div
//           style={{
//             flex: 1,
//             padding: "3rem",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <div style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}>
//             <h2
//               style={{
//                 textAlign: "center",
//                 marginBottom: "2rem",
//                 color: "#333",
//               }}
//             >
//               Register an Account
//             </h2>

//             {/* Role Select */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 gap: "1rem",
//                 marginBottom: "2rem",
//               }}
//             >
//               {roleOptions.map((opt) => (
//                 <div
//                   key={opt.id}
//                   onClick={() => setRole(opt.id)}
//                   style={{
//                     border:
//                       role === opt.id
//                         ? "2px solid #4caf50"
//                         : "1.5px solid #ccc",
//                     borderRadius: "10px",
//                     padding: "0.8rem",
//                     textAlign: "center",
//                     cursor: "pointer",
//                     background: role === opt.id ? "#f1fff6" : "#fafafa",
//                     width: "80px",
//                   }}
//                 >
//                   <img
//                     src={opt.image}
//                     alt={opt.label}
//                     style={{ width: "40px", marginBottom: "0.5rem" }}
//                   />
//                   <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
//                     {opt.id}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 style={inputStyle}
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 style={inputStyle}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 style={inputStyle}
//               />
//               <input
//                 type="tel"
//                 placeholder="Mobile Number"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 required
//                 style={inputStyle}
//               />

//               <button
//                 type="submit"
//                 disabled={!role}
//                 style={{
//                   ...buttonStyle,
//                   backgroundColor: role ? "#4caf50" : "#ccc",
//                   cursor: role ? "pointer" : "not-allowed",
//                 }}
//               >
//                 Register
//               </button>
//             </form>

//             <p
//               style={{
//                 textAlign: "center",
//                 marginTop: "1.5rem",
//                 color: "#666",
//               }}
//             >
//               Already have an account?{" "}
//               <Link to="/login" style={{ color: "#4caf50", fontWeight: 500 }}>
//                 Sign In
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "12px",
//   marginBottom: "1rem",
//   borderRadius: "8px",
//   border: "1.5px solid #ccc",
//   fontSize: "1rem",
//   outline: "none",
// };

// const buttonStyle = {
//   width: "100%",
//   padding: "12px",
//   color: "#fff",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "1rem",
//   transition: "all 0.2s ease",
// };

// export default Register;


import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const [roleOptions, setRoleOptions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {

    axios
      .get("http://localhost:5001/auth/public-roles", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, 
      })
      .then((res) => {
        setRoleOptions(res.data);
        setLoadingRoles(false);
      })
      .catch((err) => {
        console.error("Failed to fetch roles:", err);
        setLoadingRoles(false);
      });
  }, [token]);

  const selectedRole = roleOptions.find((r) => r.id === role);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !mobile || !role) {
      alert("Please fill all fields.");
      return;
    }
    axios
      .post(
        "http://localhost:5001/auth/register",
        { name, email, password, role, mobile },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      )
      .then(() => navigate("/login"))
      .catch((err) => {
        console.error(err);
        alert("Something went wrong.");
      });
  };

  if (loadingRoles) {
    return <div>Loading roles...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${selectedRole?.backgroundImage || "/register/default-bg.jpg"})`,
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
            backgroundImage: `url(${selectedRole?.backgroundImage || "/register/default-bg.jpg"})`,
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
              {selectedRole ? selectedRole.label : "Welcome!"}
            </h2>
            <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
              “{selectedRole?.quote || "Select a role to see relevant details."}”
            </p>
            {selectedRole && (
              <p style={{ fontWeight: "bold", color: "#cfcfcf" }}>
                {selectedRole.author}
              </p>
            )}
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
              Register an Account
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
              {roleOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setRole(opt.id)}
                  style={{
                    border:
                      role === opt.id ? "2px solid #4caf50" : "1.5px solid #ccc",
                    borderRadius: "10px",
                    padding: "0.8rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: role === opt.id ? "#f1fff6" : "#fafafa",
                    width: "80px",
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
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={!role}
                style={{
                  ...buttonStyle,
                  backgroundColor: role ? "#4caf50" : "#ccc",
                  cursor: role ? "pointer" : "not-allowed",
                }}
              >
                Register
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                color: "#666",
              }}
            >
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#4caf50", fontWeight: 500 }}>
                Sign In
              </Link>
            </p>
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

export default Register;


// // Register.js
// import React, { useContext, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// const roleOptions = [
//   {
//     id: "Water",
//     label: "Water Department",
//     image: "/register/meter.png",
//     backgroundImage: "/register/water.jpg",
//     description: "Ensure seamless water supply and infrastructure maintenance.",
//     quote: "Managing urban water needs made smarter.",
//     author: "Xyz, Water Admin",
//   },
//   {
//     id: "CCMS",
//     label: "City Control Mgmt",
//     image: "/register/ccms.jpg",
//     backgroundImage: "/register/ccms.jpg",
//     description: "Monitor and control city infrastructure efficiently.",
//     quote: "Smarter cities start with smarter control systems.",
//     author: "Xyz, CCMS Admin",
//   },
//   {
//     id: "User",
//     label: "Other",
//     image: "/register/user.jpg",
//     backgroundImage: "/register/user.avif",
//     description: "Raise complaints, track issues, and stay informed.",
//     quote: "Citizen voices matter – and now they’re heard.",
//     author: "Xyz,Resident",
//   },
// ];

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [role, setRole] = useState("");

//   const navigate = useNavigate();
//   const { token } = useContext(AuthContext);
//   const selectedRole = roleOptions.find((r) => r.id === role);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!name || !email || !password || !mobile || !role) {
//       alert("Please fill all fields.");
//       return;
//     }
//     axios
//       .post(
//         "http://localhost:5001/auth/register",
//         { name, email, password, role, mobile },
//         { headers: { Authorization: token ? `Bearer ${token}` : "" } }
//       )
//       .then(() => navigate("/login"))
//       .catch((err) => {
//         console.error(err);
//         alert("Something went wrong.");
//       });
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
//           display: "flex",
//           backgroundColor: "rgba(255, 255, 255, 0.95)",
//           borderRadius: "12px",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//           overflow: "hidden",
//           maxWidth: "960px",
//           width: "100%",
//         }}
//       >
//         {/* LEFT PANEL */}
//         <div
//           style={{
//             flex: 1,
//             backgroundImage: `url(${selectedRole?.backgroundImage || "/register/default-bg.jpg"})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             padding: "2rem",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#fff",
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "rgba(0, 0, 0, 0.6)",
//               padding: "2rem",
//               borderRadius: "16px",
//               maxWidth: "360px",
//               textAlign: "left",
//             }}
//           >
//             <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
//               {selectedRole ? selectedRole.label : "Welcome!"}
//             </h2>
//             <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
//               “{selectedRole?.quote || "Select a role to see relevant details."}”
//             </p>
//             {selectedRole && (
//               <p style={{ fontWeight: "bold", color: "#cfcfcf" }}>
//                 {selectedRole.author}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div
//           style={{
//             flex: 1,
//             padding: "3rem",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <div style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}>
//             <h2
//               style={{
//                 textAlign: "center",
//                 marginBottom: "2rem",
//                 color: "#333",
//               }}
//             >
//               Register an Account
//             </h2>

//             {/* Role Select */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 gap: "1rem",
//                 marginBottom: "2rem",
//               }}
//             >
//               {roleOptions.map((opt) => (
//                 <div
//                   key={opt.id}
//                   onClick={() => setRole(opt.id)}
//                   style={{
//                     border:
//                       role === opt.id
//                         ? "2px solid #4caf50"
//                         : "1.5px solid #ccc",
//                     borderRadius: "10px",
//                     padding: "0.8rem",
//                     textAlign: "center",
//                     cursor: "pointer",
//                     background: role === opt.id ? "#f1fff6" : "#fafafa",
//                     width: "80px",
//                   }}
//                 >
//                   <img
//                     src={opt.image}
//                     alt={opt.label}
//                     style={{ width: "40px", marginBottom: "0.5rem" }}
//                   />
//                   <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
//                     {opt.id}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 style={inputStyle}
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 style={inputStyle}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 style={inputStyle}
//               />
//               <input
//                 type="tel"
//                 placeholder="Mobile Number"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 required
//                 style={inputStyle}
//               />

//               <button
//                 type="submit"
//                 disabled={!role}
//                 style={{
//                   ...buttonStyle,
//                   backgroundColor: role ? "#4caf50" : "#ccc",
//                   cursor: role ? "pointer" : "not-allowed",
//                 }}
//               >
//                 Register
//               </button>
//             </form>

//             <p
//               style={{
//                 textAlign: "center",
//                 marginTop: "1.5rem",
//                 color: "#666",
//               }}
//             >
//               Already have an account?{" "}
//               <Link to="/login" style={{ color: "#4caf50", fontWeight: 500 }}>
//                 Sign In
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "12px",
//   marginBottom: "1rem",
//   borderRadius: "8px",
//   border: "1.5px solid #ccc",
//   fontSize: "1rem",
//   outline: "none",
// };

// const buttonStyle = {
//   width: "100%",
//   padding: "12px",
//   color: "#fff",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "1rem",
//   transition: "all 0.2s ease",
// };

// export default Register;
