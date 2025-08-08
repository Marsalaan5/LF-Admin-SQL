import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);










                    <td
                      style={{
                        padding: "10px 12px",
                        verticalAlign: "top",
                        minWidth: 100,
                      }}
                    >
                      {c.status.toLowerCase() === "resolved" &&
                      !c.feedback &&
                      c.user_id === user?.id ? (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => setFeedbackModal(c)}
                          style={{
                            fontSize: 12,
                            padding: "4px 8px",
                            borderRadius: 4,
                            color: "#198754",
                            border: "1px solid #198754",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          Give Feedback
                        </button>
                      ) : c.rating ? (
                        <div style={{ fontSize: 13, color: "#444" }}>
                          <span>⭐ {c.rating}/5</span>
                          <br />
                          <small>{c.feedback}</small>
                        </div>
                      ) : (
                        <span style={{ color: "#6c757d" }}>—</span>
                      )}
                
