// import React, { useState, useEffect, useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Pagination from "react-bootstrap/Pagination";
// import { AuthContext } from "../context/AuthContext";

// function ComplaintManagement() {
//   const { token } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
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
//     if (token) {
//       fetchUsers();
//     }
//   }, [token]);

//   useEffect(() => {
//     if (token) {
//       fetchCategories();
//     }
//   }, [token]);

//   useEffect(() => {
//     if (token) {
//       fetchComplaints();
//     }
//   }, [token, location]); // refresh complaints on location change

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
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentComplaint.map((complaint) => {
//                   const user = users.find((u) => u.id === complaint.user_id);
//                   const category = categoryList.find(
//                     (cat) => cat.id === parseInt(complaint.categories)
//                   );

//                   return (
//                     <tr key={complaint.id}>
//                       <td>{complaint.user_id}</td>
//                       <td>{user ? user.name : "Unknown"}</td>
//                       <td>{complaint.title}</td>
//                       <td>{complaint.mobileNumber}</td>
//                       <td>{category ? category.category_name : "Unknown"}</td>
//                       <td>{complaint.description}</td>
//                       <td>
//                         {complaint.image ? (
//                           <a
//                             href={`http://localhost:5001/auth/uploads/${complaint.image}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             <img
//                               src={`http://localhost:5001/auth/uploads/${complaint.image}`}
//                               alt="Complaint"
//                               style={{ width: "100px", height: "auto" }}
//                             />
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

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
//     </div>
//   );
// }

// export default ComplaintManagement;



import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { AuthContext } from "../context/AuthContext";

function ComplaintManagement() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modalImage, setModalImage] = useState(null); // Modal image state
  const location = useLocation();

  const complaintsPerPage = 10;
  const indexOfLastComplaint = page * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaint = complaints.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );
  const totalPages = Math.ceil(complaints.length / complaintsPerPage);

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

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCategories();
      fetchComplaints();
    }
  }, [token, location]); // fetch data on location change

  const handleImageClick = (imagePath) => {
    setModalImage(imagePath); // Set the image path to display in the modal
  };

  const closeModal = () => {
    setModalImage(null); // Close the modal by resetting the image path
  };

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
        {complaints.length === 0 ? (
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
                </tr>
              </thead>

              <tbody>
                {currentComplaint.map((complaint) => {
                  const user = users.find((u) => u.id === complaint.user_id);
                  const category = categoryList.find(
                    (cat) => cat.id === parseInt(complaint.categories)
                  );

                  return (
                    <tr key={complaint.id}>
                      <td>{complaint.user_id}</td>
                      <td>{user ? user.name : "Unknown"}</td>
                      <td>{complaint.title}</td>
                      <td>{complaint.mobileNumber}</td>
                      <td>{category ? category.category_name : "Unknown"}</td>
                      <td>{complaint.description}</td>
                      <td>
                        {complaint.image ? (
                          <img
                            src={`http://localhost:5001/auth/uploads/${complaint.image}`}
                            alt="Complaint"
                            style={{ width: "100px", height: "auto", cursor: "pointer" }}
                            onClick={() =>
                              handleImageClick(`http://localhost:5001/auth/uploads/${complaint.image}`)
                            }
                          />
                        ) : (
                          "N/A"
                        )}
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
        <div className="modal" style={modalStyles.overlay} onClick={closeModal}>
          <div className="modal-content" style={modalStyles.modalContent}>
            <img
              src={modalImage}
              alt="Expanded View"
              style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
            {/* <button
              className="btn btn-danger"
              style={{ position: "absolute", top: "10px", right: "10px" }}
              onClick={closeModal}
            >
              Close
            </button> */}
             {/* <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-danger"
                style={{ position: "absolute", top: "10px", right: "10px" }}
                onClick={closeModal}
              >
                Close
              </button>
    
              <a
                href={modalImage}
                download
                className="btn btn-primary"
                style={{ marginTop: "20px" }}
              >
                Download Image
              </a>
          </div> */}
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
  },
  modalContent: {
    position: "relative",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "60%",
  },
};

export default ComplaintManagement;
