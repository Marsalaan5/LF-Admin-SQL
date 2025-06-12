// import React, { useState, useEffect, useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Pagination from "react-bootstrap/Pagination";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function ComplaintManagement() {
//   const { token } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [error, setError] = useState(null);
//   const [modalDescription, setModalDescription] = useState(null);
//   const [updatingStatusId, setUpdatingStatusId] = useState(null);
//   const [statusOptions, setStatusOptions] = useState([]);

//   const [page, setPage] = useState(1);
//   const [modalImage, setModalImage] = useState(null); // Modal image state
//   const location = useLocation();

//   const complaintsPerPage = 10;
//   const indexOfLastComplaint = page * complaintsPerPage;
//   const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
//   const currentComplaint = complaints.slice(
//     indexOfFirstComplaint,
//     indexOfLastComplaint
//   );
//   const totalPages = Math.ceil(complaints.length / complaintsPerPage);

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

//   useEffect(() => {
//     const fetchStatusOptions = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5001/auth/complaints/status-options",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//             console.log("Status options fetched:", res.data);
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
//       alert("Error updating status, please try again.");
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchCategories();
//       fetchComplaints();
//       // fetchStatusOptions();
//     }
//   }, [token, location]);

//   const handleImageClick = (imagePath) => {
//     setModalImage(imagePath);
//   };

//   const closeModal = () => {
//     setModalImage(null);
//   };

//   const userMap = Object.fromEntries(users.map(u => [u.id, u]));
// const categoryMap = Object.fromEntries(categoryList.map(c => [c.id, c]));

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
//         {complaints.length === 0 ? (
//           <p>No complaints yet.</p>
//         ) : (
//           <div className="table-responsive">
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
//                   const user = userMap[complaint.user_id];
//                   const category = categoryMap[parseInt(complaint.categories)];

          
//                   return (
//                     <tr key={complaint.id}>
//                       <td>{complaint.user_id}</td>
//                       <td>{user ? user.name : "Unknown"}</td>
//                       <td>{complaint.title}</td>
//                       <td>{complaint.mobileNumber}</td>
//                       <td>{category ? category.category_name : "Unknown"}</td>
//                       {/* <td>{complaint.description}</td> */}
//                       {/* <td title={complaint.description}>
//   {complaint.description.length > 100
//     ? complaint.description.slice(0, 40) + "..."
//     : complaint.description}
// </td> */}

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
//                       {/* <td>
                      
//                         <select
//   value={complaint.status.toLowerCase()}
//   onChange={(e) =>
//     handleStatusChange(complaint.id, e.target.value)
//   }
// >
//   {statusOptions.map((opt) => (
//     <option key={opt.id} value={opt.status.toLowerCase()}>
//       {opt.status.charAt(0).toUpperCase() + opt.status.slice(1)}
//     </option>
//   ))}
// </select>

//                       </td> */}
//                       <td>
//   <span
//     style={{
//       display: "inline-block",
//       marginRight: "10px",
//       padding: "4px 8px",
//       borderRadius: "12px",
//       backgroundColor:
//         complaint.status.toLowerCase() === "open" ? "#28a745" : "#dc3545",
//       color: "white",
//       // fontWeight: "bold",
//       textTransform: "capitalize",
//       fontSize: "0.85rem",
//     }}
//   >
//     {complaint.status}
//   </span>
//   <select
//     value={complaint.status.toLowerCase()}
//     onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
//   >
//     {statusOptions.map((opt) => (
//       <option key={opt.id} value={opt.status.toLowerCase()}>
//         {opt.status.charAt(0).toUpperCase() + opt.status.slice(1)}
//       </option>
//     ))}
//   </select>
// </td>

//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
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



import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function ComplaintManagement() {
  const { token, user } = useContext(AuthContext); // get user from context
  const [users, setUsers] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const [modalDescription, setModalDescription] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [modalImage, setModalImage] = useState(null);
  const location = useLocation();

  const complaintsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Error loading users.");
    }
  };

  const fetchCategories = async () => {
    try {
      const categoryRes = await axios.get(
        "http://localhost:5001/auth/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategoryList(categoryRes.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Failed to load categories.");
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load complaints:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to load complaints.");
    }
  };

  // useEffect(() => {
  //   const fetchStatusOptions = async () => {
  //     try {
  //       const res = await axios.get(
  //         "http://localhost:5001/auth/complaints/status-options",
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setStatusOptions(res.data);
  //     } catch (err) {
  //       console.error("Failed to load status options:", err);
  //     }
  //   };

  //   fetchStatusOptions();
  // }, [token]);

  useEffect(() => {
  const fetchStatusOptions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/auth/complaints/status-options",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Status options fetched:", res.data);  // Check this output
      setStatusOptions(res.data);
    } catch (err) {
      console.error("Failed to load status options:", err);
    }
  };

  fetchStatusOptions();
}, [token]);


  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5001/auth/complaints/${complaintId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints((prevComplaints) =>
        prevComplaints.map((comp) =>
          comp.id === complaintId ? { ...comp, status: newStatus } : comp
        )
      );
      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Failed to update complaint status:", err);
      alert("Error updating status, please try again.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCategories();
      fetchComplaints();
    }
  }, [token, location]);

  const handleImageClick = (imagePath) => {
    setModalImage(imagePath);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  // Maps for fast lookup
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const categoryMap = Object.fromEntries(
    categoryList.map((c) => [c.id, c])
  );

  // Filter complaints based on role:
  const filteredComplaints =
    user?.role === "Super Admin"
      ? complaints
      : complaints.filter((c) => c.user_id === user?.id);

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const indexOfLastComplaint = page * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaint = filteredComplaints.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );

  return (
    <div className="container-fluid mt-5 p-2 border shadow-sm">
      <div className="p-4 d-flex justify-content-between align-items-center">
        <div className="col-sm-6">
          <h1 className="m-0 text-dark">Complaint</h1>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">Complaint Management</li>
            </ol>
          </div>
        </div>
        <div>
          <Link to="/complaints">
            <button className="btn btn-success d-flex align-items-center">
              <i className="fas fa-plus me-2"></i> Add Complaint
            </button>
          </Link>
        </div>
      </div>

      <div className="row mt-4">
        <h3>Submitted Complaints</h3>
        {filteredComplaints.length === 0 ? (
          <p>No complaints yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Mobile Number</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {currentComplaint.map((complaint) => {
                  const userInfo = userMap[complaint.user_id];
                  const category = categoryMap[parseInt(complaint.categories)];

                  return (
                    <tr key={complaint.id}>
                      <td>{complaint.user_id}</td>
                      <td>{userInfo ? userInfo.name : "Unknown"}</td>
                      <td>{complaint.title}</td>
                      <td>{complaint.mobileNumber}</td>
                      <td>{category ? category.category_name : "Unknown"}</td>

                      <td>
                        {complaint.description.length > 100 ? (
                          <>
                            {complaint.description.slice(0, 30)}...
                            <button
                              className="btn btn-sm btn-link"
                              onClick={() =>
                                setModalDescription(complaint.description)
                              }
                            >
                              View More
                            </button>
                          </>
                        ) : (
                          complaint.description
                        )}
                      </td>

                      <td>
                        {complaint.image ? (
                          <img
                            src={`http://localhost:5001/auth/uploads/${complaint.image}`}
                            alt="Complaint"
                            style={{
                              width: "100px",
                              height: "auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleImageClick(
                                `http://localhost:5001/auth/uploads/${complaint.image}`
                              )
                            }
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            backgroundColor:
                              complaint.status.toLowerCase() === "open"
                                ? "#28a745"
                                : "#dc3545",
                            color: "white",
                            textTransform: "capitalize",
                            fontSize: "0.85rem",
                          }}
                        >
                          {complaint.status}
                        </span>

                        {user?.role === "Super Admin" ? (
                          <select
                            value={complaint.status.toLowerCase()}
                            onChange={(e) =>
                              handleStatusChange(complaint.id, e.target.value)
                            }
                          >
                            {statusOptions.map((opt) => (
                              <option
                                key={opt.id}
                                value={opt.status.toLowerCase()}
                              >
                                {opt.status.charAt(0).toUpperCase() +
                                  opt.status.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination className="d-flex mt-3 justify-content-center">
        <Pagination.Prev
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        />
      </Pagination>

      {/* Modal for Image View */}
      {modalImage && (
        <div
          className="modal"
          style={modalStyles.overlay}
          onClick={closeModal}
        >
          <div className="modal-content" style={modalStyles.modalContent}>
            <img
              src={modalImage}
              alt="Expanded View"
              style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          </div>
        </div>
      )}

      {/* Modal for Description */}
      {modalDescription && (
        <div
          className="modal"
          style={modalStyles.overlay}
          onClick={() => setModalDescription(null)}
        >
          <div className="modal-content" style={modalStyles.modalContent}>
            <h5>Full Description</h5>
            <p style={{ whiteSpace: "pre-wrap" }}>{modalDescription}</p>
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setModalDescription(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
    overflowY: "auto",
  },
  modalContent: {
    position: "relative",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    wordBreak: "break-word",
  },
};

export default ComplaintManagement;
