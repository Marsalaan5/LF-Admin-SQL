
// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import Pagination from "react-bootstrap/Pagination";
// import { ComplaintContext } from "../context/ComplaintContext";

// function ComplaintManagement() {


//   const { token } = useContext(AuthContext);
// const { complaints, setComplaints, fetchComplaints } = useContext(ComplaintContext);


// const [users,setUsers] = useState([])
//   // const [title, setTitle] = useState(""); 
//   //  const [mobileNumber, setMobileNumber] = useState("");
//   const [categories, setCategories] = useState("");
//   const [categoryList, setCategoryList] = useState([]);
//   // const [description, setDescription] = useState("");
//   // const [image, setImage] = useState(null);
//   // const [error, setError] = useState(null);
//   // const [showModal, setShowModal] = useState(false);
//   // const [complaints, setComplaints] = useState([]);


//   const [page, setPage] = useState(1);
//   const complaintsPerPage = 10;

//   const indexOfLastComplaint = page * complaintsPerPage;
//   const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
//   const currentComplaint = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
//   const totalPages = Math.ceil(complaints.length / complaintsPerPage);


//    const fetchUsers = async () => {
//       try {
//         const res = await axios.get("http://localhost:5001/auth/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(res.data.users);
//         console.log("Fetched users:", res.data.users);
//       } catch (err) {
//         console.error("Failed to load users", err);
//         // setMessage("Error loading users.");
//         setError("Error loading users.");

//       }
//     };

// useEffect(() => {
//   if (token) {
//     fetchUsers();
//      fetchComplaints(token);
//   }
// }, [token]);

//   // Fetch categories and complaints on component mount
//   useEffect(() => {
//     const fetchedComplaints = async () => {
//       try {
//         const res = await axios.get("http://localhost:5001/auth/complaints", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setCategoryList(res.data);

//         // Fetch complaints from backend
//         // const complaintsRes = await axios.get("http://localhost:5001/auth/complaints", {
//         //   headers: {
//         //     Authorization: `Bearer ${token}`,
//         //   },
//         // });
//         // const fetchedComplaints = complaintsRes.data;
//         // setComplaints(fetchedComplaints);
//         await fetchedComplaints(token);


//         // Store fetched complaints in localStorage
//         localStorage.setItem("complaints", JSON.stringify(fetchedComplaints));
//       } catch (err) {
//         console.error("Failed to load categories:", err);
//         setError("Failed to load categories");
//       }
//     };

//     fetchedComplaints();
//   }, [token]);


//   useEffect(() => {
//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/categories", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCategoryList(res.data);
//     } catch (err) {
//       console.error("Failed to load categories:", err);
//       setError("Failed to load categories");
//     }
//   };

//   if (token) {
//     fetchCategories();
//   }
// }, [token]);



//   // useEffect(() => {
//   //   if (complaints.length > 0) {
//   //     localStorage.setItem("complaints", JSON.stringify(complaints));
//   //   }
//   // }, [complaints]);

//   useEffect(() => {
//     const storedComplaints = JSON.parse(localStorage.getItem("complaints"));
//     if (storedComplaints) {
//       setComplaints(storedComplaints);
//     }
//   }, []);

 
//   // const handleFileChange = (e) => {
//   //   setImage(e.target.files[0]);
//   // };


//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!title || !categories || !description) {
//   //     setError("All fields are required");
//   //     return;
//   //   }

//   //   const formData = new FormData();
//   //   formData.append("title", title);
//   //   formData.append("mobileNumber", mobileNumber);
//   //   formData.append("categories", categories);
//   //   formData.append("description", description);
//   //   if (image) {
//   //     formData.append("image", image);
//   //   }

//   //   try {
//   //     const response = await axios.post(
//   //       "http://localhost:5001/auth/complaints",
//   //       formData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
//   //     );

//   //     if (response.status === 200) {
//   //       const newComplaint = response.data

     
        
       
//   //       setComplaints([newComplaint, ...complaints]);

      
//   //       localStorage.setItem("complaints", JSON.stringify([newComplaint, ...complaints]));

   
//   //       setTitle("");
//   //           setMobileNumber("");
//   //       setCategories("");
//   //       setDescription("");
//   //       setImage(null);
//   //       setError(null);
//   //       setShowModal(false);
//   //     } else {
//   //       setError("Failed to submit complaint. Please try again later.");
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     setError("Error submitting complaint");
//   //   }
//   // };

//   return (
//     <div className="container-fluid mt-5 p-2 border shadow-sm">
//       <div className="p-4 d-flex justify-content-between align-items-center">
//         <div className="col-sm-6">
//           <h1 className="m-0 text-dark">Complaint</h1>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active">Complaint Management</li>
//             </ol>
//           </div>
//         </div>
//         <div className="d-flex gap-3">
//          <Link to="/complaints">
//   <button className="btn btn-success d-flex align-items-center">
//     <i className="fas fa-plus me-2"></i> Add Complaint
//   </button>
// </Link>
//         </div>
//       </div>

      

//       <div className="row mt-4">
//   <h3>Submitted Complaints</h3>
//   {complaints.length === 0 ? (
//     <p>No complaints yet.</p>
//   ) : (
//     <div className="table-responsive">
//       <table className="table table-striped table-bordered">
//         <thead className="table-dark">
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Title</th>
//             <th>Mobile Number</th>
//             <th>Category</th>
//             <th>Description</th>
//             <th>Image</th>
//           </tr>
//         </thead>
      
//         <tbody>
//   {currentComplaint.map((complaint) => {
//     const user = users.find(u => u.id === complaint.user_id); 
//     return (
//       <tr key={complaint.id}>
//         <td>{complaint.user_id}</td>
//         <td>{user ? user.name : "Unknown"}</td>
//         <td>{complaint.title}</td>
//         <td>{complaint.mobileNumber}</td>
//         <td>{complaint.categories}</td>
//         <td>{complaint.description}</td>
//         <td>
//           {complaint.image ? (
//             <img
//               src={`http://localhost:5001/uploads/${complaint.image}`}
//               alt="Complaint"
//               style={{ width: "100px", height: "auto" }}
//             />
//           ) : (
//             "N/A"
//           )}
//         </td>
//       </tr>
//     );
//   })}
// </tbody>

//       </table>
//     </div>
//   )}
// </div>


//       {/* Modal with form */}
//       {/* {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">Add Complaint</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
              
//                   <div className="mb-3">
//                     <label htmlFor="title" className="form-label">
//                       Title
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="title"
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                     />
//                   </div>

//                      <div className="mb-3">
//                     <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
//                     <input
//                       type="tel"
//                       className="form-control"
//                       id="mobileNumber"
//                       value={mobileNumber}
//                       onChange={(e) => setMobileNumber(e.target.value)}
//                       pattern="[0-9]{10}"
//                       title="Enter a 10-digit mobile number"
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label htmlFor="categories" className="form-label">
//                       Category
//                     </label>
//                     <select
//                       className="form-control"
//                       id="categories"
//                       value={categories}
//                       onChange={(e) => setCategories(e.target.value)}
//                     >
//                       <option value="">Select a Category</option>
//                       {categoryList.map((cat) => (
//                         <option key={cat.id} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="mb-3">
//                     <label htmlFor="description" className="form-label">
//                       Description
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="description"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label htmlFor="image" className="form-label">
//                       Upload Image
//                     </label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       id="image"
//                       onChange={handleFileChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     Submit Complaint
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )} */}

//        <Pagination className="d-flex mt-3 justify-content-center">
//                 <Pagination.Prev
//                   onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={page === 1}
//                 />
      
//                 {[...Array(totalPages)].map((_, idx) => (
//                   <Pagination.Item
//                     key={idx + 1}
//                     active={idx + 1 === page}
//                     onClick={() => setPage(idx + 1)}
//                   >
//                     {idx + 1}
//                   </Pagination.Item>
//                 ))}
      
//                 <Pagination.Next
//                   onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//                   disabled={page === totalPages}
//                 />
//               </Pagination>
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
  const location = useLocation();

  const complaintsPerPage = 10;
  const indexOfLastComplaint = page * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaint = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
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
      const categoryRes = await axios.get("http://localhost:5001/auth/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchComplaints();
    }
  }, [token, location]); // refresh complaints on location change

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
              {/* <tbody>
                {currentComplaint.map((complaint) => {
                  const user = users.find((u) => u.id === complaint.user_id);
                  return (
                    <tr key={complaint.id}>
                      <td>{complaint.user_id}</td>
                      <td>{user ? user.name : "Unknown"}</td>
                      <td>{complaint.title}</td>
                      <td>{complaint.mobileNumber}</td>
                      <td>{complaint.categories}</td>
                      <td>{complaint.description}</td>
                      <td>
                        {complaint.image ? (
                          <img
                            src={`http://localhost:5001/uploads/${complaint.image}`}
                            alt="Complaint"
                            style={{ width: "100px", height: "auto" }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody> */}
              <tbody>
  {currentComplaint.map((complaint) => {
    const user = users.find((u) => u.id === complaint.user_id);
    const category = categoryList.find((cat) => cat.id === parseInt(complaint.categories));

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
            // <img
            //   src={`http://localhost:5001/auth/uploads/${complaint.image}`}
            //   alt="Complaint"
            //   style={{ width: "100px", height: "auto" }}
            // />
<a
  href={`http://localhost:5001/auth/uploads/${complaint.image}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src={`http://localhost:5001/auth/uploads/${complaint.image}`}
    alt="Complaint"
    style={{ width: "100px", height: "auto" }}
  />
</a>


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
    </div>
  );
}

export default ComplaintManagement;
