// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!name || !email || !password) {
//       alert("Please fill all fields");
//       return;
//     }

//     axios
//       .post("http://localhost:5001/auth/register", { name, email, password })
//       .then((result) => {
//         console.log(result);
//         navigate("/login");
//       })
//       .catch((err) => {
//         console.log(err);
//         alert("Something went wrong. Please try again.");
//       });
//   };

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
//         {/* <div
//           className="bg-white p-4 rounded shadow-lg"
//           style={{ width: "100%", maxWidth: "400px" }}
//         > */}

// <div
//   style={{
//     background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.7))",
//     borderRadius: "20px",
//     padding: "2.5rem 3rem",
//     width: "100%",
//     maxWidth: "420px",
//     boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
//     border: "1px solid rgba(255, 255, 255, 0.6)",
//     color: "#222",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   }}
// >



//           <h2 className="text-center text-primary">Register</h2>
//           {/* <h2 className="text-center text-primary">Login</h2> */}

//           {/* {errorMessage && (
//           <div className="alert alert-danger text-center" role="alert">
//             {errorMessage}
//           </div>
//         )} */}

//           <form className="text-start" onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label htmlFor="name">
//                 <strong>Name</strong>
//               </label>
//               <input
//                 type="name"
//                 className="form-control rounded-0"
//                 name="name"
//                 placeholder="Enter Your Name"
//                 autoComplete="off"
//                 required
//                 onChange={(e) => setName(e.target.value)}
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
//                 onChange={(e) => setEmail(e.target.value)}
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
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <button className="btn btn-primary w-100 rounded">Register</button>

//             <p className="mt-3 text-center">
//               Already have an account?{" "}
//               <Link to="/login" className="text-decoration-none text-success">
//                 SignIn
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;



import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    axios
      .post("http://localhost:5001/auth/register", { name, email, password })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong. Please try again.");
      });
  };

  // Common style and handlers for inputs
  const inputStyle = {
    backgroundColor: "#fff",
    border: "1.5px solid #ddd",
    borderRadius: "10px",
    padding: "0.6rem 1rem",
    fontSize: "1rem",
    color: "#333",
    transition: "border-color 0.3s ease",
  };

  // Handlers to change border color on focus/blur
  const handleFocus = (e) => (e.target.style.borderColor = "#7b68ee");
  const handleBlur = (e) => (e.target.style.borderColor = "#ddd");

  return (
    <div
      style={{
        backgroundImage: "url('/background.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.7))",
            borderRadius: "20px",
            padding: "2.5rem 3rem",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            color: "#222",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <h2
            className="text-center text-primary"
            style={{ marginBottom: "1.5rem" }}
          >
            Register
          </h2>

          <form className="text-start" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name">
                <strong>Name</strong>
              </label>
              <input
                type="text"
                className="form-control rounded-0"
                name="name"
                placeholder="Enter Your Name"
                autoComplete="off"
                required
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                className="form-control rounded-0"
                name="email"
                placeholder="Enter Your Email"
                autoComplete="off"
                required
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                className="form-control rounded-0"
                name="password"
                placeholder="Enter Your Password"
                autoComplete="off"
                required
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <button className="btn btn-primary w-100 rounded">Register</button>

            <p className="mt-3 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none text-success">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
