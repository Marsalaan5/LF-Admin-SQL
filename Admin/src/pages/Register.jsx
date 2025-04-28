import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from 'axios'


function Register() {

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const navigate = useNavigate()


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

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg- white shadow-lg rounded p-4 w-30">
        <h2 className="text-center text-primary">Register</h2>
        <form className="text-start" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="name"
              className="form-control rounded-0"
              name="name"
              placeholder="Enter Your Name"
              autoComplete="off"
              required
              onChange={(e)=> setName(e.target.value)}
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
              onChange={(e)=> setEmail(e.target.value)}
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
              onChange={(e)=> setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 rounded">Register</button>

          <p className="mt-3 text-center">
          Dont't have an account?{" "}
          <Link
            to="/login"
            className="text-decoration-none text-success"
          >
            SignIn
          </Link>
        </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
