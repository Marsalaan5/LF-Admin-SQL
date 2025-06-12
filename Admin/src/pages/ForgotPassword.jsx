// import { useState } from 'react';
// import axios from 'axios';

//  function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5001/auth/forgot-password', { email });
//       setMessage(res.data.message);
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Error occurred');
//     }
//   };

//   return (

//          <div className="container mt-5 p-2">
  
//       <div className="p-4 d-flex justify-content-between align-items-center">
//         <div className="col-sm-6">
//           <h1 className="m-0 text-dark">Forgot Password</h1>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active">Forgot-Password</li>
//             </ol>
//           </div>
//         </div>
//         </div>
//     <form onSubmit={handleSubmit}>
//       <h2>Forgot Password</h2>
//       <input
//         type="email"
//         placeholder="Enter your email"
//         required
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//       />
//       <button type="submit">Send Reset Link</button>
//       {message && <p>{message}</p>}
//     </form>
//     </div>
//   );
// }

// export default ForgotPassword;


import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5001/auth/forgot-password",
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Header and Breadcrumb */}
          <div className="mb-4">
            <h1 className="h3 mb-3 text-dark">Forgot Password</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Forgot Password
                </li>
              </ol>
            </nav>
          </div>

          {/* Form Card */}
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h5 mb-4">Reset Your Password</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              {message && (
                <div
                  className={`alert mt-3 ${
                    message.toLowerCase().includes("error")
                      ? "alert-danger"
                      : "alert-success"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
