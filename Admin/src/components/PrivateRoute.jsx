// import { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// function PrivateRoute({ children }) {
//   const { isLoggedIn } = useContext(AuthContext);
//   const location = useLocation();

//   return isLoggedIn ? (
//     children
//   ) : (
//     <Navigate to="/login" replace state={{ from: location }} />
//   );
// }

// export default PrivateRoute;
