// import React, { useState, useEffect, useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Pagination from "react-bootstrap/Pagination";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function ComplaintManagement() {
//   const { token, user } = useContext(AuthContext); // get user from context
//   const [users, setUsers] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [error, setError] = useState(null);
//   const [modalDescription, setModalDescription] = useState(null);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [modalImage, setModalImage] = useState(null);
//   const location = useLocation();

//   const complaintsPerPage = 10;

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users);
//     } catch (err) {
//       console.error("Failed to load users", err);
//       setError("Error loading users.");
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const categoryRes = await axios.get(
//         "http://localhost:5001/auth/categories",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setCategoryList(categoryRes.data);
//     } catch (err) {
//       console.error("Failed to load categories:", err);
//       setError("Failed to load categories.");
//     }
//   };

//   const fetchComplaints = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/complaints", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setComplaints(res.data);
//     } catch (err) {
//       console.error("Failed to load complaints:", err.response || err.message);
//       setError(err.response?.data?.message || "Failed to load complaints.");
//     }
//   };

//   // useEffect(() => {
//   //   const fetchStatusOptions = async () => {
//   //     try {
//   //       const res = await axios.get(
//   //         "http://localhost:5001/auth/complaints/status-options",
//   //         {
//   //           headers: { Authorization: `Bearer ${token}` },
//   //         }
//   //       );
//   //       setStatusOptions(res.data);
//   //     } catch (err) {
//   //       console.error("Failed to load status options:", err);
//   //     }
//   //   };

//   //   fetchStatusOptions();
//   // }, [token]);

//   useEffect(() => {
//     const fetchStatusOptions = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5001/auth/complaints/status-options",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log("Status options fetched:", res.data); // Check this output
//         setStatusOptions(res.data);
//       } catch (err) {
//         console.error("Failed to load status options:", err);
//       }
//     };

//     fetchStatusOptions();
//   }, [token]);

//   const handleStatusChange = async (complaintId, newStatus) => {
//     try {
//       await axios.put(
//         `http://localhost:5001/auth/complaints/${complaintId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setComplaints((prevComplaints) =>
//         prevComplaints.map((comp) =>
//           comp.id === complaintId ? { ...comp, status: newStatus } : comp
//         )
//       );
//       toast.success("Status updated successfully");
//     } catch (err) {
//       console.error("Failed to update complaint status:", err);
//       toast.error("Error updating status, please try again.");
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchCategories();
//       fetchComplaints();
//     }
//   }, [token, location]);

//   const handleImageClick = (imagePath) => {
//     setModalImage(imagePath);
//   };

//   const closeModal = () => {
//     setModalImage(null);
//   };

//   // Maps for fast lookup
//   const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
//   const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

//   // Filter complaints based on role:
//   const filteredComplaints =
//     user?.role === "Super Admin"
//       ? complaints
//       : complaints.filter((c) => c.user_id === user?.id);

//   const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
//   const indexOfLastComplaint = page * complaintsPerPage;
//   const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
//   const currentComplaint = filteredComplaints.slice(
//     indexOfFirstComplaint,
//     indexOfLastComplaint
//   );

//   return (
//     <div className="container-fluid mt-5 p-2 border shadow-sm">
//       <div className="p-4 d-flex justify-content-between align-items-center">
//         <div className="col-sm-6">
//           <h1 className="m-0 text-dark">Complaint</h1>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <Link to="/">Home</Link>
//               </li>
//               <li className="breadcrumb-item active">Complaint Management</li>
//             </ol>
//           </div>
//         </div>
//         <div>
//           <Link to="/complaints">
//             <button className="btn btn-success d-flex align-items-center">
//               <i className="fas fa-plus me-2"></i> Add Complaint
//             </button>
//           </Link>
//         </div>
//       </div>

//       <div className="row mt-4">
//         <h3>Submitted Complaints</h3>
//         {filteredComplaints.length === 0 ? (
//           <p>No complaints yet.</p>
//         ) : (
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <table className="table table-striped table-bordered">
//               <thead className="table-dark">
//                 <tr>
//                   <th>User ID</th>
//                   <th>Name</th>
//                   <th>Title</th>
//                   <th>Mobile Number</th>
//                   <th>Category</th>
//                   <th>Description</th>
//                   <th>Image</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentComplaint.map((complaint) => {
//                   const userInfo = userMap[complaint.user_id];
//                   const category = categoryMap[parseInt(complaint.categories)];

//                   return (
//                     <tr key={complaint.id}>
//                       <td>{complaint.user_id}</td>
//                       <td>{userInfo ? userInfo.name : "Unknown"}</td>
//                       <td>{complaint.title}</td>
//                       <td>{complaint.mobileNumber}</td>
//                       <td>{category ? category.category_name : "Unknown"}</td>

//                       <td>
//                         {complaint.description.length > 100 ? (
//                           <>
//                             {complaint.description.slice(0, 30)}...
//                             <button
//                               className="btn btn-sm btn-link"
//                               onClick={() =>
//                                 setModalDescription(complaint.description)
//                               }
//                             >
//                               View More
//                             </button>
//                           </>
//                         ) : (
//                           complaint.description
//                         )}
//                       </td>

//                       <td>
//                         {complaint.image ? (
//                           <img
//                             src={`http://localhost:5001/auth/uploads/${complaint.image}`}
//                             alt="Complaint"
//                             style={{
//                               width: "100px",
//                               height: "auto",
//                               cursor: "pointer",
//                             }}
//                             onClick={() =>
//                               handleImageClick(
//                                 `http://localhost:5001/auth/uploads/${complaint.image}`
//                               )
//                             }
//                           />
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>

//                       <td>
//                         <span
//                           style={{
//                             display: "inline-block",
//                             marginRight: "10px",
//                             padding: "4px 8px",
//                             borderRadius: "12px",
//                             backgroundColor:
//                               complaint.status.toLowerCase() === "open"
//                                 ? "#28a745"
//                                 : "#dc3545",
//                             color: "white",
//                             textTransform: "capitalize",
//                             fontSize: "0.85rem",
//                           }}
//                         >
//                           {complaint.status}
//                         </span>

//                         {user?.role === "Super Admin" ? (
//                           <select
//                             value={complaint.status.toLowerCase()}
//                             onChange={(e) =>
//                               handleStatusChange(complaint.id, e.target.value)
//                             }
//                           >
//                             {statusOptions.map((opt) => (
//                               <option
//                                 key={opt.id}
//                                 value={opt.status.toLowerCase()}
//                               >
//                                 {opt.status.charAt(0).toUpperCase() +
//                                   opt.status.slice(1)}
//                               </option>
//                             ))}
//                           </select>
//                         ) : null}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div
//         className="d-flex justify-content-between align-items-center px-3 mt-2 text-muted"
//         style={{ fontSize: "0.9rem" }}
//       >
//         <span>
//           Showing {indexOfFirstComplaint + 1} to{" "}
//           {Math.min(indexOfLastComplaint, filteredComplaints.length)} of{" "}
//           {filteredComplaints.length} complaints
//         </span>
//       </div>

//       {/* Pagination */}
//       <Pagination className="d-flex mt-3 justify-content-center">
//         <Pagination.Prev
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//           disabled={page === 1}
//         />
//         {[...Array(totalPages)].map((_, idx) => (
//           <Pagination.Item
//             key={idx + 1}
//             active={idx + 1 === page}
//             onClick={() => setPage(idx + 1)}
//           >
//             {idx + 1}
//           </Pagination.Item>
//         ))}
//         <Pagination.Next
//           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={page === totalPages}
//         />
//       </Pagination>

//       {/* Modal for Image View */}
//       {modalImage && (
//         <div className="modal" style={modalStyles.overlay} onClick={closeModal}>
//           <div className="modal-content" style={modalStyles.modalContent}>
//             <img
//               src={modalImage}
//               alt="Expanded View"
//               style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Modal for Description */}
//       {modalDescription && (
//         <div
//           className="modal"
//           style={modalStyles.overlay}
//           onClick={() => setModalDescription(null)}
//         >
//           <div className="modal-content" style={modalStyles.modalContent}>
//             <h5>Full Description</h5>
//             <p style={{ whiteSpace: "pre-wrap" }}>{modalDescription}</p>
//             <button
//               className="btn btn-secondary mt-2"
//               onClick={() => setModalDescription(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const modalStyles = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     padding: "20px",
//     overflowY: "auto",
//   },
//   modalContent: {
//     position: "relative",
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "10px",
//     maxWidth: "600px",
//     maxHeight: "80vh",
//     overflowY: "auto",
//     wordBreak: "break-word",
//   },
// };

// export default ComplaintManagement;


// import React, { useState, useEffect, useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Pagination from "react-bootstrap/Pagination";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function ComplaintManagement() {
//   const { token, user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [error, setError] = useState(null);
//   const [modalDescription, setModalDescription] = useState(null);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [modalImage, setModalImage] = useState(null);
//   const location = useLocation();

//   const complaintsPerPage = 10;

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchCategories();
//       fetchComplaints();
//       fetchStatusOptions();
//     }
//   }, [token, location]);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users);
//     } catch (err) {
//       console.error("Failed to load users", err);
//       setError("Error loading users.");
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCategoryList(res.data);
//     } catch (err) {
//       console.error("Failed to load categories:", err);
//       setError("Failed to load categories.");
//     }
//   };

//   const fetchComplaints = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/complaints", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setComplaints(res.data);
//     } catch (err) {
//       console.error("Failed to load complaints:", err.response || err.message);
//       setError(err.response?.data?.message || "Failed to load complaints.");
//     }
//   };

//   const fetchStatusOptions = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/complaints/status-options", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStatusOptions(res.data);
//     } catch (err) {
//       console.error("Failed to load status options:", err);
//     }
//   };

//   const handleStatusChange = async (complaintId, newStatus) => {
//     try {
//       await axios.put(
//         `http://localhost:5001/auth/complaints/${complaintId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setComplaints((prev) =>
//         prev.map((comp) =>
//           comp.id === complaintId ? { ...comp, status: newStatus } : comp
//         )
//       );
//       toast.success("Status updated successfully");
//     } catch (err) {
//       console.error("Failed to update complaint status:", err);
//       toast.error("Error updating status, please try again.");
//     }
//   };

//   const handleImageClick = (imagePath) => setModalImage(imagePath);
//   const closeModal = () => setModalImage(null);

//   const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
//   const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

//   const filteredComplaints =
//     user?.role === "Super Admin"
//       ? complaints
//       : complaints.filter((c) => c.user_id === user?.id);

//   const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
//   const indexOfLastComplaint = page * complaintsPerPage;
//   const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
//   const currentComplaint = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

//   const openCount = complaints.filter(c => c.status.toLowerCase() === "open").length;
//   const closedCount = complaints.filter(c => c.status.toLowerCase() === "closed").length;

//   return (
//     <div className="container-fluid mt-5 p-3 border shadow-sm bg-light rounded">
//       {/* Breadcrumb and Add Complaint */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div>
//           <h3 className="mb-0">Complaint Management</h3>
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb mb-0">
//               <li className="breadcrumb-item"><Link to="/">Home</Link></li>
//               <li className="breadcrumb-item active" aria-current="page">Complaints</li>
//             </ol>
//           </nav>
//         </div>
//         <Link to="/complaints">
//           <button className="btn btn-success">
//             <i className="fas fa-plus me-2"></i>Add Complaint
//           </button>
//         </Link>
//       </div>

//       {/* Summary Cards */}
//       <div className="row mb-4">
//         <div className="col-md-3">
//           <div className="card text-white bg-primary">
//             <div className="card-body d-flex justify-content-between align-items-center">
//               <div>
//                 <h6>Open</h6>
//                 <h4>{openCount}</h4>
//               </div>
//               <i className="fas fa-folder-open fa-2x"></i>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-white bg-success">
//             <div className="card-body d-flex justify-content-between align-items-center">
//               <div>
//                 <h6>Closed</h6>
//                 <h4>{closedCount}</h4>
//               </div>
//               <i className="fas fa-check-circle fa-2x"></i>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Complaint Table */}
//       <div className="table-responsive">
//         <table className="table table-striped table-bordered">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>User</th>
//               <th>Title</th>
//               <th>Mobile</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Image</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentComplaint.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="text-center">No complaints found.</td>
//               </tr>
//             ) : (
//               currentComplaint.map((complaint, index) => {
//                 const userInfo = userMap[complaint.user_id];
//                 const category = categoryMap[parseInt(complaint.categories)];
//                 return (
//                   <tr key={complaint.id}>
//                     <td>{indexOfFirstComplaint + index + 1}</td>
//                     <td>{userInfo?.name || "Unknown"}</td>
//                     <td>{complaint.title}</td>
//                     <td>{complaint.mobileNumber}</td>
//                     <td>{category?.category_name || "Unknown"}</td>
//                     <td>
//                       {complaint.description.length > 30 ? (
//                         <>
//                           {complaint.description.slice(0, 30)}...
//                           <button
//                             className="btn btn-sm btn-link"
//                             onClick={() => setModalDescription(complaint.description)}
//                           >
//                             View More
//                           </button>
//                         </>
//                       ) : (
//                         complaint.description
//                       )}
//                     </td>
//                     <td>
//                       {complaint.image ? (
//                         <img
//                           src={`http://localhost:5001/auth/uploads/${complaint.image}`}
//                           alt="Complaint"
//                           style={{ width: "100px", cursor: "pointer" }}
//                           onClick={() => handleImageClick(`http://localhost:5001/auth/uploads/${complaint.image}`)}
//                         />
//                       ) : (
//                         "N/A"
//                       )}
//                     </td>
//                     <td>
//                       <span
//                         className="badge text-white px-3 py-2"
//                         style={{
//                           backgroundColor: complaint.status.toLowerCase() === "open" ? "#007bff" : "#28a745",
//                           fontSize: "0.8rem",
//                           borderRadius: "10px",
//                         }}
//                       >
//                         {complaint.status}
//                       </span>
//                       {user?.role === "Super Admin" && (
//                         <select
//                           value={complaint.status.toLowerCase()}
//                           onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
//                           className="form-select mt-1"
//                         >
//                           {statusOptions.map((opt) => (
//                             <option key={opt.id} value={opt.status.toLowerCase()}>
//                               {opt.status.charAt(0).toUpperCase() + opt.status.slice(1)}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <Pagination className="d-flex justify-content-center mt-3">
//         <Pagination.Prev onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} />
//         {[...Array(totalPages)].map((_, idx) => (
//           <Pagination.Item key={idx + 1} active={idx + 1 === page} onClick={() => setPage(idx + 1)}>
//             {idx + 1}
//           </Pagination.Item>
//         ))}
//         <Pagination.Next onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} />
//       </Pagination>

//       {/* Modal: Full Description */}
//       {modalDescription && (
//         <div className="modal" style={modalStyles.overlay} onClick={() => setModalDescription(null)}>
//           <div className="modal-content" style={modalStyles.modalContent}>
//             <h5>Full Description</h5>
//             <p>{modalDescription}</p>
//             <button className="btn btn-secondary mt-2" onClick={() => setModalDescription(null)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Modal: Full Image */}
//       {modalImage && (
//         <div className="modal" style={modalStyles.overlay} onClick={closeModal}>
//           <div className="modal-content" style={modalStyles.modalContent}>
//             <img src={modalImage} alt="Expanded View" style={{ width: "100%", maxHeight: "80vh" }} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const modalStyles = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     padding: "20px",
//     overflowY: "auto",
//   },
//   modalContent: {
//     position: "relative",
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "10px",
//     maxWidth: "600px",
//     maxHeight: "80vh",
//     overflowY: "auto",
//     wordBreak: "break-word",
//   },
// };

// export default ComplaintManagement;



// import React, { useState, useEffect, useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Pagination from "react-bootstrap/Pagination";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function ComplaintManagement() {
//   const { token, user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [error, setError] = useState(null);
//   const [modalDescription, setModalDescription] = useState(null);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [modalImage, setModalImage] = useState(null);
//   const location = useLocation();

//   const complaintsPerPage = 10;

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchCategories();
//       fetchComplaints();
//       fetchStatusOptions();
//     }
//   }, [token, location]);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users);
//     } catch (err) {
//       console.error("Failed to load users", err);
//       setError("Error loading users.");
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCategoryList(res.data);
//     } catch (err) {
//       console.error("Failed to load categories:", err);
//       setError("Failed to load categories.");
//     }
//   };

//   const fetchComplaints = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/complaints", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setComplaints(res.data);
//     } catch (err) {
//       console.error("Failed to load complaints:", err.response || err.message);
//       setError(err.response?.data?.message || "Failed to load complaints.");
//     }
//   };

//   const fetchStatusOptions = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/complaints/status-options", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStatusOptions(res.data);
//     } catch (err) {
//       console.error("Failed to load status options:", err);
//     }
//   };

//   const handleStatusChange = async (complaintId, newStatus) => {
//     try {
//       await axios.put(
//         `http://localhost:5001/auth/complaints/${complaintId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setComplaints((prev) =>
//         prev.map((comp) =>
//           comp.id === complaintId ? { ...comp, status: newStatus } : comp
//         )
//       );
//       toast.success("Status updated successfully");
//     } catch (err) {
//       console.error("Failed to update complaint status:", err);
//       toast.error("Error updating status, please try again.");
//     }
//   };

//   const handleImageClick = (imagePath) => setModalImage(imagePath);
//   const closeModal = () => setModalImage(null);

//   const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
//   const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

//   const filteredComplaints =
//     user?.role === "Super Admin"
//       ? complaints
//       : complaints.filter((c) => c.user_id === user?.id);

//   const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
//   const indexOfLastComplaint = page * complaintsPerPage;
//   const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
//   const currentComplaint = filteredComplaints.slice(
//     indexOfFirstComplaint,
//     indexOfLastComplaint
//   );

//   // Create a counts mapping for each status based on complaints
//   const statusCounts = complaints.reduce((acc, comp) => {
//     const key = comp.status.toLowerCase();
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});

//   // Configuration for status colors and icons
// const statusConfig = {
//   open: { color: "text-primary", icon: "fas fa-folder-open" },
//   "in progress": { color: "text-warning", icon: "fas fa-spinner" },
//   resolved: { color: "text-info", icon: "fas fa-check-double" },
//   rejected: { color: "text-danger", icon: "fas fa-times-circle" },
//   awaiting: { color: "text-secondary", icon: "fas fa-hourglass-half" },
//   closed: { color: "text-success", icon: "fas fa-check-circle" },
// };


//   return (
//     <div className="container-fluid mt-5 p-3 border shadow-sm bg-light rounded">
//       {/* Breadcrumb and Add Complaint */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div>
//           <h3 className="mb-0">Complaint Management</h3>
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb mb-0">
//               <li className="breadcrumb-item">
//                 <Link to="/">Home</Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">
//                 Complaints
//               </li>
//             </ol>
//           </nav>
//         </div>
//         <Link to="/complaints">
//           <button className="btn btn-success">
//             <i className="fas fa-plus me-2"></i>Add Complaint
//           </button>
//         </Link>
//       </div>

//       {/* Dynamic Summary Cards */}
//  <div className="row mb-4">
//   {statusOptions.map((opt) => {
//     const key = opt.status.toLowerCase();
//     const count = statusCounts[key] || 0;
//     const config = statusConfig[key] || { color: "text-dark", icon: "fas fa-question-circle" };

//     return (
//       <div className="col-md-4 mb-3" key={key}>
//         <div className="card border shadow-sm">
//           <div className="card-body d-flex justify-content-between align-items-center">
//             <div>
//               <h6 className={`${config.color} text-uppercase mb-1`}>{opt.status}</h6>
//               <h4 className={`${config.color} mb-0`}>{count}</h4>
//             </div>
//             <i className={`${config.icon} fa-2x ${config.color}`}></i>
//           </div>
//         </div>
//       </div>
//     );
//   })}
// </div>


//       {/* Complaint Table */}
//       <div className="table-responsive">
//         <table className="table table-striped table-bordered">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>User</th>
//               <th>Title</th>
//               <th>Mobile</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Image</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentComplaint.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No complaints found.
//                 </td>
//               </tr>
//             ) : (
//               currentComplaint.map((complaint, index) => {
//                 const userInfo = userMap[complaint.user_id];
//                 const category = categoryMap[parseInt(complaint.categories)];
//                 return (
//                   <tr key={complaint.id}>
//                     <td>{indexOfFirstComplaint + index + 1}</td>
//                     <td>{userInfo?.name || "Unknown"}</td>
//                     <td>{complaint.title}</td>
//                     <td>{complaint.mobileNumber}</td>
//                     <td>{category?.category_name || "Unknown"}</td>
//                     <td>
//                       {complaint.description.length > 30 ? (
//                         <>
//                           {complaint.description.slice(0, 30)}...
//                           <button
//                             className="btn btn-sm btn-link"
//                             onClick={() => setModalDescription(complaint.description)}
//                           >
//                             View More
//                           </button>
//                         </>
//                       ) : (
//                         complaint.description
//                       )}
//                     </td>
//                     <td>
//                       {complaint.image ? (
//                         <img
//                           src={`http://localhost:5001/auth/uploads/${complaint.image}`}
//                           alt="Complaint"
//                           style={{ width: "100px", cursor: "pointer" }}
//                           onClick={() =>
//                             handleImageClick(`http://localhost:5001/auth/uploads/${complaint.image}`)
//                           }
//                         />
//                       ) : (
//                         "N/A"
//                       )}
//                     </td>
//                     <td>
//                       <span
//                         className="badge text-white px-3 py-2"
//                         style={{
//                           backgroundColor:
//                             complaint.status.toLowerCase() === "open"
//                               ? "#007bff"
//                               : complaint.status.toLowerCase() === "closed"
//                               ? "#28a745"
//                               : "#6c757d",
//                           fontSize: "0.8rem",
//                           borderRadius: "10px",
//                         }}
//                       >
//                         {complaint.status}
//                       </span>
//                       {user?.role === "Super Admin" && (
//                         <select
//                           value={complaint.status.toLowerCase()}
//                           onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
//                           className="form-select mt-1"
//                         >
//                           {statusOptions.map((opt) => (
//                             <option key={opt.id} value={opt.status.toLowerCase()}>
//                               {opt.status.charAt(0).toUpperCase() + opt.status.slice(1)}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <Pagination className="d-flex justify-content-center mt-3">
//         <Pagination.Prev onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} />
//         {[...Array(totalPages)].map((_, idx) => (
//           <Pagination.Item key={idx + 1} active={idx + 1 === page} onClick={() => setPage(idx + 1)}>
//             {idx + 1}
//           </Pagination.Item>
//         ))}
//         <Pagination.Next onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} />
//       </Pagination>

//       {/* Modal: Full Description */}
//       {modalDescription && (
//         <div className="modal" style={modalStyles.overlay} onClick={() => setModalDescription(null)}>
//           <div className="modal-content" style={modalStyles.modalContent}>
//             <h5>Full Description</h5>
//             <p>{modalDescription}</p>
//             <button className="btn btn-secondary mt-2" onClick={() => setModalDescription(null)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Modal: Full Image */}
//       {modalImage && (
//         <div className="modal" style={modalStyles.overlay} onClick={closeModal}>
//           <div className="modal-content" style={modalStyles.modalContent}>
//             <img src={modalImage} alt="Expanded View" style={{ width: "100%", maxHeight: "80vh" }} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const modalStyles = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     padding: "20px",
//     overflowY: "auto",
//   },
//   modalContent: {
//     position: "relative",
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "10px",
//     maxWidth: "600px",
//     maxHeight: "80vh",
//     overflowY: "auto",
//     wordBreak: "break-word",
//   },
// };

// export default ComplaintManagement;




// ComplaintManagement.jsx (Full code with 8 dynamic summary cards + Total Complaints)


// import React, { useState, useEffect, useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Pagination from "react-bootstrap/Pagination";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function ComplaintManagement() {
//   const { token, user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [modalDescription, setModalDescription] = useState(null);
//   const [modalImage, setModalImage] = useState(null);
//   const [page, setPage] = useState(1);
//   const location = useLocation();
//   const complaintsPerPage = 10;

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchCategories();
//       fetchComplaints();
//       fetchStatusOptions();
//     }
//   }, [token, location]);

//   const fetchUsers = async () => {
//     const res = await axios.get("http://localhost:5001/auth/users", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUsers(res.data.users);
//   };

//   const fetchCategories = async () => {
//     const res = await axios.get("http://localhost:5001/auth/categories", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setCategoryList(res.data);
//   };

//   const fetchComplaints = async () => {
//     const res = await axios.get("http://localhost:5001/auth/complaints", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setComplaints(res.data);
//   };

//   const fetchStatusOptions = async () => {
//     const res = await axios.get("http://localhost:5001/auth/complaints/status-options", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setStatusOptions(res.data);
//   };

//   const handleStatusChange = async (id, status) => {
//     await axios.put(`http://localhost:5001/auth/complaints/${id}/status`, { status }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
//     toast.success("Status updated");
//   };

//   const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
//   const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

//   const filteredComplaints = user?.role === "Super Admin"
//     ? complaints
//     : complaints.filter((c) => c.user_id === user?.id);

//   const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
//   const currentComplaint = filteredComplaints.slice(
//     (page - 1) * complaintsPerPage,
//     page * complaintsPerPage
//   );

//   const statusCounts = complaints.reduce((acc, c) => {
//     const key = c.status.toLowerCase();
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});
//   statusCounts.total = complaints.length;

//   const uniqueStatuses = Array.from(new Set(statusOptions.map((s) => s.status.toLowerCase())));
//   const allKeys = ["total", ...uniqueStatuses];

//   const statusColors = {
//     pending: "text-warning",
//     open: "text-primary",
//     "in progress": "text-info",
//     awaiting: "text-secondary",
//     resolved: "text-success",
//     rejected: "text-danger",
//     closed: "text-dark",
//   };

//   const statusIcons = {
//     pending: "fas fa-exclamation-circle",
//     open: "fas fa-folder-open",
//     "in progress": "fas fa-spinner",
//     awaiting: "fas fa-hourglass-half",
//     resolved: "fas fa-check-double",
//     rejected: "fas fa-times-circle",
//     closed: "fas fa-check-circle",
//   };

//   return (
//     <div className="container-fluid mt-5 p-3 border shadow-sm bg-light rounded">
//       <div className="d-flex justify-content-between mb-3">
//         <h3>Complaint Management</h3>
//         <Link to="/complaints">
//           <button className="btn btn-success">
//             <i className="fas fa-plus me-2"></i>Add Complaint
//           </button>
//         </Link>
//       </div>

//       {/* Dynamic Summary Cards */}
//       <div className="row mb-4">
//         {allKeys.map((key) => {
//           const label = key === "total" ? "Total Complaints" : key.charAt(0).toUpperCase() + key.slice(1);
//           const color = statusColors[key] || "text-muted";
//           const icon = statusIcons[key] || "fas fa-question-circle";
//           const count = key === "total"
//             ? complaints.length
//             : complaints.filter((c) => c.status.toLowerCase() === key).length;

//           return (
//             <div className="col-md-3 mb-3" key={key}>
//               <div className="card border shadow-sm">
//                 <div className="card-body d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6 className={`${color} text-uppercase mb-1`}>{label}</h6>
//                     <h4 className={`${color} mb-0`}>{count}</h4>
//                   </div>
//                   <i className={`${icon} fa-2x ${color}`}></i>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Complaint Table */}
//       <div className="table-responsive">
//         <table className="table table-bordered table-hover">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>User</th>
//               <th>Title</th>
//               <th>Mobile</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Image</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentComplaint.length === 0 ? (
//               <tr><td colSpan="8" className="text-center">No complaints found.</td></tr>
//             ) : (
//               currentComplaint.map((c, i) => (
//                 <tr key={c.id}>
//                   <td>{(page - 1) * complaintsPerPage + i + 1}</td>
//                   <td>{userMap[c.user_id]?.name || "Unknown"}</td>
//                   <td>{c.title}</td>
//                   <td>{c.mobileNumber}</td>
//                   <td>{categoryMap[c.categories]?.category_name || "N/A"}</td>
//                   <td>{c.description.slice(0, 30)}{c.description.length > 30 && "..."}</td>
//                   <td>{c.image ? <img src={`http://localhost:5001/auth/uploads/${c.image}`} alt="img" width={80} /> : "N/A"}</td>
//                   <td>
//                     <span className={`badge ${statusColors[c.status.toLowerCase()] || 'text-muted'}`}>
//                       {c.status}
//                     </span>
//                     {user?.role === "Super Admin" && (
//                       <select
//                         value={c.status}
//                         onChange={(e) => handleStatusChange(c.id, e.target.value)}
//                         className="form-select mt-1"
//                       >
//                         {statusOptions.map((s) => (
//                           <option key={s.id} value={s.status}>{s.status}</option>
//                         ))}
//                       </select>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <Pagination className="d-flex justify-content-center mt-3">
//         <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
//         {[...Array(totalPages)].map((_, i) => (
//           <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
//             {i + 1}
//           </Pagination.Item>
//         ))}
//         <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
//       </Pagination>
//     </div>
//   );
// }

// export default ComplaintManagement;



// import React, { useState, useEffect, useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Pagination from "react-bootstrap/Pagination";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function ComplaintManagement() {
//   const { token, user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [modalImage, setModalImage] = useState(null);
//   const [page, setPage] = useState(1);
//   const complaintsPerPage = 10;
//   const location = useLocation();

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchCategories();
//       fetchComplaints();
//       fetchStatusOptions();
//     }
//   }, [token, location]);

//   const fetchUsers = async () => {
//     const res = await axios.get("http://localhost:5001/auth/users", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUsers(res.data.users);
//   };

//   const fetchCategories = async () => {
//     const res = await axios.get("http://localhost:5001/auth/categories", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setCategoryList(res.data);
//   };

//   const fetchComplaints = async () => {
//     const res = await axios.get("http://localhost:5001/auth/complaints", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setComplaints(res.data);
//   };

//   const fetchStatusOptions = async () => {
//     const res = await axios.get("http://localhost:5001/auth/complaints/status-options", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setStatusOptions(res.data);
//   };

//   const handleStatusChange = async (id, status) => {
//     await axios.put(`http://localhost:5001/auth/complaints/${id}/status`, { status }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
//     toast.success("Status updated");
//   };

//   const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
//   const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

//   const filteredComplaints = user?.role === "Super Admin"
//     ? complaints
//     : complaints.filter((c) => c.user_id === user?.id);

//   const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
//   const currentComplaint = filteredComplaints.slice(
//     (page - 1) * complaintsPerPage,
//     page * complaintsPerPage
//   );

//   // Count status occurrences
//   const statusCounts = complaints.reduce((acc, c) => {
//     const key = c.status.toLowerCase();
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});
//   statusCounts.total = complaints.length;

//   const statusColors = [
//     "text-primary",
//     "text-info",
//     "text-warning",
//     "text-success",
//     "text-danger",
//     "text-secondary",
//     "text-dark",
//     "text-teal"
//   ];

//   const getStatusColor = (status, index) => statusColors[index % statusColors.length] || "text-muted";

//   return (
//     <div className="container-fluid mt-5 p-3 border shadow-sm bg-light rounded">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Complaint Management</h3>
//         <Link to="/complaints">
//           <button className="btn btn-success">
//             <i className="fas fa-plus me-2"></i>Add Complaint
//           </button>
//         </Link>
//       </div>

//       {/* Summary Cards: 4 per row */}
//       <div className="row">
//         {["total", ...statusOptions.map((s) => s.status.toLowerCase())].map((key, index) => {
//           const label = key.charAt(0).toUpperCase() + key.slice(1);
//           const count = statusCounts[key] || 0;
//           const color = getStatusColor(key, index);

//           return (
//             <div className="col-md-3 mb-3" key={key}>
//               <div className="card shadow-sm small-card border">
//                 <div className="card-body d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6 className={`${color} text-uppercase mb-1`} style={{ fontSize: "0.75rem" }}>{label}</h6>
//                     <h5 className={`fw-bold ${color} mb-0`}>{count}</h5>
//                   </div>
//                   <i className={`fas fa-circle fa-2x ${color}`}></i>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Complaint Table */}
//       <div className="table-responsive mt-3">
//         <table className="table table-bordered table-hover">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>User</th>
//               <th>Title</th>
//               <th>Mobile</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Image</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentComplaint.length === 0 ? (
//               <tr><td colSpan="8" className="text-center">No complaints found.</td></tr>
//             ) : (
//               currentComplaint.map((c, i) => (
//                 <tr key={c.id}>
//                   <td>{(page - 1) * complaintsPerPage + i + 1}</td>
//                   <td>{userMap[c.user_id]?.name || "Unknown"}</td>
//                   <td>{c.title}</td>
//                   <td>{c.mobileNumber}</td>
//                   <td>{categoryMap[c.categories]?.category_name || "N/A"}</td>
//                   <td>{c.description.slice(0, 30)}{c.description.length > 30 && "..."}</td>
//                   <td>{c.image ? <img src={`http://localhost:5001/auth/uploads/${c.image}`} alt="img" width={80} /> : "N/A"}</td>
//                   <td>
//                     <span className={`badge ${getStatusColor(c.status.toLowerCase())}`}>
//                       {c.status}
//                     </span>
//                     {user?.role === "Super Admin" && (
//                       <select
//                         value={c.status}
//                         onChange={(e) => handleStatusChange(c.id, e.target.value)}
//                         className="form-select mt-1"
//                       >
//                         {statusOptions.map((s) => (
//                           <option key={s.id} value={s.status}>{s.status}</option>
//                         ))}
//                       </select>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <Pagination className="d-flex justify-content-center mt-3">
//         <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
//         {[...Array(totalPages)].map((_, i) => (
//           <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
//             {i + 1}
//           </Pagination.Item>
//         ))}
//         <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
//       </Pagination>
//     </div>
//   );
// }

// export default ComplaintManagement;



// import React, { useState, useEffect, useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Pagination from "react-bootstrap/Pagination";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function ComplaintManagement() {
//   const { token, user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [complaintsPerPage, setComplaintsPerPage] = useState(10);

//   const [statusOptions, setStatusOptions] = useState([]);
//   const [modalImage, setModalImage] = useState(null);
//   const [activeStatus, setActiveStatus] = useState("total");

//   const [page, setPage] = useState(1);
//   const location = useLocation();


//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchCategories();
//       fetchComplaints();
//       fetchStatusOptions();
//     }
//   }, [token, location]);

//   const fetchUsers = async () => {
//     const res = await axios.get("http://localhost:5001/auth/users", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUsers(res.data.users);
//   };

//   const fetchCategories = async () => {
//     const res = await axios.get("http://localhost:5001/auth/categories", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setCategoryList(res.data);
//   };

//   const fetchComplaints = async () => {
//     const res = await axios.get("http://localhost:5001/auth/complaints", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setComplaints(res.data);
//   };

//   const fetchStatusOptions = async () => {
//     const res = await axios.get("http://localhost:5001/auth/complaints/status-options", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setStatusOptions(res.data);
//   };

//   const handleStatusChange = async (id, status) => {
//     await axios.put(`http://localhost:5001/auth/complaints/${id}/status`, { status }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
//     toast.success("Status updated");
//   };

//   const handleImageClick = (imagePath) => {
//     setModalImage(imagePath);
//   };

//   const closeModal = () => {
//     setModalImage(null);
//   };

//   const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
//   const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

//   // const filteredComplaints = user?.role === "Super Admin"
//   //   ? complaints
//   //   : complaints.filter((c) => c.user_id === user?.id);

//   const visibleComplaints = user?.role === "Super Admin"
//   ? complaints
//   : complaints.filter((c) => c.user_id === user?.id);

// const filteredComplaints = activeStatus === "total"
//   ? visibleComplaints
//   : visibleComplaints.filter((c) => c.status.toLowerCase() === activeStatus);


//   const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
//   const currentComplaint = filteredComplaints.slice(
//     (page - 1) * complaintsPerPage,
//     page * complaintsPerPage
//   );

//   const statusCounts = complaints.reduce((acc, c) => {
//     const key = c.status.toLowerCase();
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});
//   statusCounts.total = complaints.length;

//   const statusTextColors = {
//     total: "text-dark",
//     pending: "text-warning",
//     open: "text-primary",
//     "in progress": "text-info",
//     awaiting: "text-secondary",
//     resolved: "text-success",
//     rejected: "text-danger",
//     closed: "text-success",
//   };

//   const statusIcons = {
//     total: "fas fa-list",
//     pending: "fas fa-exclamation-circle",
//     open: "fas fa-folder-open",
//     "in progress": "fas fa-spinner",
//     awaiting: "fas fa-hourglass-half",
//     resolved: "fas fa-check-double",
//     rejected: "fas fa-times-circle",
//     closed: "fas fa-check-circle",
//   };

//   const getStatusBadgeColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-warning text-dark";
//       case "open":
//         return "bg-primary text-white";
//       case "in progress":
//         return "bg-info text-dark";
//       case "awaiting":
//         return "bg-secondary text-white";
//       case "resolved":
//         return "bg-success text-white";
//       case "rejected":
//         return "bg-danger text-white";
//       case "closed":
//         return "bg-success text-white";
//       default:
//         return "bg-light text-dark";
//     }
//   };

//   return (
//     <div className="container-fluid  border shadow-sm bg-light rounded" style={{marginTop:"100px", width:"98%"}}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
      
//   <div>
//     <h3>Complaint Management</h3>
//     <nav aria-label="breadcrumb">
//       <ol className="breadcrumb mb-0">
//         <li className="breadcrumb-item">
//           <Link to="/">Home</Link>
//         </li>
//         <li className="breadcrumb-item active" aria-current="page">
//           Complaint Management
//         </li>
//       </ol>
//     </nav>
//   </div>
//   <Link to="/complaints">
//     <button className="btn btn-success">
//       <i className="fas fa-plus me-2"></i>Add Complaint
//     </button>
//   </Link>
// </div>

  

//       {/* Summary Cards */}
//       {/* <div className="row">
//         {[...["total"], ...statusOptions.map(s => s.status.toLowerCase())].map((key, index) => {
//           const label = key.charAt(0).toUpperCase() + key.slice(1);
//           const count = statusCounts[key] || 0;
//           const color = statusTextColors[key] || "text-muted";
//           const icon = statusIcons[key] || "fas fa-question-circle";

//           return (
//             <div className="col-md-3 col-sm-6 mb-3" key={key}>
//               <div className="card shadow-sm small-card border">
//                 <div className="card-body d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6 className={`${color} text-uppercase mb-1`} style={{ fontSize: "0.75rem" }}>{label}</h6>
//                     <h5 className={`fw-bold ${color} mb-0`}>{count}</h5>
//                   </div>
//                   <i className={`${icon} fa-2x ${color}`}></i>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div> */}

//       <div className="row">
//   {[...["total"], ...statusOptions.map((s) => s.status.toLowerCase())].map((key) => {
//     const label = key.charAt(0).toUpperCase() + key.slice(1);
//     const count = statusCounts[key] || 0;
//     const color = statusTextColors[key] || "text-muted";
//     const icon = statusIcons[key] || "fas fa-question-circle";

//     const isActive = activeStatus === key;

//     return (
//       <div className="col-md-3 col-sm-6 mb-2" key={key}>
//         {/* <div
//           className={`card shadow-sm small-card border ${isActive ? "border-primary" : ""}`}
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setActiveStatus(key);
//             setPage(1);
//           }}
//         > */}
//         <div
//   className={`card shadow-sm small-card border ${
//     isActive
//       ? color.includes("text-success") ? "border-success"
//       : color.includes("text-primary") ? "border-primary"
//       : color.includes("text-danger") ? "border-danger"
//       : color.includes("text-warning") ? "border-warning"
//       : color.includes("text-info") ? "border-info"
//       : color.includes("text-secondary") ? "border-secondary"
//       : "border-dark"
//     : ""
//   }`}
//   style={{ cursor: "pointer" }}
//   onClick={() => {
//     setActiveStatus(key);
//     setPage(1);
//   }}
// >

//           <div className="card-body d-flex justify-content-between align-items-center">
//             <div>
//               <h6 className={`${color} text-uppercase mb-1`} style={{ fontSize: "0.75rem" }}>{label}</h6>
//               <h5 className={`fw-bold ${color} mb-0`}>{count}</h5>
//             </div>
//             <i className={`${icon} fa-2x ${color}`}></i>
//           </div>
//         </div>
//       </div>
//     );
//   })}
// </div>

// <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mt-3 mb-2">
//   {/* Showing info */}
//   <div className="text-muted small">
//     Showing{" "}
//     {filteredComplaints.length === 0
//       ? 0
//       : (page - 1) * complaintsPerPage + 1}{" "}
//     to{" "}
//     {Math.min(page * complaintsPerPage, filteredComplaints.length)} of{" "}
//     {filteredComplaints.length} complaints
//   </div>

//   {/* Rows per page selector */}
//   <div className="d-flex align-items-center">
//     <label className="form-label me-2 mb-0">Rows per page:</label>
//     <select
//       className="form-select form-select-sm"
//       style={{ width: "auto" }}
//       value={complaintsPerPage}
//       onChange={(e) => {
//         setComplaintsPerPage(Number(e.target.value));
//         setPage(1);
//       }}
//     >
//       <option value={10}>10</option>
//       <option value={50}>50</option>
//       <option value={100}>100</option>
//     </select>
//   </div>
// </div>



//       {/* Complaint Table */}
//       <div className="table-responsive mt-3">
//         <table className="table table-bordered table-hover">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>User</th>
//               <th>Title</th>
//               <th>Mobile</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Image</th>
//               <th>Status</th>
//             </tr>
//           </thead>






          
//           <tbody>
//             {currentComplaint.length === 0 ? (
//               <tr><td colSpan="8" className="text-center">No complaints found.</td></tr>
//             ) : (
//               currentComplaint.map((c, i) => (
//                 <tr key={c.id}>
//                   <td>{(page - 1) * complaintsPerPage + i + 1}</td>
//                   <td>{userMap[c.user_id]?.name || "Unknown"}</td>
//                   <td>{c.title}</td>
//                   <td>{c.mobileNumber}</td>
//                   <td>{categoryMap[c.categories]?.category_name || "N/A"}</td>
//                   <td>{c.description.slice(0, 30)}{c.description.length > 30 && "..."}</td>
//                   {/* <td>{c.image ? <img src={`http://localhost:5001/auth/uploads/${c.image}`} alt="img" width={80} /> : "N/A"}</td> */}

//  <td>
//   {c.image ? (
//     <img
//       src={`http://localhost:5001/auth/uploads/${c.image}`}
//       alt="Complaint"
//       style={{ width: "100px", height: "auto", cursor: "pointer" }}
//       onClick={() =>
//         handleImageClick(`http://localhost:5001/auth/uploads/${c.image}`)
//       }
//     />
//   ) : (
//     "N/A"
//   )}
// </td>


//                   <td>
//                     <span className={`badge ${getStatusBadgeColor(c.status.toLowerCase())}`}>
//                       {c.status}
//                     </span>
//                     {user?.role === "Super Admin" && (
//                       <select
//                         value={c.status}
//                         onChange={(e) => handleStatusChange(c.id, e.target.value)}
//                         className="form-select mt-1"
//                       >
//                         {statusOptions.map((s) => (
//                           <option key={s.id} value={s.status}>{s.status}</option>
//                         ))}
//                       </select>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <Pagination className="d-flex justify-content-center mt-3">
//         <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
//         {[...Array(totalPages)].map((_, i) => (
//           <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
//             {i + 1}
//           </Pagination.Item>
//         ))}
//         <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
//       </Pagination>


// {modalImage && (
//   <div
//     className="modal fade show d-block"
//     tabIndex="-1"
//     role="dialog"
//     style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//     onClick={closeModal}
//   >
//     <div
//       className="modal-dialog modal-lg modal-dialog-centered"
//       role="document"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="modal-content">
//         <div className="modal-header">
//           <h5 className="modal-title">Image Preview</h5>
//           <button type="button" className="btn-close" onClick={closeModal}></button>
//         </div>
//         <div className="modal-body text-center">
//           <img
//             src={modalImage}
//             alt="Full Preview"
//             style={{ maxWidth: "100%", maxHeight: "70vh" }}
//           />
//         </div>
//       </div>
//     </div>
//   </div>
// )}


//     </div>
//   );
// }

// export default ComplaintManagement;


import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function ComplaintManagement() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [complaintsPerPage, setComplaintsPerPage] = useState(10);

  const [statusOptions, setStatusOptions] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [activeStatus, setActiveStatus] = useState("total");
  const [selectedUser, setSelectedUser] = useState(null);


  const [page, setPage] = useState(1);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCategories();
      fetchComplaints();
      fetchStatusOptions();
    }
  }, [token, location]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5001/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users);
    console.log(res.data.users)
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5001/auth/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategoryList(res.data);
  };

  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:5001/auth/complaints", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data);
  };

  const fetchStatusOptions = async () => {
    const res = await axios.get("http://localhost:5001/auth/complaints/status-options", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStatusOptions(res.data);
  };

  const handleStatusChange = async (id, status) => {
    await axios.put(`http://localhost:5001/auth/complaints/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    toast.success("Status updated");
  };

  const handleImageClick = (imagePath) => {
    setModalImage(imagePath);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleViewUser = (userId) => {
  const userInfo = userMap[userId];
  setSelectedUser(userInfo);
};


  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

  const visibleComplaints = user?.role === "Super Admin"
    ? complaints
    : complaints.filter((c) => c.user_id === user?.id);

  const filteredComplaints = activeStatus === "total"
    ? visibleComplaints
    : visibleComplaints.filter((c) => c.status.toLowerCase() === activeStatus);

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const currentComplaint = filteredComplaints.slice(
    (page - 1) * complaintsPerPage,
    page * complaintsPerPage
  );

  const statusCounts = complaints.reduce((acc, c) => {
    const key = c.status.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  statusCounts.total = complaints.length;

  const statusTextColors = {
    total: "text-dark",
    pending: "text-warning",
    open: "text-primary",
    "in progress": "text-info",
    awaiting: "text-secondary",
    resolved: "text-success",
    rejected: "text-danger",
    closed: "text-success",
  };

  const statusIcons = {
    total: "fas fa-list",
    pending: "fas fa-exclamation-circle",
    open: "fas fa-folder-open",
    "in progress": "fas fa-spinner",
    awaiting: "fas fa-hourglass-half",
    resolved: "fas fa-check-double",
    rejected: "fas fa-times-circle",
    closed: "fas fa-check-circle",
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "open":
        return "bg-primary text-white";
      case "in progress":
        return "bg-info text-dark";
      case "awaiting":
        return "bg-secondary text-white";
      case "resolved":
        return "bg-success text-white";
      case "rejected":
        return "bg-danger text-white";
      case "closed":
        return "bg-success text-white";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container-fluid border shadow-sm bg-light rounded" style={{ marginTop: "100px", width: "98%" }}>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">

        <div>
          <h3>Complaint Management System</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Complaint Management
              </li>
            </ol>
          </nav>
        </div>
        <Link to="/complaints">
          <button className="btn btn-success">
            <i className="fas fa-plus me-2"></i>Add Complaint
          </button>
        </Link>
      </div>

      {/* Status filter cards */}
      <div className="row">
        {[...["total"], ...statusOptions.map((s) => s.status.toLowerCase())].map((key) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          const count = statusCounts[key] || 0;
          const color = statusTextColors[key] || "text-muted";
          const icon = statusIcons[key] || "fas fa-question-circle";

          const isActive = activeStatus === key;

          return (
            <div className="col-md-3 col-sm-6 mb-2" key={key}>
              <div
                className={`card shadow-sm small-card border ${
                  isActive
                    ? color.includes("text-success") ? "border-success"
                    : color.includes("text-primary") ? "border-primary"
                    : color.includes("text-danger") ? "border-danger"
                    : color.includes("text-warning") ? "border-warning"
                    : color.includes("text-info") ? "border-info"
                    : color.includes("text-secondary") ? "border-secondary"
                    : "border-dark"
                  : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setActiveStatus(key);
                  setPage(1);
                }}
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

      {/* Showing info & rows per page */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mt-3 mb-2">
        <div className="text-muted small">
          Showing{" "}
          {filteredComplaints.length === 0
            ? 0
            : (page - 1) * complaintsPerPage + 1}{" "}
          to{" "}
          {Math.min(page * complaintsPerPage, filteredComplaints.length)} of{" "}
          {filteredComplaints.length} complaints
        </div>

        <div className="d-flex align-items-center">
          <label className="form-label me-2 mb-0">Rows per page:</label>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={complaintsPerPage}
            onChange={(e) => {
              setComplaintsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Complaints table */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Title</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Category</th>
              <th>Description</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentComplaint.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No complaints found.</td>
              </tr>
            ) : (
              currentComplaint.map((c, i) => {
                const userInfo = userMap[c.user_id];
                const category = categoryMap[parseInt(c.categories)];

                return (
                  <tr key={c.id}>
                     <td>{(page - 1) * complaintsPerPage + i + 1}</td>
                    {/* <td>{userInfo?.name || "Unknown"}</td> */}
                    <td>
  ID: {c.user_id} <br />
  Name: {userInfo?.name || "Unknown"}
</td>

                    <td>{c.title}</td>
                    <td>{c.mobileNumber}</td>
                    <td>{c.address}</td>
                    <td>{category?.category_name || "N/A"}</td>
                    <td>{c.description.slice(0, 30)}{c.description.length > 30 && "..."}</td>
                    <td>
                      {c.image ? (
                        <img
                          src={`http://localhost:5001/auth/uploads/${c.image}`}
                          alt="Complaint"
                          style={{ width: "100px", height: "auto", cursor: "pointer" }}
                          onClick={() =>
                            handleImageClick(`http://localhost:5001/auth/uploads/${c.image}`)
                          }
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeColor(c.status.toLowerCase())}`}>
                        {c.status}
                      </span>
                      {user?.role === "Super Admin" && (
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          className="form-select mt-1"
                        >
                          {statusOptions.map((s) => (
                            <option key={s.id} value={s.status}>{s.status}</option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td>
  <button
    className="btn btn-sm"
    onClick={() => handleViewUser(c.user_id)}
  >
    <i className="fas fa-eye"></i> 
  </button>
</td>

                  </tr>
                );
              })
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

      {/* Image Modal */}
      {modalImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Image Preview</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={modalImage}
                  alt="Full Preview"
                  style={{ maxWidth: "100%", maxHeight: "70vh" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}


      {selectedUser && (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    onClick={() => setSelectedUser(null)}
  >
    <div
      className="modal-dialog modal-dialog-centered"
      role="document"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Customer Profile</h5>
          <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
        </div>
        <div className="modal-body">
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Mobile:</strong> {selectedUser.mobile || "N/A"}</p>
          {/* <p><strong>Address:</strong> {selectedUser.address|| "N/A"}</p> */}
          <p><strong>Role:</strong> {selectedUser.role}</p>
          {/* You can show more fields if available */}
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default ComplaintManagement;
