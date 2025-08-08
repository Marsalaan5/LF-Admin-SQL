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
//   const [subCategoryList, setSubCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [complaintsPerPage, setComplaintsPerPage] = useState(10);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [modalImage, setModalImage] = useState(null);
//   const [activeStatus, setActiveStatus] = useState("total");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedComplaintLocation, setSelectedComplaintLocation] =
//     useState(null);
//   const [updatedComplaints, setUpdatedComplaints] = useState(complaints);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [feedbackModal, setFeedbackModal] = React.useState(null);
//   const [rating, setRating] = React.useState("");
//   const [feedbackText, setFeedbackText] = React.useState("");
//   // const [commentInput, setCommentInput] = useState({});
//   const [selectedComplaintForComments, setSelectedComplaintForComments] =
//     useState(null);
//   const [commentInput, setCommentInput] = useState({});
//   const [commentsLoading, setCommentsLoading] = useState(false);
//   const [commentsError, setCommentsError] = useState(null);
//   const [replyToCommentId, setReplyToCommentId] = useState(null);
//   const [replyText, setReplyText] = useState("");

//   const [page, setPage] = useState(1);
//   const location = useLocation();

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchCategories();
//       fetchSubCategories();
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
//     try {
//       const res = await axios.get("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setCategoryList(res.data);
//     } catch (err) {
//       console.error("Failed to load categories:", err);
//       setCategoryList([]);
//     }
//   };

//   const fetchSubCategories = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5001/auth/subcategories`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSubCategoryList(res.data);
//     } catch (err) {
//       console.error("Failed to load subcategories:", err);
//       setSubCategoryList([]);
//     }
//   };

//   const fetchComplaints = async () => {
//     const res = await axios.get("http://localhost:5001/auth/complaints", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setComplaints(res.data);
//   };

//   const fetchStatusOptions = async () => {
//     const res = await axios.get(
//       "http://localhost:5001/auth/complaints/status-options",
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setStatusOptions(res.data);
//   };

//   const handleStatusChange = async (id, status) => {
//     await axios.put(
//       `http://localhost:5001/auth/complaints/${id}/status`,
//       { status },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setComplaints((prev) =>
//       prev.map((c) => (c.id === id ? { ...c, status } : c))
//     );
//     toast.success("Status updated");
//   };

//   const handleAssign = async (complaintId, assignedToId) => {
//     try {
//       await axios.put(
//         `http://localhost:5001/auth/complaints/${complaintId}/assign`,
//         { assignedToId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setComplaints((prev) =>
//         prev.map((c) =>
//           c.id === complaintId
//             ? { ...c, assigned_to: parseInt(assignedToId, 10) }
//             : c
//         )
//       );
//       toast.success("Complaint assigned successfully");
//     } catch {
//       toast.error("Assignment failed");
//     }
//   };

//   const handleSubmitFeedback = async () => {
//     if (!rating) return;

//     try {
//       await axios.put(
//         `http://localhost:5001/auth/complaints/${feedbackModal.id}/feedback`,
//         { rating: Number(rating), feedback: feedbackText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("Feedback submitted");
//       setFeedbackModal(null);
//       setRating("");
//       setFeedbackText("");
//       fetchComplaints();
//     } catch (error) {
//       toast.error("Failed to submit feedback", error);
//     }
//   };

//   const handleImageClick = (imagePath) => setModalImage(imagePath);
//   const closeModal = () => setModalImage(null);
//   const handleViewUser = (uId) => setSelectedUser(userMap[uId]);

//   const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
//   const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

//   const subcategoryMap = Object.fromEntries(
//     subCategoryList.map((s) => [s.id, s])
//   );

//   const validateCategorySubcategoryMapping = () => {
//     complaints.forEach((c) => {
//       if (!categoryMap[c.categories]) {
//         console.warn(
//           `🚨 Complaint ID ${c.id} has an invalid category ID: ${c.categories}`
//         );
//       }

//       if (!subcategoryMap[c.subcategory]) {
//         console.warn(
//           `⚠️ Complaint ID ${c.id} has an invalid subcategory ID: ${c.subcategory}`
//         );
//       }
//     });
//   };

//   const handlePriorityChange = (complaintId, newPriority) => {
//     setIsUpdating(true);

//     const originalPriority = complaints.find(
//       (complaint) => complaint.id === complaintId
//     )?.priority;

//     const updatedComplaintsList = complaints.map((complaint) =>
//       complaint.id === complaintId
//         ? { ...complaint, priority: newPriority }
//         : complaint
//     );

//     setComplaints(updatedComplaintsList);

//     axios
//       .put(
//         `http://localhost:5001/auth/complaints/${complaintId}/priority`,
//         { priority: newPriority },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then((response) => {
//         console.log("Priority updated successfully:", response.data);
//         toast.success("Priority assigned successfully");
//       })
//       .catch((error) => {
//         toast.error("Error updating priority:", error);

//         setComplaints((prevComplaints) =>
//           prevComplaints.map((complaint) =>
//             complaint.id === complaintId
//               ? { ...complaint, priority: originalPriority }
//               : complaint
//           )
//         );
//       })
//       .finally(() => {
//         setIsUpdating(false);
//       });
//   };

//   useEffect(() => {
//     if (
//       complaints.length &&
//       Object.keys(categoryMap).length &&
//       Object.keys(subcategoryMap).length
//     ) {
//       validateCategorySubcategoryMapping();
//     }
//   }, [complaints, categoryMap, subcategoryMap]);

//   const openCommentsModal = async (complaint) => {
//     setSelectedComplaintForComments({ ...complaint, comments: [] });

//     try {
//       const res = await axios.get(
//         `http://localhost:5001/auth/complaints/${complaint.id}/comments`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSelectedComplaintForComments((prev) => ({
//         ...prev,
//         comments: res.data,
//       }));
//     } catch (err) {
//       console.error("Failed to load comments:", err);

//       setSelectedComplaintForComments((prev) => ({
//         ...prev,
//         comments: [],
//       }));
//     }
//   };

//   const handleAddComment = async (complaintId, newComment) => {
//     if (!newComment.trim()) return;

//     try {
//       await axios.post(
//         `http://localhost:5001/auth/complaints/${complaintId}/comments`,
//         { comment: newComment },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Comment Posted");
//       // await openCommentsModal(complaintId);

//       setCommentInput((prev) => ({ ...prev, [complaintId]: "" }));
//     } catch (error) {
//       console.error("Failed to add comment:", error);
//     }
//   };

//   const handleAddReply = async (complaintId, parentCommentId, newReply) => {
//     if (!newReply.trim()) return;

//     try {
//       await axios.post(
//         `http://localhost:5001/auth/complaints/${complaintId}/comments`,
//         { comment: newReply, parent_comment_id: parentCommentId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await fetchComments(complaintId);
//       setReplyText("");
//       setReplyToCommentId(null);
//     } catch (err) {
//       console.error("Failed to add reply:", err);
//     }
//   };

//   const renderComments = (comments, parentId = null) => {
//     return comments
//       .filter((c) => c.parent_comment_id === parentId)
//       .map((comment) => (
//         <div
//           key={comment.id}
//           style={{
//             marginLeft: parentId ? 30 : 0,
//             marginBottom: 16,
//             display: "flex",
//             alignItems: "flex-start",
//             gap: 10,
//           }}
//         >
//           {/* Avatar */}
//           <div
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: "50%",
//               backgroundColor: "#6c757d",
//               color: "white",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 14,
//               fontWeight: "bold",
//               textTransform: "uppercase",
//             }}
//             title={comment.user_name}
//           >
//             {comment.user_name?.charAt(0) || "U"}
//           </div>

//           {/* Comment content */}
//           <div style={{ flex: 1 }}>
//             <strong>{comment.user_name || "User"}</strong>
//             <p className="mb-1">{comment.comment}</p>
//             <small className="text-muted">
//               {new Date(comment.timestamp).toLocaleString()}
//             </small>

//             {/* Reply button */}

//             <div>
//               <button
//                 className="btn btn-link btn-sm p-0 mt-1"
//                 onClick={() =>
//                   setReplyToCommentId(
//                     comment.id === replyToCommentId ? null : comment.id
//                   )
//                 }
//               >
//                 Reply
//               </button>
//             </div>

//             {replyToCommentId === comment.id && (
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAddReply(
//                     selectedComplaintForComments.id,
//                     comment.id,
//                     replyText
//                   );
//                 }}
//                 style={{ marginTop: 6 }}
//               >
//                 <input
//                   type="text"
//                   className="form-control form-control-sm"
//                   placeholder="Write your reply here"
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                 />
//                 <div className="mt-2">
//                   <button type="submit" className="btn btn-primary btn-sm me-2">
//                     Post Reply
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary btn-sm"
//                     onClick={() => setReplyToCommentId(null)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* Render replies */}
//             {renderComments(comments, comment.id)}
//           </div>
//         </div>
//       ));
//   };

//   const visibleComplaints =
//     user?.role === "Super Admin" || user?.role === "Admin"
//       ? complaints
//       : complaints.filter((c) => c.user_id === user?.id);

//   const filteredComplaints =
//     activeStatus === "total"
//       ? visibleComplaints
//       : visibleComplaints.filter(
//           (c) => c.status.toLowerCase() === activeStatus
//         );

//   const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

//   const currentComplaint = filteredComplaints.slice(
//     (page - 1) * complaintsPerPage,
//     page * complaintsPerPage
//   );

//   const statusCounts = filteredComplaints.reduce((acc, c) => {
//     const key = c.status.toLowerCase();
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});
//   statusCounts.total = filteredComplaints.length;

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
//     <div
//       className="container-fluid border shadow-sm bg-light"
//       style={{ marginTop: "100px", width: "98%", borderRadius: "10px" }}
//     >
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <div>
//           <h3>Complaint Management System</h3>
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb mb-0">
//               <li className="breadcrumb-item">
//                 <Link to="/">Home</Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">
//                 Complaint Management
//               </li>
//             </ol>
//           </nav>
//         </div>
//         <Link to="/complaints">
//           <button className="btn btn-success">
//             <i className="fas fa-plus me-2"></i>
//             Add Complaint
//           </button>
//         </Link>
//       </div>

//       {/* Status filter cards */}
//       <div className="row">
//         {[
//           ...["total"],
//           ...statusOptions.map((s) => s.status.toLowerCase()),
//         ].map((key) => {
//           const label = key.charAt(0).toUpperCase() + key.slice(1);
//           const count = statusCounts[key] || 0;
//           const color = statusTextColors[key] || "text-muted";
//           const icon = statusIcons[key] || "fas fa-question-circle";
//           const isActive = activeStatus === key;
//           return (
//             <div className="col-md-3 col-sm-6 mb-2" key={key}>
//               <div
//                 className={`card shadow-sm small-card border ${
//                   isActive ? "border-" + color.split(" ")[1] : ""
//                 }`}
//                 style={{ cursor: "pointer" }}
//                 onClick={() => {
//                   setActiveStatus(key);
//                   setPage(1);
//                 }}
//               >
//                 <div className="card-body d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6
//                       className={`${color} text-uppercase mb-1`}
//                       style={{ fontSize: "0.75rem" }}
//                     >
//                       {label}
//                     </h6>
//                     <h5 className={`fw-bold ${color} mb-0`}>{count}</h5>
//                   </div>
//                   <i className={`${icon} fa-2x ${color}`}></i>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2 px-2">
//         <div>
//           <span className="text-muted small">
//             Showing{" "}
//             <strong>
//               {currentComplaint.length === 0
//                 ? 0
//                 : (page - 1) * complaintsPerPage + 1}
//             </strong>{" "}
//             to{" "}
//             <strong>
//               {(page - 1) * complaintsPerPage + currentComplaint.length}
//             </strong>{" "}
//             of <strong>{filteredComplaints.length}</strong> complaints
//           </span>
//         </div>

//         <div className="d-flex align-items-center">
//           <label className="me-2 mb-0 small fw-medium text-nowrap">
//             Rows per page:
//           </label>
//           <select
//             className="form-select form-select-sm"
//             style={{ width: "100px" }}
//             value={complaintsPerPage}
//             onChange={(e) => {
//               setPage(1); // Reset to page 1 when rows per page changes
//               setComplaintsPerPage(Number(e.target.value));
//             }}
//           >
//             {[10, 20, 50, 100].map((n) => (
//               <option key={n} value={n}>
//                 {n}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div
//         className="table-responsive mt-4"
//         style={{
//           overflowX: "auto",
//           borderRadius: 8,
//           boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//           backgroundColor: "#f1f3f5",
//         }}
//       >
//         <table
//           className="table table-bordered table-hover"
//           style={{
//             borderCollapse: "separate",
//             borderSpacing: 0,
//             width: "100%",
//           }}
//         >
//           <thead
//             className="table-dark"
//             style={{ borderRadius: "8px 8px 0 0", userSelect: "none" }}
//           >
//             <tr>
//               {[
//                 "#",
//                 "Ticket ID",
//                 "User",
//                 "Mobile",
//                 "Address",
//                 "Category",
//                 "Sub Category",
//                 "Description",
//                 "Image",
//                 "Status",
//                 "Priority",
//                 "Assigned To",
//                 "Action",
//                 "Feedback",
//               ].map((header) => (
//                 <th
//                   key={header}
//                   style={{
//                     padding: "12px 15px",
//                     textAlign: "left",
//                     borderBottom: "2px solid #343a40",
//                     fontWeight: "600",
//                     fontSize: 14,
//                   }}
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {currentComplaint.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="14"
//                   style={{
//                     textAlign: "center",
//                     padding: 20,
//                     color: "#6c757d",
//                     fontStyle: "italic",
//                   }}
//                 >
//                   No complaints found.
//                 </td>
//               </tr>
//             ) : (
//               currentComplaint.map((c, i) => {
//                 const rowBg = i % 2 === 0 ? "#f9f9f9" : "white";
//                 return (
//                   <tr key={c.id} style={{ backgroundColor: rowBg }}>
//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       {(page - 1) * complaintsPerPage + i + 1}
//                     </td>
//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       {c.id}
//                     </td>
//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       <div>
//                         <strong>ID:</strong> {c.user_id}
//                       </div>
//                       <div>
//                         <strong>Name:</strong>{" "}
//                         {userMap[c.user_id]?.name || "Unknown"}
//                       </div>
//                     </td>
//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       {c.mobile}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px 12px",
//                         verticalAlign: "top",
//                         maxWidth: 220,
//                         wordWrap: "break-word",
//                       }}
//                     >
//                       {c.address}
//                     </td>
//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       {categoryMap[c.categories]?.category_name || "N/A"}
//                     </td>
//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       {c.subcategory && subcategoryMap[c.subcategory] ? (
//                         subcategoryMap[c.subcategory].subcategory_name
//                       ) : (
//                         <span style={{ color: "#6c757d" }}>—</span>
//                       )}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px 12px",
//                         verticalAlign: "top",
//                         maxWidth: 220,
//                         wordWrap: "break-word",
//                       }}
//                     >
//                       {c.description}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px 12px",
//                         verticalAlign: "top",
//                         textAlign: "center",
//                       }}
//                     >
//                       {c.image ? (
//                         <img
//                           src={`http://localhost:5001/auth/uploads/${c.image}`}
//                           alt="Complaint"
//                           style={{
//                             width: 100,
//                             height: 70,
//                             objectFit: "cover",
//                             borderRadius: 6,
//                             cursor: "pointer",
//                             boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
//                             transition: "transform 0.3s ease",
//                           }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.transform = "scale(1.1)")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.transform = "scale(1)")
//                           }
//                           onClick={() =>
//                             handleImageClick(
//                               `http://localhost:5001/auth/uploads/${c.image}`
//                             )
//                           }
//                         />
//                       ) : (
//                         <span style={{ color: "#6c757d" }}>N/A</span>
//                       )}
//                     </td>
//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       <span
//                         className={getStatusBadgeColor(c.status.toLowerCase())}
//                         style={{
//                           display: "inline-block",
//                           padding: "4px 12px",
//                           borderRadius: 20,
//                           fontWeight: "400",
//                           fontSize: 12,
//                           color: "white",
//                         }}
//                       >
//                         {c.status}
//                       </span>
//                       {user?.role === "Super Admin" && (
//                         <select
//                           value={c.status}
//                           onChange={(e) =>
//                             handleStatusChange(c.id, e.target.value)
//                           }
//                           className="form-select mt-1"
//                           style={{ fontSize: 12, marginTop: 6, width: "100%" }}
//                         >
//                           {statusOptions.map((s) => (
//                             <option key={s.id} value={s.status}>
//                               {s.status}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </td>

//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       {user?.role === "Super Admin" ? (
//                         <select
//                           className="form-select form-select-sm border-primary"
//                           value={c.priority || "Medium"}
//                           onChange={(e) =>
//                             handlePriorityChange(c.id, e.target.value)
//                           }
//                           disabled={isUpdating}
//                           style={{ fontSize: 12 }}
//                         >
//                           {["Low", "Medium", "High"].map((level) => (
//                             <option key={level} value={level}>
//                               {level}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <span
//                           style={{
//                             fontWeight: "400",
//                             color:
//                               c.priority === "High"
//                                 ? "#dc3545"
//                                 : c.priority === "Medium"
//                                 ? "#ffc107"
//                                 : "#198754",
//                           }}
//                         >
//                           {c.priority || "Medium"}
//                         </span>
//                       )}
//                     </td>

//                     <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
//                       {user?.role === "Super Admin" ? (
//                         <select
//                           className="form-select form-select-sm border-primary"
//                           value={c.assigned_to || ""}
//                           onChange={(e) => handleAssign(c.id, e.target.value)}
//                           style={{ fontSize: 12 }}
//                         >
//                           <option value="">Unassigned</option>
//                           {users
//                             .filter((u) => ["Admin"].includes(u.role))
//                             .map((u) => (
//                               <option key={u.id} value={u.id}>
//                                 {u.name} ({u.role})
//                               </option>
//                             ))}
//                         </select>
//                       ) : c.assigned_to ? (
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 6,
//                             fontSize: 12,
//                           }}
//                         >
//                           <i
//                             className="fas fa-user-tag"
//                             style={{ color: "#0dcaf0" }}
//                           ></i>
//                           <div>
//                             <strong>{userMap[c.assigned_to]?.name}</strong>
//                             <br />
//                             <span
//                               style={{
//                                 backgroundColor: "#6c757d",
//                                 color: "white",
//                                 fontSize: 10,
//                                 borderRadius: 4,
//                                 padding: "2px 6px",
//                                 userSelect: "none",
//                               }}
//                             >
//                               {userMap[c.assigned_to]?.role}
//                             </span>
//                           </div>
//                         </div>
//                       ) : (
//                         <span
//                           style={{
//                             color: "#6c757d",
//                             fontStyle: "italic",
//                             fontSize: 12,
//                           }}
//                         >
//                           Not assigned
//                         </span>
//                       )}
//                     </td>

//                     <td
//                       style={{
//                         padding: "10px 12px",
//                         verticalAlign: "top",
//                         minWidth: 100,
//                         display: "flex",
//                         gap: 6,
//                         alignItems: "center",
//                       }}
//                     >
//                       <button
//                         className="btn btn-sm me-1"
//                         onClick={() => handleViewUser(c.user_id)}
//                         style={{
//                           fontSize: 14,
//                           background: "none",
//                           border: "none",
//                           color: "#0d6efd",
//                           cursor: "pointer",
//                         }}
//                         title="View User"
//                       >
//                         <i className="fas fa-eye"></i>
//                       </button>

//                       {c.latitude && c.longitude && (
//                         <button
//                           className="btn btn-sm"
//                           onClick={() =>
//                             setSelectedComplaintLocation({
//                               lat: parseFloat(c.latitude),
//                               lng: parseFloat(c.longitude),
//                               address: c.address,
//                             })
//                           }
//                           style={{
//                             fontSize: 14,
//                             background: "none",
//                             border: "none",
//                             color: "#198754",
//                             cursor: "pointer",
//                           }}
//                           title="View Location"
//                         >
//                           <i className="fas fa-map-marker-alt"></i>
//                         </button>
//                       )}

//                       {/* <button

//                         className="btn btn-sm"
//                         onClick={() => openCommentsModal(c)}
//                         style={{
//                           fontSize: 14,
//                           background: "none",
//                           border: "none",
//                           color: "#6c757d",
//                           cursor: "pointer",
//                         }}
//                         title="View/Add Comments"
//                       >
//                         <i className="fas fa-comment-alt"></i>
//                       </button> */}

//                       <button
//                         className="btn btn-sm position-relative"
//                         onClick={() => {
//                           openCommentsModal(c);
//                           markAsReadAndUpdate(c.id); // defined below
//                         }}
//                         style={{
//                           fontSize: 14,
//                           background: "none",
//                           border: "none",
//                           color: "#6c757d",
//                           cursor: "pointer",
//                         }}
//                         title="View/Add Comments"
//                       >
//                         <i className="fas fa-comment-alt"></i>

                     
//                       </button>
//                     </td>

//                     <td
//                       style={{
//                         padding: "10px 12px",
//                         verticalAlign: "top",
//                         minWidth: 100,
//                       }}
//                     >
//                       {c.status.toLowerCase() === "resolved" &&
//                       !c.feedback &&
//                       c.user_id === user?.id ? (
//                         <button
//                           className="btn btn-sm btn-outline-success"
//                           onClick={() => setFeedbackModal(c)}
//                           style={{
//                             fontSize: 12,
//                             padding: "4px 8px",
//                             borderRadius: 4,
//                             color: "#198754",
//                             border: "1px solid #198754",
//                             backgroundColor: "transparent",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Give Feedback
//                         </button>
//                       ) : c.rating ? (
//                         <div style={{ fontSize: 13, color: "#444" }}>
//                           <span>⭐ {c.rating}/5</span>
//                           <br />
//                           <small>{c.feedback}</small>
//                         </div>
//                       ) : (
//                         <span style={{ color: "#6c757d" }}>—</span>
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
//         <Pagination.Prev
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
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
//           onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           disabled={page === totalPages}
//         />
//       </Pagination>

//       {selectedComplaintForComments && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           role="dialog"
//           aria-modal="true"
//           style={{
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             zIndex: 1050,
//           }}
//           onClick={() => setSelectedComplaintForComments(null)}
//         >
//           <div
//             className="modal-dialog modal-dialog-centered modal-lg"
//             role="document"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content rounded-4 shadow-sm border-0">
//               <div className="modal-header border-bottom-0 pb-0">
//                 <h5 className="modal-title fw-bold">💬 Comments</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setSelectedComplaintForComments(null)}
//                 ></button>
//               </div>

//               <div className="modal-body pt-2">
//                 {/* Comments Section */}
//                 <div
//                   style={{
//                     maxHeight: 300,
//                     overflowY: "auto",
//                     paddingRight: 6,
//                     marginBottom: 20,
//                     border: "1px solid #e9ecef",
//                     borderRadius: 6,
//                     padding: 10,
//                     background: "#f8f9fa",
//                   }}
//                 >
//                   {selectedComplaintForComments.comments?.length > 0 ? (
//                     renderComments(selectedComplaintForComments.comments)
//                   ) : (
//                     <p className="text-muted fst-italic mb-0">
//                       No comments yet.
//                     </p>
//                   )}
//                 </div>

//                 {/* Add Comment */}
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleAddComment(
//                       selectedComplaintForComments.id,
//                       commentInput[selectedComplaintForComments.id]
//                     );
//                   }}
//                 >
//                   <label className="form-label fw-medium">Add a comment</label>
//                   <div className="d-flex gap-2">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Write your comment..."
//                       value={
//                         commentInput[selectedComplaintForComments.id] || ""
//                       }
//                       autoFocus
//                       onChange={(e) =>
//                         setCommentInput({
//                           ...commentInput,
//                           [selectedComplaintForComments.id]: e.target.value,
//                         })
//                       }
//                     />
//                     <button type="submit" className="btn btn-primary">
//                       Send
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {modalImage && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           role="dialog"
//           style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//           onClick={closeModal}
//         >
//           <div
//             className="modal-dialog modal-lg modal-dialog-centered"
//             role="document"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Image Preview</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={closeModal}
//                 ></button>
//               </div>
//               <div className="modal-body text-center">
//                 <img
//                   src={modalImage}
//                   alt="Full Preview"
//                   style={{ maxWidth: "100%", maxHeight: "70vh" }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedUser && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           role="dialog"
//           style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//           onClick={() => setSelectedUser(null)}
//         >
//           <div
//             className="modal-dialog modal-dialog-centered"
//             role="document"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Customer Profile</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setSelectedUser(null)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p>
//                   <strong>ID:</strong> {selectedUser.id}
//                 </p>
//                 <p>
//                   <strong>Name:</strong> {selectedUser.name}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {selectedUser.email}
//                 </p>
//                 <p>
//                   <strong>Mobile:</strong> {selectedUser.mobile || "N/A"}
//                 </p>
//                 {/* <p><strong>Address:</strong> {selectedUser.address|| "N/A"}</p> */}
//                 <p>
//                   <strong>Role:</strong> {selectedUser.role}
//                 </p>
//                 {/* You can show more fields if available */}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedComplaintLocation && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           role="dialog"
//           style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//           onClick={() => setSelectedComplaintLocation(null)}
//         >
//           <div
//             className="modal-dialog modal-lg modal-dialog-centered"
//             role="document"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   Complaint Location: {selectedComplaintLocation.title}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setSelectedComplaintLocation(null)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p>
//                   <strong>Address:</strong> {selectedComplaintLocation.address}
//                 </p>
//                 <div style={{ height: "400px" }}>
//                   <iframe
//                     width="100%"
//                     height="100%"
//                     frameBorder="0"
//                     style={{ border: 0 }}
//                     src={`https://www.google.com/maps?q=${selectedComplaintLocation.lat},${selectedComplaintLocation.lng}&z=15&output=embed`}
//                     allowFullScreen
//                     title="Complaint Location"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {feedbackModal && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   Feedback for: {feedbackModal.title}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setFeedbackModal(null)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Rating (1 to 5)</label>
//                   <select
//                     className="form-select"
//                     value={rating}
//                     onChange={(e) => setRating(e.target.value)}
//                   >
//                     <option value="">Select rating</option>
//                     {[1, 2, 3, 4, 5].map((r) => (
//                       <option key={r} value={r}>
//                         {r}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Feedback</label>
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     value={feedbackText}
//                     onChange={(e) => setFeedbackText(e.target.value)}
//                     placeholder="Write your feedback here..."
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setFeedbackModal(null)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-primary"
//                   onClick={handleSubmitFeedback}
//                   disabled={!rating}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
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
  const { token, user, hasPermission } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [complaintsPerPage, setComplaintsPerPage] = useState(10);
  const [statusOptions, setStatusOptions] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [activeStatus, setActiveStatus] = useState("total");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedComplaintLocation, setSelectedComplaintLocation] =
    useState(null);
  // const [updatedComplaints, setUpdatedComplaints] = useState(complaints);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackModal, setFeedbackModal] = React.useState(null);
  const [rating, setRating] = React.useState("");
  const [feedbackText, setFeedbackText] = React.useState("");

  const [selectedComplaintForComments, setSelectedComplaintForComments] =
    useState(null);
  const [commentInput, setCommentInput] = useState({});

  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [unreadMap, setUnreadMap] = useState({});

  const [page, setPage] = useState(1);
  const location = useLocation();

  console.log("User object:", user);
  console.log("User permissions:", user?.permissions);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCategories();
      fetchSubCategories();
      fetchComplaints();
      fetchStatusOptions();
      fetchUnreadCommentCounts();
    }
  }, [token, location]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5001/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategoryList(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategoryList([]);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/auth/subcategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategoryList(res.data);
    } catch (err) {
      console.error("Failed to load subcategories:", err);
      setSubCategoryList([]);
    }
  };

  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:5001/auth/complaints", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data);
  };

  const fetchStatusOptions = async () => {
    const res = await axios.get(
      "http://localhost:5001/auth/complaints/status-options",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setStatusOptions(res.data);
  };

  const handleStatusChange = async (id, status) => {
    await axios.put(
      `http://localhost:5001/auth/complaints/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    toast.success("Status updated");
  };

  const handleAssign = async (complaintId, assignedToId) => {
    try {
      await axios.put(
        `http://localhost:5001/auth/complaints/${complaintId}/assign`,
        { assignedToId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? { ...c, assigned_to: parseInt(assignedToId, 10) }
            : c
        )
      );
      toast.success("Complaint assigned successfully");
    } catch {
      toast.error("Assignment failed");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!rating) return;

    try {
      await axios.put(
        `http://localhost:5001/auth/complaints/${feedbackModal.id}/feedback`,
        { rating: Number(rating), feedback: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Feedback submitted");
      setFeedbackModal(null);
      setRating("");
      setFeedbackText("");
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to submit feedback", error);
    }
  };

  const handleImageClick = (imagePath) => setModalImage(imagePath);
  const closeModal = () => setModalImage(null);
  const handleViewUser = (uId) => setSelectedUser(userMap[uId]);

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

  const subcategoryMap = Object.fromEntries(
    subCategoryList.map((s) => [s.id, s])
  );

  const validateCategorySubcategoryMapping = () => {
    complaints.forEach((c) => {
      if (!categoryMap[c.categories]) {
        console.warn(
          `🚨 Complaint ID ${c.id} has an invalid category ID: ${c.categories}`
        );
      }

      if (!subcategoryMap[c.subcategory]) {
        console.warn(
          `⚠️ Complaint ID ${c.id} has an invalid subcategory ID: ${c.subcategory}`
        );
      }
    });
  };

  const handlePriorityChange = (complaintId, newPriority) => {
    setIsUpdating(true);

    const originalPriority = complaints.find(
      (complaint) => complaint.id === complaintId
    )?.priority;

    const updatedComplaintsList = complaints.map((complaint) =>
      complaint.id === complaintId
        ? { ...complaint, priority: newPriority }
        : complaint
    );

    setComplaints(updatedComplaintsList);

    axios
      .put(
        `http://localhost:5001/auth/complaints/${complaintId}/priority`,
        { priority: newPriority },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Priority updated successfully:", response.data);
        toast.success("Priority assigned successfully");
      })
      .catch((error) => {
        toast.error("Error updating priority:", error);

        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint.id === complaintId
              ? { ...complaint, priority: originalPriority }
              : complaint
          )
        );
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  useEffect(() => {
    if (
      complaints.length &&
      Object.keys(categoryMap).length &&
      Object.keys(subcategoryMap).length
    ) {
      validateCategorySubcategoryMapping();
    }
  }, [complaints, categoryMap, subcategoryMap]);

  useEffect(() => {
  console.log("Unread Map:", unreadMap); 
}, [unreadMap]);


  const openCommentsModal = async (complaint) => {
    setSelectedComplaintForComments({ ...complaint, comments: [] });

    try {
      const res = await axios.get(
        `http://localhost:5001/auth/complaints/${complaint.id}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedComplaintForComments((prev) => ({
        ...prev,
        comments: res.data,
      }));
    } catch (err) {
      console.error("Failed to load comments:", err);

      setSelectedComplaintForComments((prev) => ({
        ...prev,
        comments: [],
      }));
    }
  };

  const handleAddComment = async (complaintId, newComment) => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `http://localhost:5001/auth/complaints/${complaintId}/comments`,
        { comment: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comment Posted");
      // await openCommentsModal(complaintId);

      setCommentInput((prev) => ({ ...prev, [complaintId]: "" }));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleAddReply = async (complaintId, parentCommentId, newReply) => {
    if (!newReply.trim()) return;

    try {
      await axios.post(
        `http://localhost:5001/auth/complaints/${complaintId}/comments`,
        { comment: newReply, parent_comment_id: parentCommentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchUnreadCommentCounts(complaintId);
      setReplyText("");
      setReplyToCommentId(null);
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  const renderComments = (comments, parentId = null) => {
    return comments
      .filter((c) => c.parent_comment_id === parentId)
      .map((comment) => (
        <div
          key={comment.id}
          style={{
            marginLeft: parentId ? 30 : 0,
            marginBottom: 16,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#6c757d",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
            title={comment.user_name}
          >
            {comment.user_name?.charAt(0) || "U"}
          </div>

          {/* Comment content */}
          <div style={{ flex: 1 }}>
            <strong>{comment.user_name || "User"}</strong>
            <p className="mb-1">{comment.comment}</p>
            <small className="text-muted">
              {new Date(comment.timestamp).toLocaleString()}
            </small>

            {/* Reply button */}

            <div>
              <button
                className="btn btn-link btn-sm p-0 mt-1"
                onClick={() =>
                  setReplyToCommentId(
                    comment.id === replyToCommentId ? null : comment.id
                  )
                }
              >
                Reply
              </button>
            </div>

            {replyToCommentId === comment.id && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddReply(
                    selectedComplaintForComments.id,
                    comment.id,
                    replyText
                  );
                }}
                style={{ marginTop: 6 }}
              >
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Write your reply here"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="mt-2">
                  <button type="submit" className="btn btn-primary btn-sm me-2">
                    Post Reply
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setReplyToCommentId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Render replies */}
            {renderComments(comments, comment.id)}
          </div>
        </div>
      ));
  };




const fetchUnreadCommentCounts = async () => {
  try {
    const res = await axios.get("http://localhost:5001/auth/complaints/comments/unread-counts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetched Unread Comment Counts:", res.data); 

  
    if (res.data && typeof res.data === 'object') {
      setUnreadMap(res.data); 
    } else {
      console.error("Unexpected response format:", res.data);
    }
  } catch (err) {
    console.error("Failed to fetch unread comment counts:", err);
  }
};


const markAsReadAndUpdate = (complaintId) => {

  fetch("http://localhost:5001/auth/comments/mark-read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization : `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: "comment",
      refId: complaintId,  
    }),
  })
  .then(response => response.json())
  .then(() => {
   
  })
  .catch((err) => {
    console.error("Error marking notifications as read:", err);
  });
};



  const visibleComplaints =
    user?.role === "Super Admin" || user?.role === "Admin"
      ? complaints
      : complaints.filter((c) => c.user_id === user?.id);

  const filteredComplaints =
    activeStatus === "total"
      ? visibleComplaints
      : visibleComplaints.filter(
          (c) => c.status.toLowerCase() === activeStatus
        );

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

  const currentComplaint = filteredComplaints.slice(
    (page - 1) * complaintsPerPage,
    page * complaintsPerPage
  );

  const statusCounts = filteredComplaints.reduce((acc, c) => {
    const key = c.status.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  statusCounts.total = filteredComplaints.length;

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
    <div
      className="container-fluid border shadow-sm bg-light"
      style={{ marginTop: "100px", width: "98%", borderRadius: "10px" }}
    >
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
            <i className="fas fa-plus me-2"></i>
            Add Complaint
          </button>
        </Link>
      </div>

      {/* Status filter cards */}
      <div className="row">
        {[
          ...["total"],
          ...statusOptions.map((s) => s.status.toLowerCase()),
        ].map((key) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          const count = statusCounts[key] || 0;
          const color = statusTextColors[key] || "text-muted";
          const icon = statusIcons[key] || "fas fa-question-circle";
          const isActive = activeStatus === key;
          return (
            <div className="col-md-3 col-sm-6 mb-2" key={key}>
              <div
                className={`card shadow-sm small-card border ${
                  isActive ? "border-" + color.split(" ")[1] : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setActiveStatus(key);
                  setPage(1);
                }}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6
                      className={`${color} text-uppercase mb-1`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {label}
                    </h6>
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
            Showing{" "}
            <strong>
              {currentComplaint.length === 0
                ? 0
                : (page - 1) * complaintsPerPage + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {(page - 1) * complaintsPerPage + currentComplaint.length}
            </strong>{" "}
            of <strong>{filteredComplaints.length}</strong> complaints
          </span>
        </div>

        <div className="d-flex align-items-center">
          <label className="me-2 mb-0 small fw-medium text-nowrap">
            Rows per page:
          </label>
          <select
            className="form-select form-select-sm"
            style={{ width: "100px" }}
            value={complaintsPerPage}
            onChange={(e) => {
              setPage(1); // Reset to page 1 when rows per page changes
              setComplaintsPerPage(Number(e.target.value));
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="table-responsive mt-4"
        style={{
          overflowX: "auto",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          backgroundColor: "#f1f3f5",
        }}
      >
        <table
          className="table table-bordered table-hover"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            width: "100%",
          }}
        >
          <thead
            className="table-dark"
            style={{ borderRadius: "8px 8px 0 0", userSelect: "none" }}
          >
            <tr>
              {[
                "#",
                "Ticket ID",
                "User",
                "Mobile",
                "Address",
                "Category",
                "Sub Category",
                "Description",
                "Image",
                "Status",
                "Priority",
                "Assigned To",
                "Action",
                "Feedback",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "12px 15px",
                    textAlign: "left",
                    borderBottom: "2px solid #343a40",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentComplaint.length === 0 ? (
              <tr>
                <td
                  colSpan="14"
                  style={{
                    textAlign: "center",
                    padding: 20,
                    color: "#6c757d",
                    fontStyle: "italic",
                  }}
                >
                  No complaints found.
                </td>
              </tr>
            ) : (
              currentComplaint.map((c, i) => {
                const rowBg = i % 2 === 0 ? "#f9f9f9" : "white";
                return (
                  <tr key={c.id} style={{ backgroundColor: rowBg }}>
                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      {(page - 1) * complaintsPerPage + i + 1}
                    </td>
                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      {c.id}
                    </td>
                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      <div>
                        <strong>ID:</strong> {c.user_id}
                      </div>
                      <div>
                        <strong>Name:</strong>{" "}
                        {userMap[c.user_id]?.name || "Unknown"}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      {c.mobile}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        verticalAlign: "top",
                        maxWidth: 220,
                        wordWrap: "break-word",
                      }}
                    >
                      {c.address}
                    </td>
                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      {categoryMap[c.categories]?.category_name || "N/A"}
                    </td>
                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      {c.subcategory && subcategoryMap[c.subcategory] ? (
                        subcategoryMap[c.subcategory].subcategory_name
                      ) : (
                        <span style={{ color: "#6c757d" }}>—</span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        verticalAlign: "top",
                        maxWidth: 220,
                        wordWrap: "break-word",
                      }}
                    >
                      {c.description}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        verticalAlign: "top",
                        textAlign: "center",
                      }}
                    >
                      {c.image ? (
                        <img
                          src={`http://localhost:5001/auth/uploads/${c.image}`}
                          alt="Complaint"
                          style={{
                            width: 100,
                            height: 70,
                            objectFit: "cover",
                            borderRadius: 6,
                            cursor: "pointer",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                          onClick={() =>
                            handleImageClick(
                              `http://localhost:5001/auth/uploads/${c.image}`
                            )
                          }
                        />
                      ) : (
                        <span style={{ color: "#6c757d" }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      <span
                        className={getStatusBadgeColor(c.status.toLowerCase())}
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontWeight: "400",
                          fontSize: 12,
                          color: "white",
                        }}
                      >
                        {c.status}
                      </span>
                      {hasPermission("complaint_management", "edit") && (
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleStatusChange(c.id, e.target.value)
                          }
                          className="form-select mt-1"
                          style={{ fontSize: 12, marginTop: 6, width: "100%" }}
                        >
                          {statusOptions.map((s) => (
                            <option key={s.id} value={s.status}>
                              {s.status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      {hasPermission("complaint_management", "edit") ? (
                        <select
                          className="form-select form-select-sm border-primary"
                          value={c.priority || "Medium"}
                          onChange={(e) =>
                            handlePriorityChange(c.id, e.target.value)
                          }
                          disabled={isUpdating}
                          style={{ fontSize: 12 }}
                        >
                          {["Low", "Medium", "High"].map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          style={{
                            fontWeight: "400",
                            color:
                              c.priority === "High"
                                ? "#dc3545"
                                : c.priority === "Medium"
                                ? "#ffc107"
                                : "#198754",
                          }}
                        >
                          {c.priority || "Medium"}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      {hasPermission("complaint_management", "edit") ? (
                        <select
                          className="form-select form-select-sm border-primary"
                          value={c.assigned_to || ""}
                          onChange={(e) => handleAssign(c.id, e.target.value)}
                          style={{ fontSize: 12 }}
                        >
                          <option value="">Unassigned</option>
                          {users
                            .filter(
                              (u) =>
                                hasPermission("complaint_management", "edit") && // adjust module/action if needed
                                ["Admin"].includes(u.role)
                            )
                            .map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name} ({u.role})
                              </option>
                            ))}
                        </select>
                      ) : c.assigned_to ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                          }}
                        >
                          <i
                            className="fas fa-user-tag"
                            style={{ color: "#0dcaf0" }}
                          ></i>
                          <div>
                            <strong>{userMap[c.assigned_to]?.name}</strong>
                            <br />
                            <span
                              style={{
                                backgroundColor: "#6c757d",
                                color: "white",
                                fontSize: 10,
                                borderRadius: 4,
                                padding: "2px 6px",
                                userSelect: "none",
                              }}
                            >
                              {userMap[c.assigned_to]?.role}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            color: "#6c757d",
                            fontStyle: "italic",
                            fontSize: 12,
                          }}
                        >
                          Not assigned
                        </span>
                      )}
                    </td>

                    <td
                      style={{
                        padding: "10px 12px",
                        verticalAlign: "top",
                        minWidth: 100,
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <button
                        className="btn btn-sm me-1"
                        onClick={() => handleViewUser(c.user_id)}
                        style={{
                          fontSize: 14,
                          background: "none",
                          border: "none",
                          color: "#0d6efd",
                          cursor: "pointer",
                        }}
                        title="View User"
                      >
                        <i className="fas fa-eye"></i>
                      </button>

                      {c.latitude && c.longitude && (
                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            setSelectedComplaintLocation({
                              lat: parseFloat(c.latitude),
                              lng: parseFloat(c.longitude),
                              address: c.address,
                            })
                          }
                          style={{
                            fontSize: 14,
                            background: "none",
                            border: "none",
                            color: "#198754",
                            cursor: "pointer",
                          }}
                          title="View Location"
                        >
                          <i className="fas fa-map-marker-alt"></i>
                        </button>
                      )}

<button
  className="btn btn-sm position-relative"
  onClick={() => {
    openCommentsModal(c); 
    markAsReadAndUpdate(c.id);
  }}
  style={{
    fontSize: 14,
    background: "none",
    border: "none",
    color: "#6c757d",
    cursor: "pointer",
  }}
  title="View/Add Comments"
>
  <i className="fas fa-comment-alt"></i>

  {unreadMap[c.id] > 0 && (
    <span
      style={{
        position: "absolute",
        top: -5,
        right: 0,
        fontSize: 5,
        backgroundColor: "red",
        borderRadius: "50%",
        width: 16,
        height: 16,
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10, 
      }}
    >
      {unreadMap[c.id]}
    </span>
  )}
</button>
</td>


                 <td
  style={{
    padding: "10px 12px",
    verticalAlign: "top",
    minWidth: 180,
    fontSize: 12,
  }}
>
  {c.feedback && c.feedback.trim() !== "" ? (
   
    
      <div>
    <div style={{ fontSize: 13, color: "#444" }}>
                          <span>⭐ {c.rating}/5</span>
                          <br />
                          <small>{c.feedback}</small>
                        </div>
     
    </div>
   
  ) : hasPermission("feedback", "create", "edit")  && c.status === "resolved"  ? (
   
    <button
      className="btn btn-outline-primary btn-sm"
      onClick={() => setFeedbackModal(c)}
    >
      Submit Feedback
    </button>
  ) : (
  
    <span style={{ fontStyle: "italic", color: "#6c757d" }}>--</span>
  )}
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
        <Pagination.Prev
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === page}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        />
      </Pagination>

      {selectedComplaintForComments && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
          onClick={() => setSelectedComplaintForComments(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 shadow-sm border-0">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">💬 Comments</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedComplaintForComments(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                {/* Comments Section */}
                <div
                  style={{
                    maxHeight: 300,
                    overflowY: "auto",
                    paddingRight: 6,
                    marginBottom: 20,
                    border: "1px solid #e9ecef",
                    borderRadius: 6,
                    padding: 10,
                    background: "#f8f9fa",
                  }}
                >
                  {selectedComplaintForComments.comments?.length > 0 ? (
                    renderComments(selectedComplaintForComments.comments)
                  ) : (
                    <p className="text-muted fst-italic mb-0">
                      No comments yet.
                    </p>
                  )}
                </div>

                {/* Add Comment */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddComment(
                      selectedComplaintForComments.id,
                      commentInput[selectedComplaintForComments.id]
                    );
                  }}
                >
                  <label className="form-label fw-medium">Add a comment</label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Write your comment..."
                      value={
                        commentInput[selectedComplaintForComments.id] || ""
                      }
                      autoFocus
                      onChange={(e) =>
                        setCommentInput({
                          ...commentInput,
                          [selectedComplaintForComments.id]: e.target.value,
                        })
                      }
                    />
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
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
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>ID:</strong> {selectedUser.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedUser.mobile || "N/A"}
                </p>
                {/* <p><strong>Address:</strong> {selectedUser.address|| "N/A"}</p> */}
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                {/* You can show more fields if available */}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedComplaintLocation && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setSelectedComplaintLocation(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Complaint Location: {selectedComplaintLocation.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedComplaintLocation(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Address:</strong> {selectedComplaintLocation.address}
                </p>
                <div style={{ height: "400px" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${selectedComplaintLocation.lat},${selectedComplaintLocation.lng}&z=15&output=embed`}
                    allowFullScreen
                    title="Complaint Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {feedbackModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Feedback for: {feedbackModal.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setFeedbackModal(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Rating (1 to 5)</label>
                  <select
                    className="form-select"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select rating</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Feedback</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write your feedback here..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setFeedbackModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitFeedback}
                  disabled={!rating}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ComplaintManagement;
