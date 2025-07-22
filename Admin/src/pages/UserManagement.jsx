// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import Pagination from "react-bootstrap/Pagination";
// import { roleHierarchy } from "../../../backend/utils/roleHierarchy.js";

// function UserManagement() {
//   const { token, user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "",
//     status: "active",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [editUser, setEditUser] = useState(null);
//   const [excelFile, setExcelFile] = useState(null);
//   const [statuses, setStatuses] = useState([]);

//   const navigate = useNavigate();

//   const [page, setPage] = useState(1);
//   const usersPerPage = 10;

//   const indexOfLastUser = page * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(users.length / usersPerPage);

//   useEffect(() => {
//     if (!token) {
//       console.log("token:", token);
//       navigate("/login");
//       return;
//     }
//     fetchUsers();
//     fetchRoles();
//     fetchStatuses();
//   }, [token]);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage("");
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const sortedUsers = res.data.users.sort((a, b) => b.id - a.id);
//       setUsers(sortedUsers);
//       // setUsers(res.data.users);
//       console.log("Fetched users:", res.data.users);
//     } catch (err) {
//       console.error("Failed to load users", err);
//       setMessage("Error loading users.");
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/roles", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRoles(res.data);
//     } catch (err) {
//       console.error("Failed to load roles", err);
//       setMessage("Error loading roles.");
//     }
//   };

//   const fetchStatuses = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/status-options", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStatuses(res.data);
//     } catch (err) {
//       console.error("Failed to fetch statuses", err);
//     }
//   };

//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       if (roleHierarchy[newUser.role] >= roleHierarchy[user.role]) {
//         setMessage("You can't assign a role higher or equal to your own.");
//         return;
//       }

//       await axios.post("http://localhost:5001/auth/register", newUser, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       //       const createdUser = res.data.user;

//       // setUsers(prevUsers => [createdUser, ...prevUsers]);
//       setMessage("User added successfully!");
//       setNewUser({ name: "", email: "", password: "", role: "" });
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       setMessage(err?.response?.data?.message || "Error adding user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditUser = (targetUser) => {
//     if (roleHierarchy[targetUser.role] >= roleHierarchy[user.role]) {
//       setMessage("You can't edit users with a higher or equal role.");
//       return;
//     }

//     setEditUser({
//       ...targetUser,
//       role_id: roles.find((r) => r.name === targetUser.role)?.id || "",
//     });
//   };

//   const handleUpdateUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       await axios.put(
//         `http://localhost:5001/auth/users/${editUser.id}`,
//         editUser,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setMessage("User updated successfully!");
//       setEditUser(null);
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       setMessage(err?.response?.data?.message || "Error updating user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //   const handleDelete = async (id,targetUser) => {
//   //     if (!window.confirm("Are you sure you want to delete this user?")) return;

//   //     try {
//   //       await axios.delete(`http://localhost:5001/auth/users/${id}`, {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       setMessage("User deleted.");
//   //       fetchUsers();
//   //     } catch (err) {
//   //       console.error(err);
//   //       setMessage("Error deleting user.");
//   //     }
//   //   };

//   const handleDelete = async (id, targetUser) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     if (!user?.role || !targetUser?.role) {
//       setMessage("Missing role information.");
//       return;
//     }

//     if (roleHierarchy[targetUser.role] >= roleHierarchy[user.role]) {
//       setMessage("You can't delete users with a higher or equal role.");
//       return;
//     }

//     try {
//       await axios.delete(`http://localhost:5001/auth/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage("User deleted.");
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       setMessage("Error deleting user.");
//     }
//   };

//   const handleExcelExport = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5001/auth/users/export/excel",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           responseType: "blob",
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "users.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       setMessage("Excel exported successfully!");
//     } catch (error) {
//       console.error("Export failed:", error);
//       setMessage("Error exporting Excel file.");
//     }
//   };

//   return (
//     <div className="container-fluid mt-5 p-2 border shadow-sm">
//       <div className="p-4 d-flex justify-content-between align-items-center">
//         <div className="col-sm-6">
//           <h1 className="m-0 text-dark">User Management</h1>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active">User Management</li>
//             </ol>
//           </div>
//         </div>

//         {/* <h4 className="mb-0 fw-semibold text-primary">User Management</h4> */}
//         {/* {user?.role === "admin" && ( */}

//         <div className="d-flex gap-3">
//           <button
//             className="btn btn-outline-success ms-2"
//             onClick={handleExcelExport}
//           >
//             <i className="fas fa-file-export me-2"></i> Export Excel
//           </button>

//           <button
//             className="btn btn-success d-flex align-items-center"
//             data-bs-toggle="modal"
//             data-bs-target="#addUserModal"
//           >
//             <i className="fas fa-plus me-2"></i> Add User
//           </button>
//           {/* )} */}
//         </div>
//       </div>

//       <div
//         className="modal fade"
//         id="addUserModal"
//         tabIndex="-1"
//         aria-labelledby="addUserModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-lg">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="addUserModalLabel">
//                 Add New User
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <form onSubmit={handleAddUser}>
//               <div className="modal-body">
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <input
//                       type="text"
//                       placeholder="Name"
//                       className="form-control"
//                       value={newUser.name}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, name: e.target.value })
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input
//                       type="email"
//                       placeholder="Email"
//                       className="form-control"
//                       value={newUser.email}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, email: e.target.value })
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <input
//                       type="password"
//                       placeholder="Password"
//                       className="form-control"
//                       value={newUser.password}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, password: e.target.value })
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <select
//                       className="form-control"
//                       value={newUser.role}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, role: e.target.value })
//                       }
//                       required
//                     >
//                       {/* <option value="">Select Role</option>
//                       {roles.map((role) => (
//                         <option key={role.id} value={role.name}>
//                           {role.name}
//                         </option> */}
//                       {roles
//                         .filter(
//                           (r) =>
//                             roleHierarchy[r.name] < roleHierarchy[user.role]
//                         )
//                         .map((role) => (
//                           <option key={role.id} value={role.name}>
//                             {role.name}
//                           </option>
//                         ))}
//                     </select>
//                   </div>
//                   <div className="col-md-6">
//                     <select
//                       className="form-control"
//                       value={newUser.status}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, status: e.target.value })
//                       }
//                     >
//                       {statuses.map((status) => (
//                         <option key={status} value={status}>
//                           {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-success"
//                   type="submit"
//                   disabled={loading}
//                 >
//                   {loading ? "Adding..." : "Add User"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Edit User Form */}
//       {editUser && (
//         <div
//           className="modal fade show"
//           style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//           tabIndex="-1"
//           role="dialog"
//         >
//           <div className="modal-dialog modal-lg" role="document">
//             <div className="modal-content">
//               <form onSubmit={handleUpdateUser}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">Edit User</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setEditUser(null)}
//                     aria-label="Close"
//                   ></button>
//                 </div>

//                 <div className="modal-body">
//                   <div className="row g-2">
//                     <div className="col-md-6">
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Name"
//                         value={editUser.name}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, name: e.target.value })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <input
//                         type="email"
//                         className="form-control"
//                         placeholder="Email"
//                         value={editUser.email}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, email: e.target.value })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <input
//                         type="password"
//                         className="form-control"
//                         placeholder="Password"
//                         value={editUser.password}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, password: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       {/* <select
//                         className="form-control"
//                         value={editUser.role}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, role: e.target.value })
//                         }
//                         required
//                       > */}
//                       <select
//                         className="form-control"
//                         value={editUser.role}
//                         onChange={(e) => {
//                           const selectedRole = roles.find(
//                             (r) => r.name === e.target.value
//                           );
//                           setEditUser({
//                             ...editUser,
//                             role: selectedRole.name,
//                             role_id: selectedRole.id,
//                           });
//                         }}
//                         required
//                       >
//                         {/* <option value="">Select Role</option>
//                         {roles.map((role) => (
//                           <option key={role.id} value={role.name}>
//                             {role.name}
//                           </option> */}
//                         {roles
//                           .filter(
//                             (r) =>
//                               roleHierarchy[r.name] < roleHierarchy[user.role]
//                           )
//                           .map((role) => (
//                             <option key={role.id} value={role.name}>
//                               {role.name}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                     <div className="col-md-6">
//                       <select
//                         className="form-control"
//                         value={editUser.status}
//                         onChange={(e) =>
//                           setEditUser({ ...editUser, status: e.target.value })
//                         }
//                       >
//                         {statuses.map((status) => (
//                           <option key={status} value={status}>
//                             {status.charAt(0).toUpperCase() + status.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setEditUser(null)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? "Updating..." : "Update User"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* User List */}
//       <div className="bg-white p-4 rounded shadow-sm mt-2">
//         <h5 className="container mt-2 p-3 d-flex justify-content-between align-items-center border rounded shadow-sm bg-light">
//           User List
//         </h5>

//         <table className="table table-hover align-middle mt-4 mb-0">
//           <thead className="bg-secondary text-white">
//             <tr>
//               <th scope="col">ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Status</th>
//               <th>Role</th>
//               <th className="text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center text-muted py-4">
//                   No users found
//                 </td>
//               </tr>
//             ) : (
//               currentUsers.map((userInTable) => (
//                 <tr key={userInTable.id}>
//                   <td>{userInTable.id}</td>
//                   {/* <td>{indexOfFirstUser + index + 1}</td> */}
//                   {/* <td className="fw-semibold">
//                     {userInTable.name
//                       .toLowerCase()
//                       .split(" ")
//                       .map(
//                         (word) => word.charAt(0).toUpperCase() + word.slice(1)
//                       )
//                       .join(" ")}
//                   </td> */}
//                   <td
//                     className="fw-semibold text-primary"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => navigate(`/users/${userInTable.id}`)}
//                   >
//                     {userInTable.name
//                       .toLowerCase()
//                       .split(" ")
//                       .map(
//                         (word) => word.charAt(0).toUpperCase() + word.slice(1)
//                       )
//                       .join(" ")}
//                   </td>
//                   <td>{userInTable.email}</td>
//                   <td>
//                     <span
//                       className={`badge px-3 py-2 text-uppercase fw-semibold`}
//                       style={{
//                         backgroundColor:
//                           userInTable.status === "active"
//                             ? "#d4edda"
//                             : "#f8d7da",
//                         color:
//                           userInTable.status === "active"
//                             ? "#155724"
//                             : "#721c24",
//                         borderRadius: "5px",
//                         fontSize: "0.65rem",
//                       }}
//                     >
//                       {userInTable.status}
//                     </span>
//                   </td>
//                   <td>
//                     {userInTable.role.charAt(0).toUpperCase() +
//                       userInTable.role.slice(1)}
//                   </td>
//                   {/* <td className="text-center">
//                     <button
//                       className="btn btn-primary btn-sm"
//                       onClick={() => handleEditUser(userInTable)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-danger btn-sm ms-2"
//                       onClick={() => handleDelete(userInTable.id)}
//                     >
//                       Delete
//                     </button>
//                   </td> */}
//                   <td className="text-center">
//                     <button
//                       className="btn btn-outline-primary btn-sm"
//                       onClick={() => handleEditUser(userInTable)}
//                       title="Edit"
//                     >
//                       <i className="fas fa-edit"></i>
//                     </button>

//                     <button
//                       className="btn btn-outline-danger btn-sm ms-2"
//                       onClick={() => handleDelete(userInTable.id, userInTable)}
//                       title="Delete"
//                     >
//                       <i className="fas fa-trash-alt"></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         <div
//           className="d-flex justify-content-between align-items-center px-3 mt-2 text-muted"
//           style={{ fontSize: "0.9rem" }}
//         >
//           <span>
//             {users.length > 0 && (
//               <>
//                 Showing {indexOfFirstUser + 1} to{" "}
//                 {Math.min(indexOfLastUser, users.length)} of {users.length}
//               </>
//             )}
//           </span>
//         </div>

//         <Pagination className="d-flex mt-3 justify-content-center">
//           <Pagination.Prev
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//           />

//           {[...Array(totalPages)].map((_, idx) => (
//             <Pagination.Item
//               key={idx + 1}
//               active={idx + 1 === page}
//               onClick={() => setPage(idx + 1)}
//             >
//               {idx + 1}
//             </Pagination.Item>
//           ))}

//           <Pagination.Next
//             onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={page === totalPages}
//           />
//         </Pagination>
//       </div>
//     </div>
//   );
// }

// export default UserManagement;



// // // Updated version of UserManagement with same card layout as ComplaintManagement
// // import { useEffect, useState, useContext } from "react";
// // import axios from "axios";
// // import { AuthContext } from "../context/AuthContext.jsx";
// // import { useNavigate } from "react-router-dom";
// // import Pagination from "react-bootstrap/Pagination";
// // import { roleHierarchy } from "../../../backend/utils/roleHierarchy.js";

// // function UserManagement() {
// //   const { token, user } = useContext(AuthContext);
// //   const [users, setUsers] = useState([]);
// //   const [roles, setRoles] = useState([]);
// //   const [statuses, setStatuses] = useState([]);
// //   const [page, setPage] = useState(1);
// //   const usersPerPage = 10;

// //   const indexOfLastUser = page * usersPerPage;
// //   const indexOfFirstUser = indexOfLastUser - usersPerPage;
// //   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
// //   const totalPages = Math.ceil(users.length / usersPerPage);

// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (!token) navigate("/login");
// //     fetchUsers();
// //     fetchRoles();
// //     fetchStatuses();
// //   }, [token]);

// //   const fetchUsers = async () => {
// //     const res = await axios.get("http://localhost:5001/auth/users", {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     setUsers(res.data.users);
// //   };

// //   const fetchRoles = async () => {
// //     const res = await axios.get("http://localhost:5001/auth/roles", {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     setRoles(res.data);
// //   };

// //   const fetchStatuses = async () => {
// //     const res = await axios.get("http://localhost:5001/auth/status-options", {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     setStatuses(res.data);
// //   };

// //   const statusCounts = users.reduce((acc, u) => {
// //     const key = u.status.toLowerCase();
// //     acc[key] = (acc[key] || 0) + 1;
// //     return acc;
// //   }, {});
// //   statusCounts.total = users.length;

// //   const statusTextColors = {
// //     total: "text-dark",
// //     active: "text-success",
// //     inactive: "text-danger",
// //     pending: "text-warning",
// //   };

// //   const statusIcons = {
// //     total: "fas fa-users",
// //     active: "fas fa-user-check",
// //     inactive: "fas fa-user-times",
// //     pending: "fas fa-user-clock",
// //   };

// //   return (
// //     <div className="container-fluid mt-5 p-3 border shadow-sm bg-light rounded">
// //       <div className="d-flex justify-content-between align-items-center mb-3">
// //         <h3>User Management</h3>
// //       </div>

// //       {/* Summary Cards */}
// //       <div className="row">
// //         {[...['total'], ...Object.keys(statusCounts).filter(k => k !== 'total')].map((key) => {
// //           const label = key.charAt(0).toUpperCase() + key.slice(1);
// //           const count = statusCounts[key] || 0;
// //           const color = statusTextColors[key] || "text-muted";
// //           const icon = statusIcons[key] || "fas fa-user";

// //           return (
// //             <div className="col-md-3 col-sm-6 mb-3" key={key}>
// //               <div className="card shadow-sm small-card border">
// //                 <div className="card-body d-flex justify-content-between align-items-center">
// //                   <div>
// //                     <h6 className={`${color} text-uppercase mb-1`} style={{ fontSize: "0.75rem" }}>{label}</h6>
// //                     <h5 className={`fw-bold ${color} mb-0`}>{count}</h5>
// //                   </div>
// //                   <i className={`${icon} fa-2x ${color}`}></i>
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* User Table */}
// //       <div className="table-responsive mt-3">
// //         <table className="table table-bordered table-hover">
// //           <thead className="table-dark">
// //             <tr>
// //               <th>ID</th>
// //               <th>Name</th>
// //               <th>Email</th>
// //               <th>Status</th>
// //               <th>Role</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {currentUsers.length === 0 ? (
// //               <tr>
// //                 <td colSpan="5" className="text-center">No users found.</td>
// //               </tr>
// //             ) : (
// //               currentUsers.map((u) => (
// //                 <tr key={u.id}>
// //                   <td>{u.id}</td>
// //                   <td>{u.name}</td>
// //                   <td>{u.email}</td>
// //                   <td>
// //                     <span className={`badge px-3 py-2 text-uppercase fw-semibold ${
// //                       u.status === "active"
// //                         ? "bg-success text-white"
// //                         : u.status === "inactive"
// //                         ? "bg-danger text-white"
// //                         : "bg-warning text-dark"
// //                     }`}>
// //                       {u.status}
// //                     </span>
// //                   </td>
// //                   <td>{u.role}</td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       <Pagination className="d-flex justify-content-center mt-3">
// //         <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
// //         {[...Array(totalPages)].map((_, i) => (
// //           <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
// //             {i + 1}
// //           </Pagination.Item>
// //         ))}
// //         <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
// //       </Pagination>
// //     </div>
// //   );
// // }

// // export default UserManagement;



// Full updated UserManagement.jsx
import * as bootstrap from "bootstrap";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import { roleHierarchy } from "../../../backend/utils/roleHierarchy.js";

function UserManagement() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "", status: "active" });
  const [editUser, setEditUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();
  // const usersPerPage = 10;

  const filteredUsers = filterStatus === "all" ? users : users.filter((u) => u.status === filterStatus);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfFirstUser = (page - 1) * usersPerPage;
  const indexOfLastUser = indexOfFirstUser + usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    if (!token) navigate("/login");
    fetchUsers();
    fetchRoles();
    fetchStatuses();
  }, [token]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5001/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sortedUsers = res.data.users.sort((a, b) => b.id - a.id);
    setUsers(sortedUsers);
  };

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:5001/auth/roles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRoles(res.data);
  };

  const fetchStatuses = async () => {
    const res = await axios.get("http://localhost:5001/auth/status-options", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStatuses(res.data);
  };

  
const handleAddUser = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    if (roleHierarchy[newUser.role] >= roleHierarchy[user.role]) {
      setMessage("You can't assign a role higher or equal to your own.");
      setLoading(false);
      return;
    }

    await axios.post("http://localhost:5001/auth/register", newUser, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessage("User added successfully!");
    setNewUser({ name: "", email: "", password: "", mobile: "", role: "", status: "active" });


    fetchUsers(); 
    await fetchRoles();


  } catch (err) {
    console.error(err);
    setMessage(err?.response?.data?.message || "Error adding user");
  } finally {
    setLoading(false);
  }
};



  const handleEditUser = (targetUser) => {
    if (roleHierarchy[targetUser.role] >= roleHierarchy[user.role]) {
      setMessage("You can't edit users with a higher or equal role.");
      return;
    }
    setEditUser(targetUser);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5001/auth/users/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...editUser } : u))
      );
      setMessage("User updated successfully!");
      setEditUser(null);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, targetUser) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    if (roleHierarchy[targetUser.role] >= roleHierarchy[user.role]) {
      setMessage("You can't delete users with a higher or equal role.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setMessage("User deleted.");
    } catch (err) {
      setMessage("Error deleting user.");
    }
  };

  const statusCounts = users.reduce(
    (acc, u) => {
      const key = u.status.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    { all: users.length }
  );

  const statusTextColors = {
    all: "text-dark",
    active: "text-success",
    inactive: "text-danger",
    // pending: "text-warning",
  };

  const statusIcons = {
    all: "fas fa-users",
    active: "fas fa-user-check",
    inactive: "fas fa-user-times",
    // pending: "fas fa-user-clock",
  };

  const cardStatusList = ["all", "active", "inactive"];

  return (

    <div className="container-fluid border shadow-sm bg-light rounded" style={{marginTop:"100px", width:"98%"}}>

      {/* Breadcrumbs */}
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div>
          <h3>User Management</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Users
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addUserModal">
            <i className="fas fa-plus me-2"></i> Add User
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="row mb-3">
        {cardStatusList.map((key) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          const count = statusCounts[key] || 0;
          const color = statusTextColors[key] || "text-muted";
          const icon = statusIcons[key] || "fas fa-user";

          return (
            <div className="col-md-3 col-sm-6 mb-2" key={key}>
              {/* <div
                className={`card shadow-sm small-card border ${filterStatus === key ? "border-primary" : ""}`}
                onClick={() => setFilterStatus(key)}
                style={{ cursor: "pointer" }}
              > */}
              <div
  className={`card shadow-sm small-card border ${
    filterStatus === key
      ? color.includes("text-success") ? "border-success"
      : color.includes("text-danger") ? "border-danger"
      : color.includes("text-warning") ? "border-warning"
      : color.includes("text-dark") ? "border-dark"
      : "border-secondary"
    : ""
  }`}
  onClick={() => setFilterStatus(key)}
  style={{ cursor: "pointer" }}
>

                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className={`${color} text-uppercase mb-1`} style={{ fontSize: "0.75rem" }}>{label}</h6>
                    <h5 className={`fw-bold ${color} mb-0`}>{count}</h5>
                  </div>
                  <i className={`${icon} fa-2x ${color}`}></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>



      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2 px-2">
  <div>
    <span className="text-muted small">
      Showing <strong>{indexOfFirstUser + 1}</strong> to <strong>{Math.min(indexOfLastUser, filteredUsers.length)}</strong> of <strong>{filteredUsers.length}</strong> users
    </span>
  </div>

  <div className="d-flex align-items-center">
    <label className="me-2 mb-0 small fw-medium text-nowrap">Rows per page:</label>
    <select
      className="form-select form-select-sm"
      style={{ width: "100px" }}
      value={usersPerPage}
      onChange={(e) => {
        setPage(1); // reset to page 1 when per page changes
        setUsersPerPage(Number(e.target.value));
      }}
    >
      {[10, 50, 100].map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </div>
</div>


<div className="table-responsive mt-4 shadow-sm rounded-3">
  <table className="table table-hover align-middle mb-0 border rounded-3 overflow-hidden">
    <thead className="table-light fw-semibold text-nowrap">
      <tr>
        <th scope="col" >ID</th>
        <th scope="col" >Name</th>
        <th scope="col">Email</th>
        <th scope="col" >Mobile</th>
        <th scope="col" >Status</th>
        <th scope="col" >Role</th>
        <th scope="col" className="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentUsers.length === 0 ? (
        <tr>
          <td colSpan="6" className="text-center py-4 text-muted">No users found.</td>
        </tr>
      ) : (
        currentUsers.map((u) => (
          <tr key={u.id} className="text-nowrap">
            <td>{u.id}</td>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.mobile}</td>
            <td>
              <span className={`badge rounded-pill px-3 py-2 fw-medium text-uppercase small
                ${u.status === "active"
                  ? "bg-success-subtle text-success"
                  : u.status === "inactive"
                  ? "bg-danger-subtle text-danger"
                  : "bg-warning-subtle text-warning"
                }`}>
                {u.status}
              </span>
            </td>
            <td>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</td>
            <td className="text-center">
              <button
                className="btn btn-sm btn-outline-primary me-1"
                title="Edit"
                onClick={() => handleEditUser(u)}
              >
                <i className="fas fa-pen" />
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                title="Delete"
                onClick={() => handleDelete(u.id, u)}
              >
                <i className="fas fa-trash" />
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      {/* Pagination */}
      <Pagination className="d-flex justify-content-center mt-3">
        <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
      </Pagination>

      {/* Modals for Add/Edit User */}
      {/* Add User Modal */}
      <div className="modal fade" id="addUserModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleAddUser}>
              <div className="modal-header">
                <h5 className="modal-title">Add User</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="row g-2">
                  <div className="col-md-6">
                    <input type="text" placeholder="Name" className="form-control" value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <input type="email" placeholder="Email" className="form-control" value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <input type="password" placeholder="Password" className="form-control" value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                  </div>



                  <div className="col-md-6">
                    <input 
                    type="tel" 
                    placeholder="Mobile" 
                    className="form-control" 
                    value={newUser.mobile}
                    maxLength={10}
                      onChange={(e) => 
                      {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
                        setNewUser({ ...newUser, mobile: e.target.value })} 

                      }
                    }
                      required />
                  </div>





                  <div className="col-md-6">
                    <select className="form-control" value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} required>
                      <option value="">Select Role</option>
                      {roles.filter((r) => roleHierarchy[r.name] < roleHierarchy[user.role])
                        .map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <select className="form-control" value={newUser.status}
                      onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-success" type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleUpdateUser}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button className="btn-close" onClick={() => setEditUser(null)} />
                </div>
                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <input type="text" className="form-control" value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <input type="email" className="form-control" value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <input type="password" className="form-control" placeholder="Password"
                        value={editUser.password || ""} onChange={(e) =>
                          setEditUser({ ...editUser, password: e.target.value })} />
                    </div>


                    
                    <div className="col-md-6">
                    <input type="text" placeholder="Mobile" className="form-control" value={editUser.mobile || ""}
                      onChange={(e) => setEditUser({ ...editUser, mobile: e.target.value })} required />
                    </div>


                    <div className="col-md-6">
                      <select className="form-control" value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} required>
                        {roles.filter((r) => roleHierarchy[r.name] < roleHierarchy[user.role])
                          .map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <select className="form-control" value={editUser.status}
                        onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}>
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
