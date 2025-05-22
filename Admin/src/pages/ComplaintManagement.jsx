// import React, { useState,useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// function Complaint() {

//     const {token} = useContext(AuthContext)
//   const [title, setTitle] = useState('');
//   const [categories, setCategories] = useState('');
// const [categoryList, setCategoryList] = useState([]);
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get('http://localhost:5001/auth/categories',{
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });;
//         setCategoryList(res.data);
//       } catch (err) {
//         console.error('Failed to load categories:', err);
//         setError('Failed to load categories');
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleFileChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !categories || !description) {
//       setError('All fields are required');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('categories', categories);
//     formData.append('description', description);
//     if (image) {
//       formData.append('image', image);
//     }

//     try {
//       const response = await axios.post('http://localhost:5001/auth/complaints', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 200) {
//         setTitle('');
//         setCategories('');
//         setDescription('');
//         setImage(null);
//         setShowModal(true);
//         setError(null);
//       } else {
//         setError('Failed to submit complaint. Please try again later.');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Error submitting complaint');
//     }
//   };

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
//               <li className="breadcrumb-item active">Complaint</li>
//             </ol>
//           </div>
//         </div>
//         <div className="d-flex gap-3">
//           <button
//             className="btn btn-success d-flex align-items-center"
//             onClick={() => setShowModal(true)}
//           >
//             <i className="fas fa-plus me-2"></i> Add Complaint
//           </button>
//         </div>
//       </div>

//       <div className="card p-4 shadow-sm">
//         {error && <div className="alert alert-danger">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="title" className="form-label">Title</label>
//             <input
//               type="text"
//               className="form-control"
//               id="title"
//               placeholder="Enter Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="categories" className="form-label">Category</label>
//             <select
//               type="text"
//               className="form-control"
//               id="categories"
//               placeholder="Enter Category"
//               value={categories}
//               onChange={(e) => setCategories(e.target.value)}
//             >
//                 <option value="">Select a Category</option>
//                 {categoryList.map((cat)=>(
//                     <option key={cat.id} value={cat.category_name}>
//                         {cat.category_name}
//                     </option>
//                 ))}
//             </select>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="description" className="form-label">Description</label>
//             <input
//               type="text"
//               className="form-control"
//               id="description"
//               placeholder="Describe your complaint"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="image" className="form-label">Upload Image</label>
//             <input
//               type="file"
//               className="form-control"
//               id="image"
//               onChange={handleFileChange}
//             />
//           </div>

//           <button className="btn btn-primary w-100" type="submit">
//             Submit Complaint
//           </button>
//         </form>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Success</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p>Your complaint has been submitted successfully.</p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Complaint;

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// function Complaint() {
//   const { token } = useContext(AuthContext);
//   const [title, setTitle] = useState("");
//   const [categories, setCategories] = useState("");
//   const [categoryList, setCategoryList] = useState([]);
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:5001/auth/categories", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setComplaints(res.data);
//         setCategoryList(res.data);
//       } catch (err) {
//         console.error("Failed to load categories:", err);
//         setError("Failed to load categories");
//       }
//     };

//     fetchCategories();
//     // fetchComplaint();
//   }, [token]);

//   useEffect(() => {
//   // Load complaints from localStorage on component mount
//   const storedComplaints = JSON.parse(localStorage.getItem("complaints"));
//   if (storedComplaints) {
//     setComplaints(storedComplaints);
//   }
// }, []);



//   const handleFileChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!title || !categories || !description) {
//     setError("All fields are required");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("title", title);
//   formData.append("categories", categories);
//   formData.append("description", description);
//   if (image) {
//     formData.append("image", image);
//   }

//   try {
//     const response = await axios.post(
//       "http://localhost:5001/auth/complaints",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (response.status === 200) {
//       const newComplaint = {
//         id: Date.now(),
//         title,
//         category: categories,
//         description,
//       };

//       // Update complaints state and persist to localStorage
//       const updatedComplaints = [newComplaint, ...complaints];
//       setComplaints(updatedComplaints);
//       localStorage.setItem("complaints", JSON.stringify(updatedComplaints));

//       // Reset form
//       setTitle("");
//       setCategories("");
//       setDescription("");
//       setImage(null);
//       setError(null);
//       setShowModal(false);
//     } else {
//       setError("Failed to submit complaint. Please try again later.");
//     }
//   } catch (err) {
//     console.error(err);
//     setError("Error submitting complaint");
//   }
// };

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
//               <li className="breadcrumb-item active">Complaint</li>
//             </ol>
//           </div>
//         </div>
//         <div className="d-flex gap-3">
//           <button
//             className="btn btn-success d-flex align-items-center"
//             onClick={() => setShowModal(true)}
//           >
//             <i className="fas fa-plus me-2"></i> Add Complaint
//           </button>
//         </div>
//       </div>

//       {/* Display submitted complaints */}
//       <div className="row mt-4">
//         <h3>Submitted Complaints</h3>
//         {complaints.length === 0 ? (
//           <p>No complaints yet.</p>
//         ) : (
//           complaints.map((complaint) => (
//             <div className="col-md-4 mb-3" key={complaint.id}>
//               <div className="card shadow-sm p-3">
//                 <h5>{complaint.title}</h5>
//                 <p>
//                   <strong>Category:</strong> {complaint.category}
//                 </p>
//                 <p>{complaint.description}</p>
//                 {complaint.image && (
//                   <img
//                     src={`http://localhost:5001/uploads/${complaint.image}`}
//                     alt="Complaint"
//                     style={{ maxWidth: "200px", maxHeight: "200px" }}
//                   />
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Modal with form */}
//       {showModal && (
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
//                   {error && <div className="alert alert-danger">{error}</div>}
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
//       )}
//     </div>
//   );
// }

// export default Complaint;



import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Pagination from "react-bootstrap/Pagination";

function ComplaintManagement() {


  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
   const [mobileNumber, setMobileNumber] = useState("");
  const [categories, setCategories] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState([]);


  const [page, setPage] = useState(1);
  const complaintsPerPage = 10;

  const indexOfLastComplaint = page * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaint = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
  const totalPages = Math.ceil(complaints.length / complaintsPerPage);

  // Fetch categories and complaints on component mount
  useEffect(() => {
    const fetchCategoriesAndComplaints = async () => {
      try {
        const res = await axios.get("http://localhost:5001/auth/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategoryList(res.data);

        // Fetch complaints from backend
        const complaintsRes = await axios.get("http://localhost:5001/auth/complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedComplaints = complaintsRes.data;
        setComplaints(fetchedComplaints);

        // Store fetched complaints in localStorage
        localStorage.setItem("complaints", JSON.stringify(fetchedComplaints));
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories");
      }
    };

    fetchCategoriesAndComplaints();
  }, [token]);

  // Persist complaints to localStorage when state changes
  useEffect(() => {
    if (complaints.length > 0) {
      localStorage.setItem("complaints", JSON.stringify(complaints));
    }
  }, [complaints]);

  // Load complaints from localStorage on page reload
  useEffect(() => {
    const storedComplaints = JSON.parse(localStorage.getItem("complaints"));
    if (storedComplaints) {
      setComplaints(storedComplaints);
    }
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !categories || !description) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("mobileNumber", mobileNumber);
    formData.append("categories", categories);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/auth/complaints",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const newComplaint = {
          id: Date.now(),
          title,
              mobileNumber,
          category: categories,
          description,
        };

        // Update complaints state
        const updatedComplaints = [newComplaint, ...complaints];
        setComplaints(updatedComplaints);

        // Persist updated complaints in localStorage
        localStorage.setItem("complaints", JSON.stringify(updatedComplaints));

        // Reset form
        setTitle("");
            setMobileNumber("");
        setCategories("");
        setDescription("");
        setImage(null);
        setError(null);
        setShowModal(false);
      } else {
        setError("Failed to submit complaint. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setError("Error submitting complaint");
    }
  };

  return (
    <div className="container-fluid mt-5 p-2 border shadow-sm">
      <div className="p-4 d-flex justify-content-between align-items-center">
        <div className="col-sm-6">
          <h1 className="m-0 text-dark">Complaint</h1>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">Complaint Management</li>
            </ol>
          </div>
        </div>
        <div className="d-flex gap-3">
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus me-2"></i> Add Complaint
          </button>
        </div>
      </div>

      {/* Display submitted complaints */}
      {/* <div className="row mt-4">
        <h3>Submitted Complaints</h3>
        {complaints.length === 0 ? (
          <p>No complaints yet.</p>
        ) : (
          complaints.map((complaint) => (
            <div className="col-md-4 mb-3" key={complaint.id}>
              <div className="card shadow-sm p-3">
                <h5>{complaint.title}</h5>
                <p>{complaint.mobileNumber}</p>
                <p>
                  <strong>Category:</strong> {complaint.category}
                </p>
                <p>{complaint.description}</p>
                {complaint.image && (
                  <img
                    src={`http://localhost:5001/uploads/${complaint.image}`}
                    alt="Complaint"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div> */}

      <div className="row mt-4">
  <h3>Submitted Complaints</h3>
  {complaints.length === 0 ? (
    <p>No complaints yet.</p>
  ) : (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Mobile Number</th>
            <th>Category</th>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {currentComplaint.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.title}</td>
              <td>{complaint.mobileNumber}</td>
              <td>{complaint.category}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>


      {/* Modal with form */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Complaint</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* {error && <div className="alert alert-danger">{error}</div>} */}
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                     <div className="mb-3">
                    <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobileNumber"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      pattern="[0-9]{10}"
                      title="Enter a 10-digit mobile number"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="categories" className="form-label">
                      Category
                    </label>
                    <select
                      className="form-control"
                      id="categories"
                      value={categories}
                      onChange={(e) => setCategories(e.target.value)}
                    >
                      <option value="">Select a Category</option>
                      {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.category_name}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Complaint
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
