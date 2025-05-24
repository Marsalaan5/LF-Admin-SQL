import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider, { AuthContext } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);


// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import AuthProvider from "./context/AuthContext";
// import { ComplaintProvider } from "./context/ComplaintContext"; // ✅ Import

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <AuthProvider>
//     <ComplaintProvider> {/* ✅ Wrap App inside this */}
//       <App />
//     </ComplaintProvider>
//   </AuthProvider>
// );
