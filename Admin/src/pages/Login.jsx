import { useState, useEffect,useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx"; 


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;
  

    if (token && currentPath !== "/") {
      navigate("/"); 
    }
  }, [navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5001/auth/login", { email, password });
      console.log(response.data);
   
console.log(response.data.user);  

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.result)); 

      console.log(localStorage.getItem("token")); 
console.log(localStorage.getItem("user")); 

     
      login(response.data.token,response.data.result); 

      navigate("/"); 
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Something went wrong, please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-4 rounded shadow-lg w-25">
        <h2 className="text-center text-primary">Login</h2>

        {errorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="text-start" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => {
                setErrorMessage(''); 
                setEmail(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => {
                setErrorMessage('');
                setPassword(e.target.value);
              }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-0" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="btn btn-link w-100 text-primary mt-2"
          >
            Forgot Password?
          </button>
        </form>

        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none text-success">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
