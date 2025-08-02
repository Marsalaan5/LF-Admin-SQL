
// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../../context/AuthContext';
// import toast, { Toaster } from "react-hot-toast"; 



// function Ccms() {
//   const { token } = useContext(AuthContext);
//   const [ccmsCategories, setCcmsCategories] = useState([]);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [categoryName, setCategoryName] = useState('');
//   const [categoryDescription, setCategoryDescription] = useState('');
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   // Fetch categories
//   const fetchCcmsCategories = async () => {
//     try {
//       const response = await axios.get('http://localhost:5001/auth/ccms-categories', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCcmsCategories(response.data);
//     } catch (err) {
//       setError('Failed to load categories');
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       console.log('token:', token);
//       navigate('/login');
//       return;
//     }
//     fetchCcmsCategories();
//   }, [token]);

//   const handleSubmitCategory = async () => {
//   if (!categoryName || !categoryDescription) {
//     setError('Both fields are required');
//     return;
//   }

//   try {
//     if (editingCategory) {
//       // Edit category
//       await axios.put(
//         `http://localhost:5001/auth/ccms-categories/${editingCategory.id}`,
//         {
//           category_name: categoryName,
//           description: categoryDescription,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Your Ccms Category has been edited successfully.");
//     } else {
 
//       await axios.post(
//         'http://localhost:5001/auth/ccms-categories',
//         {
//           category_name: categoryName,
//           description: categoryDescription,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Your Category has been submitted successfully.");
//     }
//     setCategoryName('');
//     setCategoryDescription('');
//     setEditingCategory(null);
//     setShowModal(false);
//     fetchCcmsCategories();
//     setError(null);
//   } catch (err) {
//     console.error(err);
//     setError(editingCategory ? 'Failed to update Ccms category' : 'Failed to add Ccms category');
//   }
// };


//   const handleEditCategory = (ccmsCategory) => {
   
//     setEditingCategory(ccmsCategory);
//     setCategoryName(ccmsCategory.category_name);
//     setCategoryDescription(ccmsCategory.description);
//     setShowModal(true);
//   };

//   const handleDeleteCategory = async (id) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this ccms category?');
//     if (confirmDelete) {
//       try {
//         await axios.delete(`http://localhost:5001/auth/ccms-categories/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         toast.success("Your Ccms Category has been deleted successfully.")
//         fetchCcmsCategories();
//       } catch (err) {
//         console.error(err);
//         setError('Failed to delete ccms category');
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCategoryName('');
//     setCategoryDescription('');
//     setEditingCategory(null); // Reset editing state
//   };

//   return (
//     <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%"}}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <div className="col-sm-6">
//           <h3>CCMS Category</h3>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active">CCMS Category Management</li>
//             </ol>
//           </div>
//         </div>
//         <div className="d-flex gap-3">
//           <button
//             className="btn btn-success d-flex align-items-center"
//             onClick={() => setShowModal(true)}
//           >
//             <i className="fas fa-plus me-2"></i> Add Ccms Category
//           </button>
//           {error && <div className="alert alert-danger mt-3">{error}</div>}
//         </div>
//       </div>

//       <div className="p-4">
//         <table className="table mt-3">
//           <thead>
//             <tr>
//               <th>Category Name</th>
//               <th>Description</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {ccmsCategories.map((ccmsCategory) => (
//               <tr key={ccmsCategory.id}>
//                 <td>{ccmsCategory.category_name}</td>
//                 <td>{ccmsCategory.description}</td>
//                 <td>
//                   <button
//                     className="btn btn-outline-primary btn-sm"
//                     onClick={() => handleEditCategory(ccmsCategory)}
//                     title="Edit"
//                   >
//                     <i className="fas fa-edit"></i>
//                   </button>
//                   <button
//                     className="btn btn-outline-danger btn-sm ms-2"
//                     onClick={() => handleDeleteCategory(ccmsCategory.id)}
//                     title="Delete"
//                   >
//                     <i className="fas fa-trash-alt"></i>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Category Modal */}
//         {showModal && (
//           <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
//                   <button type="button" className="btn-close" onClick={handleCloseModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <form>
//                     <div className="mb-3">
//                       <label htmlFor="categoryName" className="form-label">Category Name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="categoryName"
//                         placeholder="Enter category name"
//                         value={categoryName}
//                         onChange={(e) => setCategoryName(e.target.value)}
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="categoryDescription" className="form-label">Category Description</label>
//                       <textarea
//                         className="form-control"
//                         id="categoryDescription"
//                         rows="3"
//                         placeholder="Enter category description"
//                         value={categoryDescription}
//                         onChange={(e) => setCategoryDescription(e.target.value)}
//                       ></textarea>
//                     </div>
//                   </form>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
//                     Close
//                   </button>
//                   <button type="button" className="btn btn-primary" onClick={handleSubmitCategory}>
//                     {editingCategory ? 'Update Category' : 'Add Category'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Ccms;



// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function Category() {
//   const [categories, setCategories] = useState([]);
//   const [modalData, setModalData] = useState({
//     show: false,
//     type: "category", // "category" | "subcategory"
//     mode: "add", // "add" | "edit"
//     parentId: null,
//     data: null,
//   });

//   const {token} = useContext(AuthContext)

//   const fetchCategories = async () => {
//     try {
//       const catRes = await fetch("http://localhost:5001/auth/categories", {
//         headers: {
//           Authorization:  `Bearer ${token}`,
//         },
//       });
//       const subRes = await fetch("http://localhost:5001/auth/subcategories", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!catRes.ok || !subRes.ok) {
//         throw new Error("Failed to fetch data");
//       }

//       const categoriesData = await catRes.json();
//       const subcategoriesData = await subRes.json();

//       // Build nested subcategory tree
//       const subMap = new Map();
//       subcategoriesData.forEach((sub) =>
//         subMap.set(sub.id, { ...sub, children: [] })
//       );

//       const rootSubs = [];
//       subcategoriesData.forEach((sub) => {
//         if (sub.parent_subcategory_id) {
//           const parent = subMap.get(sub.parent_subcategory_id);
//           if (parent) parent.children.push(subMap.get(sub.id));
//         } else {
//           rootSubs.push(subMap.get(sub.id));
//         }
//       });

//       // Attach root subcategories to categories
//       const categoriesWithSubs = categoriesData.map((cat) => ({
//         ...cat,
//         subcategories: rootSubs.filter((sub) => sub.category_id === cat.id),
//       }));

//       setCategories(categoriesWithSubs);
//     } catch (error) {
//       console.error("Error fetching categories or subcategories:", error);
//       alert("Failed to load categories.");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const openModal = (type, mode = "add", parentId = null, data = null) => {
//     setModalData({ show: true, type, mode, parentId, data });
//   };

//   const closeModal = () => {
//     setModalData({ show: false, type: "", mode: "", parentId: null, data: null });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const formData = Object.fromEntries(new FormData(form));

//     try {
//       const urlBase = "http://localhost:5001/auth";
//       let url = "";
//       let method = "";

//       if (modalData.type === "category") {
//         if (modalData.mode === "add") {
//           url = `${urlBase}/categories`;
//           method = "POST";
//         } else {
//           url = `${urlBase}/categories/${modalData.data.id}`;
//           method = "PUT";
//         }
//       } else if (modalData.type === "subcategory") {
//         if (modalData.mode === "add") {
//           url = `${urlBase}/subcategories`;
//           method = "POST";
//           // Add category_id and parent_subcategory_id to formData
//           formData.category_id = modalData.parentId.categoryId;
//           formData.parent_subcategory_id = modalData.parentId.subcategoryId || null;
//         } else {
//           url = `${urlBase}/subcategories/${modalData.data.id}`;
//           method = "PUT";
//         }
//       }

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to save data");

//       closeModal();
//       fetchCategories();
//     } catch (error) {
//       alert("Error saving data");
//       console.error(error);
//     }
//   };

//   const renderSubcategories = (subs, categoryId) => {
//     if (!subs || subs.length === 0) return null;

//     return (
//       <ul className="list-group list-group-flush ms-4">
//         {subs.map((sub) => (
//           <li key={sub.id} className="list-group-item">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <strong>{sub.subcategory_name}</strong> - {sub.description}
//               </div>
//               <div>
//                 <button
//                   className="btn btn-sm btn-outline-primary me-2"
//                   onClick={() => openModal("subcategory", "edit", null, sub)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-sm btn-outline-success me-2"
//                   onClick={() =>
//                     openModal("subcategory", "add", {
//                       categoryId: categoryId,
//                       subcategoryId: sub.id,
//                     })
//                   }
//                 >
//                   Add Child
//                 </button>
//               </div>
//             </div>
//             {renderSubcategories(sub.children, categoryId)}
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Category & Nested Subcategory Manager</h2>
//       <button
//         className="btn btn-primary mb-3"
//         onClick={() => openModal("category", "add")}
//       >
//         Add Category
//       </button>

//       <ul className="list-group">
//         {categories.map((cat) => (
//           <li key={cat.id} className="list-group-item">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <strong>{cat.category_name}</strong> - {cat.description}
//               </div>
//               <div>
//                 <button
//                   className="btn btn-sm btn-outline-primary me-2"
//                   onClick={() => openModal("category", "edit", null, cat)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-sm btn-outline-success"
//                   onClick={() => openModal("subcategory", "add", { categoryId: cat.id })}
//                 >
//                   Add Subcategory
//                 </button>
//               </div>
//             </div>

//             {renderSubcategories(cat.subcategories, cat.id)}
//           </li>
//         ))}
//       </ul>

//       {/* Modal */}
//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           aria-modal="true"
//           role="dialog"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {modalData.mode === "add" ? "Add" : "Edit"}{" "}
//                     {modalData.type === "category" ? "Category" : "Subcategory"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={closeModal}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label htmlFor="nameInput" className="form-label">
//                       {modalData.type === "category"
//                         ? "Category Name"
//                         : "Subcategory Name"}
//                     </label>
//                     <input
//                       type="text"
//                       id="nameInput"
//                       name={
//                         modalData.type === "category"
//                           ? "category_name"
//                           : "subcategory_name"
//                       }
//                       className="form-control"
//                       defaultValue={
//                         modalData.data
//                           ? modalData.type === "category"
//                             ? modalData.data.category_name
//                             : modalData.data.subcategory_name
//                           : ""
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="descInput" className="form-label">
//                       Description
//                     </label>
//                     <textarea
//                       id="descInput"
//                       name="description"
//                       className="form-control"
//                       defaultValue={modalData.data?.description || ""}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={closeModal}
//                   >
//                     Close
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     {modalData.mode === "add" ? "Add" : "Save"}
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

// export default Category;



// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function Category() {
//   const [categories, setCategories] = useState([]);
//   const [modalData, setModalData] = useState({ show: false, mode: "add", data: null });
//   const { token } = useContext(AuthContext);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch categories");
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load categories.");
//     }
//   };

//   useEffect(() => { fetchCategories(); }, [token]);

//   const openModal = (mode, data = null) => setModalData({ show: true, mode, data });
//   const closeModal = () => setModalData({ show: false, mode: "", data: null });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = Object.fromEntries(new FormData(e.target));
//     const method = modalData.mode === "add" ? "POST" : "PUT";
//     const url = modalData.mode === "add"
//       ? "http://localhost:5001/auth/categories"
//       : `http://localhost:5001/auth/categories/${modalData.data.id}`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });
//       if (!res.ok) throw new Error("Failed to save category");
//       closeModal();
//       fetchCategories();
//     } catch (err) {
//       alert("Error saving category");
//       console.error(err);
//     }
//   };

//  return (
//   <div className="container-fluid border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
//     <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//       <h2>Category Manager</h2>
//       <button className="btn btn-primary" onClick={() => openModal("add")}>
//         Add Category
//       </button>
//     </div>

//     {/* List of categories */}
//     <ul className="list-group mb-5">
//       {categories.map((cat) => (
//         <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
//           <div><strong>{cat.category_name}</strong> - {cat.description}</div>
//           <button
//             className="btn btn-sm btn-outline-primary"
//             onClick={() => openModal("edit", cat)}
//           >
//             Edit
//           </button>
//         </li>
//       ))}
//     </ul>

//     {/* Modal */}
//     {modalData.show && (
//       <div
//         className="modal fade show d-block"
//         tabIndex="-1"
//         style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         onClick={closeModal}
//       >
//         <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
//           <div className="modal-content">
//             <form onSubmit={handleSubmit}>
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {modalData.mode === "add" ? "Add" : "Edit"} Category
//                 </h5>
//                 <button type="button" className="btn-close" onClick={closeModal}></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Category Name</label>
//                   <input
//                     type="text"
//                     name="category_name"
//                     className="form-control"
//                     defaultValue={modalData.data?.category_name || ""}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Description</label>
//                   <textarea
//                     name="description"
//                     className="form-control"
//                     defaultValue={modalData.data?.description || ""}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
//                 <button type="submit" className="btn btn-primary">
//                   {modalData.mode === "add" ? "Add" : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// );

// }

// export default Category;


// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function Category() {
//   const [categories, setCategories] = useState([]);
//   const [modalData, setModalData] = useState({ show: false, mode: "add", data: null });
//   const { token } = useContext(AuthContext);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch categories");
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load categories.");
//     }
//   };

//   useEffect(() => { fetchCategories(); }, [token]);

//   const openModal = (mode, data = null) => setModalData({ show: true, mode, data });
//   const closeModal = () => setModalData({ show: false, mode: "", data: null });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = Object.fromEntries(new FormData(e.target));
//     const method = modalData.mode === "add" ? "POST" : "PUT";
//     const url = modalData.mode === "add"
//       ? "http://localhost:5001/auth/categories"
//       : `http://localhost:5001/auth/categories/${modalData.data.id}`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });
//       if (!res.ok) throw new Error("Failed to save category");
//       closeModal();
//       fetchCategories();
//     } catch (err) {
//       alert("Error saving category");
//       console.error(err);
//     }
//   };

//   return (
//     // <div className="container mt-5">
//      <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%"}}>     <div className="d-flex justify-content-between align-items-center mt-5 mb-3"></div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold">Category Manager</h2>
//         <button className="btn btn-primary" onClick={() => openModal("add")}>
//           <i className="bi bi-plus-circle me-1"></i> Add Category
//         </button>
//       </div>

//       {/* Cards Grid */}
//       <div className="row">
//         {categories.length === 0 ? (
//           <div className="text-muted text-center py-5">No categories available.</div>
//         ) : (
//           categories.map((cat) => (
//             <div key={cat.id} className="col-md-6 col-lg-4 mb-4">
//               <div className="card h-100 shadow-sm border-0">
//                 <div className="card-body d-flex flex-column">
//                   <h5 className="card-title">{cat.category_name}</h5>
//                   <p className="card-text flex-grow-1">{cat.description}</p>
//                   <button
//                     className="btn btn-outline-primary btn-sm mt-2 align-self-end"
//                     onClick={() => openModal("edit", cat)}
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Modal */}
//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content shadow">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header bg-primary text-white">
//                   <h5 className="modal-title">
//                     {modalData.mode === "add" ? "Add New" : "Edit"} Category
//                   </h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Category Name</label>
//                     <input
//                       type="text"
//                       name="category_name"
//                       className="form-control"
//                       defaultValue={modalData.data?.category_name || ""}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Description</label>
//                     <textarea
//                       name="description"
//                       className="form-control"
//                       defaultValue={modalData.data?.description || ""}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={closeModal}>
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     {modalData.mode === "add" ? "Add" : "Save Changes"}
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

// export default Category;


// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function Category() {
//   const [categories, setCategories] = useState([]);
//   const [modalData, setModalData] = useState({ show: false, mode: "add", data: null });
//   const { token } = useContext(AuthContext);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch categories");
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load categories.");
//     }
//   };

//   useEffect(() => {
//     if (token) fetchCategories();
//   }, [token]);

//   const openModal = (mode, data = null) => setModalData({ show: true, mode, data });
//   const closeModal = () => setModalData({ show: false, mode: "", data: null });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = Object.fromEntries(new FormData(e.target));
//     const method = modalData.mode === "add" ? "POST" : "PUT";
//     const url = modalData.mode === "add"
//       ? "http://localhost:5001/auth/categories"
//       : `http://localhost:5001/auth/categories/${modalData.data.id}`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });
//       if (!res.ok) throw new Error("Failed to save category");
//       closeModal();
//       fetchCategories();
//     } catch (err) {
//       alert("Error saving category");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container-fluid border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">

//       {/* <div className="d-flex justify-content-between align-items-center mb-4"> */}

//        <div className="col-sm-6">
//                 <h3>Category Management</h3>
//                 <div className="col-sm-6">
//                   <ol className="breadcrumb float-sm-right">
//                     <li className="breadcrumb-item">
//                       <a href="/">Home</a>
//                     </li>
//                     <li className="breadcrumb-item active">Category Management</li>
//                   </ol>
//                 </div>
//               </div>
//         {/* <h2 className="fw-bold">Category Manager</h2> */}
//         <button className="btn btn-success" onClick={() => openModal("add")}>
//           <i className="bi bi-plus-circle me-1"></i> Add Category
//         </button>
//       </div>

//       {/* Cards Grid */}
//       <div className="row">
//         {categories.length === 0 ? (
//           <div className="text-muted text-center py-5">No categories available.</div>
//         ) : (
//           categories.map((cat) => (
//             <div key={cat.id} className="col-md-6 col-lg-4 mb-4">
//               <div className="card h-100 shadow-sm border-0">
//                 <div className="card-body d-flex flex-column">
//                   <p className="mb-1"><strong>ID:</strong> {cat.id}</p>
//                   <p className="mb-1"><strong>Category:</strong> {cat.category_name}</p>
//                   <p className="mb-3"><strong>Description:</strong> {cat.description}</p>
//                   <button
//                     className="btn btn-outline-primary btn-sm mt-auto align-self-end"
//                     onClick={() => openModal("edit", cat)}
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Modal */}
//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content shadow">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header bg-primary text-white">
//                   <h5 className="modal-title">
//                     {modalData.mode === "add" ? "Add New" : "Edit"} Category
//                   </h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Category Name</label>
//                     <input
//                       type="text"
//                       name="category_name"
//                       className="form-control"
//                       defaultValue={modalData.data?.category_name || ""}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Description</label>
//                     <textarea
//                       name="description"
//                       className="form-control"
//                       defaultValue={modalData.data?.description || ""}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={closeModal}>
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     {modalData.mode === "add" ? "Add" : "Save Changes"}
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

// export default Category;


import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Card,
  Breadcrumb,
} from "react-bootstrap";

function Category() {
  const [categories, setCategories] = useState([]);
  const [modalData, setModalData] = useState({ show: false, mode: "add", data: null });
  const { token } = useContext(AuthContext);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5001/auth/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories.");
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  const openModal = (mode, data = null) =>
    setModalData({ show: true, mode, data });

  const closeModal = () =>
    setModalData({ show: false, mode: "", data: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    const method = modalData.mode === "add" ? "POST" : "PUT";
    const url =
      modalData.mode === "add"
        ? "http://localhost:5001/auth/categories"
        : `http://localhost:5001/auth/categories/${modalData.data.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save category");
      closeModal();
      fetchCategories();
    } catch (err) {
      alert("Error saving category");
      console.error(err);
    }
  };

  return (
    <Container fluid className="border shadow-sm" style={{ marginTop: "100px", width: "98%",borderRadius: '10px'  }}>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div>
          <h3>Category Management</h3>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Category Management</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Button variant="success" onClick={() => openModal("add")}>
          <i className="bi bi-plus-circle me-1"></i> Add Category
        </Button>
      </div>

      {/* Cards Grid */}
      <Row>
        {categories.length === 0 ? (
          <Col className="text-muted text-center py-5">No categories available.</Col>
        ) : (
          categories.map((cat) => (
            <Col key={cat.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <p className="mb-1"><strong>ID:</strong> {cat.id}</p>
                  <p className="mb-1"><strong>Category:</strong> {cat.category_name}</p>
                  <p className="mb-3"><strong>Description:</strong> {cat.description}</p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-auto align-self-end"
                    onClick={() => openModal("edit", cat)}
                  >
                    Edit
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Modal */}
      <Modal
        show={modalData.show}
        onHide={closeModal}
        centered
        backdrop="static"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              {modalData.mode === "add" ? "Add New" : "Edit"} Category
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                name="category_name"
                defaultValue={modalData.data?.category_name || ""}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                defaultValue={modalData.data?.description || ""}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {modalData.mode === "add" ? "Add" : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Category;
