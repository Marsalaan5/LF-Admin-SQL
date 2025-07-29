
// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../../context/AuthContext';
// import toast, { Toaster } from "react-hot-toast"; 



// function Water() {
//   const { token } = useContext(AuthContext);
//   const [waterCategories, setWaterCategories] = useState([]);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [categoryName, setCategoryName] = useState('');
//   const [categoryDescription, setCategoryDescription] = useState('');
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   // Fetch categories
//   const fetchWaterCategories = async () => {
//     try {
//       const response = await axios.get('http://localhost:5001/auth/water-categories', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setWaterCategories(response.data);
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
//     fetchWaterCategories();
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
//         `http://localhost:5001/auth/water-categories/${editingCategory.id}`,
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
//       toast.success("Your Water Category has been edited successfully.");
//     } else {
 
//       await axios.post(
//         'http://localhost:5001/auth/water-categories',
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
//     fetchWaterCategories();
//     setError(null);
//   } catch (err) {
//     console.error(err);
//     setError(editingCategory ? 'Failed to update Water category' : 'Failed to add Water category');
//   }
// };


//   const handleEditCategory = (waterCategory) => {
   
//     setEditingCategory(waterCategory);
//     setCategoryName(waterCategory.category_name);
//     setCategoryDescription(waterCategory.description);
//     setShowModal(true);
//   };

//   const handleDeleteCategory = async (id) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this water category?');
//     if (confirmDelete) {
//       try {
//         await axios.delete(`http://localhost:5001/auth/water-categories/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         toast.success("Your Water Category has been deleted successfully.")
//         fetchWaterCategories();
//       } catch (err) {
//         console.error(err);
//         setError('Failed to delete water category');
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCategoryName('');
//     setCategoryDescription('');
//     setEditingCategory(null); 
//   };

//   return (
//     <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%"}}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <div className="col-sm-6">
//           <h3>Water Category</h3>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active">Water Category Management</li>
//             </ol>
//           </div>
//         </div>
//         <div className="d-flex gap-3">
//           <button
//             className="btn btn-success d-flex align-items-center"
//             onClick={() => setShowModal(true)}
//           >
//             <i className="fas fa-plus me-2"></i> Add Water Category
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
//             {waterCategories.map((waterCategory) => (
//               <tr key={waterCategory.id}>
//                 <td>{waterCategory.category_name}</td>
//                 <td>{waterCategory.description}</td>
//                 <td>
//                   <button
//                     className="btn btn-outline-primary btn-sm"
//                     onClick={() => handleEditCategory(waterCategory)}
//                     title="Edit"
//                   >
//                     <i className="fas fa-edit"></i>
//                   </button>
//                   <button
//                     className="btn btn-outline-danger btn-sm ms-2"
//                     onClick={() => handleDeleteCategory(waterCategory.id)}
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

// export default Water;



// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubCategory() {
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [modalData, setModalData] = useState({ show: false, mode: "add", parent: null, data: null });
//   const { token } = useContext(AuthContext);

//   const fetchData = async () => {
//     try {
//       const [catRes, subRes] = await Promise.all([
//         fetch("http://localhost:5001/auth/categories", { headers: { Authorization: `Bearer ${token}` } }),
//         fetch("http://localhost:5001/auth/subcategories", { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       if (!catRes.ok || !subRes.ok) throw new Error("Failed to fetch");

//       const [cats, subs] = await Promise.all([catRes.json(), subRes.json()]);

//       const subMap = new Map();
//       subs.forEach((sub) => subMap.set(sub.id, { ...sub, children: [] }));

//       const rootSubs = [];
//       subs.forEach((sub) => {
//         if (sub.parent_subcategory_id) {
//           const parent = subMap.get(sub.parent_subcategory_id);
//           if (parent) parent.children.push(subMap.get(sub.id));
//         } else {
//           rootSubs.push(subMap.get(sub.id));
//         }
//       });

//       setCategories(cats);
//       setSubcategories(rootSubs);
//     } catch (err) {
//       console.error(err);
//       alert("Error loading subcategories.");
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const openModal = (mode, parent = null, data = null) =>
//     setModalData({ show: true, mode, parent, data });
//   const closeModal = () => setModalData({ show: false, mode: "", parent: null, data: null });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = Object.fromEntries(new FormData(e.target));
//     const urlBase = "http://localhost:5001/auth/subcategories";
//     const method = modalData.mode === "add" ? "POST" : "PUT";

//     if (modalData.mode === "add") {
//       formData.category_id = modalData.parent.categoryId;
//       formData.parent_subcategory_id = modalData.parent.subcategoryId || null;
//     }

//     const url = modalData.mode === "add"
//       ? urlBase
//       : `${urlBase}/${modalData.data.id}`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to save subcategory");
//       closeModal();
//       fetchData();
//     } catch (err) {
//       alert("Error saving subcategory");
//       console.error(err);
//     }
//   };

//   const renderSubcategories = (subs, categoryId) => (
//     <ul className="list-group list-group-flush ms-4">
//       {subs.map((sub) => (
//         <li key={sub.id} className="list-group-item">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <strong>{sub.subcategory_name}</strong> - {sub.description}
//             </div>
//             <div>
//               <button
//                 className="btn btn-sm btn-outline-primary me-2"
//                 onClick={() => openModal("edit", null, sub)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="btn btn-sm btn-outline-success"
//                 onClick={() =>
//                   openModal("add", {
//                     categoryId,
//                     subcategoryId: sub.id,
//                   })
//                 }
//               >
//                 Add Child
//               </button>
//             </div>
//           </div>
//           {renderSubcategories(sub.children, categoryId)}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//      <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%"}}>
//             <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//       <h2>Subcategory Manager</h2>
//       {categories.map((cat) => (
//         <div key={cat.id} className="mb-3">
//           <div className="d-flex justify-content-between">
//             <h5>{cat.category_name}</h5>
//             <button
//               className="btn btn-sm btn-outline-success"
//               onClick={() => openModal("add", { categoryId: cat.id })}
//             >
//               Add Subcategory
//             </button>
//           </div>
//           {renderSubcategories(
//             subcategories.filter((sub) => sub.category_id === cat.id),
//             cat.id
//           )}
//         </div>
//       ))}

//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {modalData.mode === "add" ? "Add" : "Edit"} Subcategory
//                   </h5>
//                   <button type="button" className="btn-close" onClick={closeModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Subcategory Name</label>
//                     <input
//                       type="text"
//                       name="subcategory_name"
//                       className="form-control"
//                       defaultValue={modalData.data?.subcategory_name || ""}
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
//     </div>
//   );
// }

// export default SubCategory;



// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubCategory() {
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [modalData, setModalData] = useState({
//     show: false,
//     mode: "add",
//     parent: null,
//     data: null,
//   });
//   const { token } = useContext(AuthContext);

//   // Fetch categories and subcategories
//   const fetchData = async () => {
//     try {
//       const [catRes, subRes] = await Promise.all([
//         fetch("http://localhost:5001/auth/categories", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch("http://localhost:5001/auth/categories/:categoryId/subcategories", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (!catRes.ok || !subRes.ok) throw new Error("Failed to fetch");

//       const [cats, subs] = await Promise.all([catRes.json(), subRes.json()]);

//       // Build tree structure for nested subcategories
//       const subMap = new Map();
//       subs.forEach((sub) => subMap.set(sub.id, { ...sub, children: [] }));

//         const rootSubs = [];
//         subs.forEach((sub) => {
//           if (sub.parent_subcategory_id) {
//             const parent = subMap.get(sub.parent_subcategory_id);
//             if (parent) parent.children.push(subMap.get(sub.id));
//           } else {
//             rootSubs.push(subMap.get(sub.id));
//           }
//         });

//         setCategories(cats);
//         setSubcategories(rootSubs);
//       } catch (err) {
//         console.error("Error loading subcategories:", err);
//         alert("Failed to load data.");
//       }
//     };

//   useEffect(() => {
//     if (token) fetchData();
//   }, [token]);

//   const openModal = (mode, parent = null, data = null) =>
//     setModalData({ show: true, mode, parent, data });

//   const closeModal = () =>
//     setModalData({ show: false, mode: "", parent: null, data: null });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = Object.fromEntries(new FormData(e.target));
//     const method = modalData.mode === "add" ? "POST" : "PUT";
//     const urlBase = "http://localhost:5001/auth/categories/:categoryId/subcategories";

//     // Add required fields for "add"
//     if (modalData.mode === "add") {
//       formData.category_id = modalData.parent.categoryId;
//       formData.parent_subcategory_id = modalData.parent.subcategoryId || null;
//     }

//     const url =
//       modalData.mode === "add"
//         ? urlBase
//         : `${urlBase}/${modalData.data.id}`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to save subcategory");
//       closeModal();
//       fetchData();
//     } catch (err) {
//       console.error("Error saving subcategory:", err);
//       alert("Failed to save subcategory.");
//     }
//   };

//   const renderSubcategories = (subs, categoryId) => (
//     <ul className="list-group list-group-flush ms-4">
//       {subs.map((sub) => (
//         <li key={sub.id} className="list-group-item">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <strong>{sub.subcategory_name}</strong> - {sub.description}
//             </div>
//             <div>
//               <button
//                 className="btn btn-sm btn-outline-primary me-2"
//                 onClick={() => openModal("edit", null, sub)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="btn btn-sm btn-outline-success"
//                 onClick={() =>
//                   openModal("add", {
//                     categoryId,
//                     subcategoryId: sub.id,
//                   })
//                 }
//               >
//                 Add Child
//               </button>
//             </div>
//           </div>
//           {sub.children && sub.children.length > 0 && renderSubcategories(sub.children, categoryId)}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <div
//       className="container-fluid border shadow-sm"
//       style={{ marginTop: "100px", width: "98%" }}
//     >
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <h2>Subcategory Manager</h2>
//       </div>

//       {categories.map((cat) => (
//         <div key={cat.id} className="mb-4">
//           <div className="d-flex justify-content-between align-items-center">
//             <h5>{cat.category_name}</h5>
//             <button
//               className="btn btn-sm btn-outline-success"
//               onClick={() => openModal("add", { categoryId: cat.id })}
//             >
//               Add Subcategory
//             </button>
//           </div>
//           {renderSubcategories(
//             subcategories.filter((sub) => sub.category_id === cat.id),
//             cat.id
//           )}
//         </div>
//       ))}

//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {modalData.mode === "add" ? "Add" : "Edit"} Subcategory
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={closeModal}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Subcategory Name</label>
//                     <input
//                       type="text"
//                       name="subcategory_name"
//                       className="form-control"
//                       defaultValue={modalData.data?.subcategory_name || ""}
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

// export default SubCategory;


// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubCategory() {
//   const { token } = useContext(AuthContext);

//   const [categories, setCategories] = useState([]);
//   // subcategoriesByCategory: { [categoryId]: [subcategories] }
//   const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});

//   const [modalData, setModalData] = useState({
//     show: false,
//     mode: "add", // "add" or "edit"
//     parent: null, // { categoryId, subcategoryId? }
//     data: null,   // subcategory data when editing
//   });

//   // Fetch categories and subcategories for each category
//   const fetchData = async () => {
//     try {
//       // Fetch categories
//       const catRes = await fetch("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!catRes.ok) throw new Error("Failed to fetch categories");
//       const cats = await catRes.json();

//       // Fetch subcategories for each category in parallel
//       const subcatPromises = cats.map((cat) =>
//         fetch(`http://localhost:5001/auth/categories/${cat.id}/subcategories`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }).then((res) => {
//           if (!res.ok)
//             throw new Error(`Failed to fetch subcategories for category ${cat.id}`);
//           return res.json();
//         })
//       );

//       const allSubs = await Promise.all(subcatPromises);

//       // Build a map from categoryId to subcategories array
//       const subByCat = {};
//       cats.forEach((cat, i) => {
//         subByCat[cat.id] = allSubs[i];
//       });

//       setCategories(cats);
//       setSubcategoriesByCategory(subByCat);
//     } catch (err) {
//       console.error("Error loading data:", err);
//       alert("Failed to load data.");
//     }
//   };

//   useEffect(() => {
//     if (token) fetchData();
//   }, [token]);

//   // Modal control
//   const openModal = (mode, parent = null, data = null) => {
//     setModalData({ show: true, mode, parent, data });
//   };

//   const closeModal = () => {
//     setModalData({ show: false, mode: "", parent: null, data: null });
//   };

//   // Handle add/edit submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = Object.fromEntries(new FormData(e.target));

//     const isAdd = modalData.mode === "add";
//     const categoryId = modalData.parent?.categoryId || modalData.data?.category_id;
//     if (!categoryId) {
//       alert("Category ID missing!");
//       return;
//     }

//     // For adding, include category_id and parent_subcategory_id (if adding child)
//     if (isAdd) {
//       formData.category_id = categoryId;
//       formData.parent_subcategory_id = modalData.parent?.subcategoryId || null;
//     }

//     // Construct URL for add or edit
//     const baseUrl = `http://localhost:5001/auth/categories/${categoryId}/subcategories`;
//     const url = isAdd ? baseUrl : `${baseUrl}/${modalData.data.id}`;

//     try {
//       const res = await fetch(url, {
//         method: isAdd ? "POST" : "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to save subcategory");

//       closeModal();
//       fetchData(); // Refresh data after successful save
//     } catch (err) {
//       console.error("Error saving subcategory:", err);
//       alert("Failed to save subcategory.");
//     }
//   };

//   // Recursively render nested subcategories (children)
//   const renderSubcategories = (subs, categoryId) => {
//     // Build map for children based on parent_subcategory_id
//     const subMap = new Map();
//     subs.forEach((sub) => subMap.set(sub.id, { ...sub, children: [] }));

//     const roots = [];
//     subs.forEach((sub) => {
//       if (sub.parent_subcategory_id) {
//         const parent = subMap.get(sub.parent_subcategory_id);
//         if (parent) parent.children.push(subMap.get(sub.id));
//       } else {
//         roots.push(subMap.get(sub.id));
//       }
//     });

//     const renderList = (nodes) => (
//       <ul className="list-group list-group-flush ms-4">
//         {nodes.map((sub) => (
//           <li key={sub.id} className="list-group-item">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <strong>{sub.subcategory_name}</strong> - {sub.description}
//               </div>
//               <div>
//                 <button
//                   className="btn btn-sm btn-outline-primary me-2"
//                   onClick={() => openModal("edit", null, sub)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-sm btn-outline-success"
//                   onClick={() =>
//                     openModal("add", { categoryId, subcategoryId: sub.id })
//                   }
//                 >
//                   Add Child
//                 </button>
//               </div>
//             </div>
//             {sub.children.length > 0 && renderList(sub.children)}
//           </li>
//         ))}
//       </ul>
//     );

//     return renderList(roots);
//   };

//   return (
//     <div
//       className="container-fluid border shadow-sm"
//       style={{ marginTop: "100px", width: "98%" }}
//     >
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <h2>Subcategory Manager</h2>
//       </div>

//       {categories.map((cat) => (
//         <div key={cat.id} className="mb-4">
//           <div className="d-flex justify-content-between align-items-center">
//             <h5>{cat.category_name}</h5>
//             <button
//               className="btn btn-sm btn-outline-success"
//               onClick={() => openModal("add", { categoryId: cat.id })}
//             >
//               Add Subcategory
//             </button>
//           </div>
//           {renderSubcategories(subcategoriesByCategory[cat.id] || [], cat.id)}
//         </div>
//       ))}

//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {modalData.mode === "add" ? "Add" : "Edit"} Subcategory
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={closeModal}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Subcategory Name</label>
//                     <input
//                       type="text"
//                       name="subcategory_name"
//                       className="form-control"
//                       defaultValue={modalData.data?.subcategory_name || ""}
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

// export default SubCategory;


// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubCategory() {
//   const { token } = useContext(AuthContext);
//   const [categories, setCategories] = useState([]);
//   const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
//   const [modalData, setModalData] = useState({
//     show: false,
//     mode: "add", // "add" or "edit"
//     parent: null, // { categoryId, subcategoryId? }
//     data: null,   // subcategory data when editing
//   });

//   const fetchData = async () => {
//     try {
//       const catRes = await fetch("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!catRes.ok) throw new Error("Failed to fetch categories");
//       const cats = await catRes.json();

//       const subcatPromises = cats.map((cat) =>
//         fetch(`http://localhost:5001/auth/categories/${cat.id}/subcategories`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }).then((res) => {
//           if (!res.ok) throw new Error(`Failed to fetch subcategories for category ${cat.id}`);
//           return res.json();
//         })
//       );

//       const allSubs = await Promise.all(subcatPromises);
//       const subByCat = {};
//       cats.forEach((cat, i) => {
//         subByCat[cat.id] = allSubs[i];
//       });

//       setCategories(cats);
//       setSubcategoriesByCategory(subByCat);
//     } catch (err) {
//       console.error("Error loading data:", err);
//       alert("Failed to load data.");
//     }
//   };

//   useEffect(() => {
//     if (token) fetchData();
//   }, [token]);

//   const openModal = (mode, parent = null, data = null) => {
//     setModalData({ show: true, mode, parent, data });
//   };

//   const closeModal = () => {
//     setModalData({ show: false, mode: "", parent: null, data: null });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = Object.fromEntries(new FormData(e.target));
//     const isAdd = modalData.mode === "add";
//     const categoryId = modalData.parent?.categoryId || modalData.data?.category_id;

//     if (!categoryId) {
//       alert("Category ID missing!");
//       return;
//     }

//     if (isAdd) {
//       formData.category_id = categoryId;
//       formData.parent_subcategory_id = modalData.parent?.subcategoryId || null;
//     }

//     const baseUrl = `http://localhost:5001/auth/categories/${categoryId}/subcategories`;
//     const url = isAdd ? baseUrl : `${baseUrl}/${modalData.data.id}`;

//     try {
//       const res = await fetch(url, {
//         method: isAdd ? "POST" : "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to save subcategory");
//       closeModal();
//       fetchData();
//     } catch (err) {
//       console.error("Error saving subcategory:", err);
//       alert("Failed to save subcategory.");
//     }
//   };

//   const renderSubcategories = (subs, categoryId) => {
//     const subMap = new Map();
//     subs.forEach((sub) => subMap.set(sub.id, { ...sub, children: [] }));

//     const roots = [];
//     subs.forEach((sub) => {
//       if (sub.parent_subcategory_id) {
//         const parent = subMap.get(sub.parent_subcategory_id);
//         if (parent) parent.children.push(subMap.get(sub.id));
//       } else {
//         roots.push(subMap.get(sub.id));
//       }
//     });

//     const renderList = (nodes, level = 0) => (
//       <ul className={`list-group list-group-flush ms-${level * 2}`}>
//         {nodes.map((sub) => (
//           <li key={sub.id} className="list-group-item">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <strong>{sub.subcategory_name}</strong> — {sub.description}
//               </div>
//               <div>
//                 <button
//                   className="btn btn-sm btn-outline-primary me-2"
//                   onClick={() => openModal("edit", null, sub)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-sm btn-outline-success"
//                   onClick={() =>
//                     openModal("add", { categoryId, subcategoryId: sub.id })
//                   }
//                 >
//                   Add Child
//                 </button>
//               </div>
//             </div>
//             {sub.children.length > 0 && renderList(sub.children, level + 1)}
//           </li>
//         ))}
//       </ul>
//     );

//     return renderList(roots);
//   };

//   return (
//     // <div className="container mt-5">
//     //   <div className="d-flex justify-content-between align-items-center mb-4">
//      <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%"}}>     <div className="d-flex justify-content-between align-items-center mt-5 mb-3"></div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold">Subcategory Manager</h2>
//       </div>

//       <div className="row">
//         {categories.map((cat) => (
//           <div key={cat.id} className="col-12 mb-4">
//             <div className="card shadow-sm border-0">
//               <div className="card-header d-flex justify-content-between align-items-center bg-light">
//                 <h5 className="mb-0">{cat.category_name}</h5>
//                 <button
//                   className="btn btn-sm btn-outline-success"
//                   onClick={() => openModal("add", { categoryId: cat.id })}
//                 >
//                   + Add Subcategory
//                 </button>
//               </div>
//               <div className="card-body">
//                 {renderSubcategories(subcategoriesByCategory[cat.id] || [], cat.id)}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content shadow">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header bg-primary text-white">
//                   <h5 className="modal-title">
//                     {modalData.mode === "add" ? "Add New" : "Edit"} Subcategory
//                   </h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Subcategory Name</label>
//                     <input
//                       type="text"
//                       name="subcategory_name"
//                       className="form-control"
//                       defaultValue={modalData.data?.subcategory_name || ""}
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

// export default SubCategory;



// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubCategory() {
//   const { token } = useContext(AuthContext);
//   const [categories, setCategories] = useState([]);
//   const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
//   const [modalData, setModalData] = useState({
//     show: false,
//     mode: "add", // "add" or "edit"
//     parent: null, // { categoryId, subcategoryId? }
//     data: null,   // subcategory data when editing
//   });

//   const fetchData = async () => {
//     try {
//       const catRes = await fetch("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!catRes.ok) throw new Error("Failed to fetch categories");
//       const cats = await catRes.json();

//       const subcatPromises = cats.map((cat) =>
//         fetch(`http://localhost:5001/auth/categories/${cat.id}/subcategories`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }).then((res) => {
//           if (!res.ok) throw new Error(`Failed to fetch subcategories for category ${cat.id}`);
//           return res.json();
//         })
//       );

//       const allSubs = await Promise.all(subcatPromises);
//       const subByCat = {};
//       cats.forEach((cat, i) => {
//         subByCat[cat.id] = allSubs[i];
//       });

//       setCategories(cats);
//       setSubcategoriesByCategory(subByCat);
//     } catch (err) {
//       console.error("Error loading data:", err);
//       alert("Failed to load data.");
//     }
//   };

//   useEffect(() => {
//     if (token) fetchData();
//   }, [token]);

//   const openModal = (mode, parent = null, data = null) => {
//     setModalData({ show: true, mode, parent, data });
//   };

//   const closeModal = () => {
//     setModalData({ show: false, mode: "", parent: null, data: null });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = Object.fromEntries(new FormData(e.target));
//     const isAdd = modalData.mode === "add";
//     const categoryId = modalData.parent?.categoryId || modalData.data?.category_id;

//     if (!categoryId) {
//       alert("Category ID missing!");
//       return;
//     }

//     if (isAdd) {
//       formData.category_id = categoryId;
//       formData.parent_subcategory_id = modalData.parent?.subcategoryId || null;
//     }

//     const baseUrl = `http://localhost:5001/auth/categories/${categoryId}/subcategories`;
//     const url = isAdd ? baseUrl : `${baseUrl}/${modalData.data.id}`;

//     try {
//       const res = await fetch(url, {
//         method: isAdd ? "POST" : "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to save subcategory");
//       closeModal();
//       fetchData();
//     } catch (err) {
//       console.error("Error saving subcategory:", err);
//       alert("Failed to save subcategory.");
//     }
//   };

//   // Helper: flatten subcategories into array with level info for indentation
//   const flattenSubcategories = (subs) => {
//     const subMap = new Map();
//     subs.forEach((sub) => subMap.set(sub.id, { ...sub, children: [] }));

//     const roots = [];
//     subs.forEach((sub) => {
//       if (sub.parent_subcategory_id) {
//         const parent = subMap.get(sub.parent_subcategory_id);
//         if (parent) parent.children.push(subMap.get(sub.id));
//       } else {
//         roots.push(subMap.get(sub.id));
//       }
//     });

//     const flatList = [];
//     const traverse = (nodes, level = 0) => {
//       nodes.forEach((node) => {
//         flatList.push({ ...node, level });
//         if (node.children.length > 0) {
//           traverse(node.children, level + 1);
//         }
//       });
//     };
//     traverse(roots);
//     return flatList;
//   };

//   return (
//     <div className="container-fluid border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold">Subcategory Manager</h2>
//       </div>

//       {/* Categories in grid */}
//       <div className="row">
//         {categories.map((cat) => {
//           const subcategories = subcategoriesByCategory[cat.id] || [];
//           const flatSubs = flattenSubcategories(subcategories);

//           return (
//             <div key={cat.id} className="col-md-4 mb-4">
//               {/* Category Card */}
//               <div className="card shadow-sm border-0 mb-3">
//                 <div className="card-body d-flex justify-content-between align-items-center bg-light">
//                   <div>
//                     <p className="mb-1">
//                       <strong>Category ID:</strong> {cat.id}
//                     </p>
//                     <h6 className="card-title mb-0">
//                       <strong>Category Name:</strong> {cat.category_name}
//                     </h6>
//                   </div>
//                   <button
//                     className="btn btn-sm btn-outline-success"
//                     onClick={() => openModal("add", { categoryId: cat.id })}
//                   >
//                     + Add Subcategory
//                   </button>
//                 </div>

//                 {/* Subcategory Cards in grid inside category card */}
//                 {flatSubs.length === 0 ? (
//                   <p className="text-muted mt-3">No subcategories available.</p>
//                 ) : (
//                   <div className="row mt-3">
//                     {flatSubs.map((sub) => (
//                       <div
//                         key={sub.id}
//                         className="col-12 col-md-6 mb-3"
//                         style={{ paddingLeft: `${sub.level * 15}px` }} // slight indent for levels
//                       >
//                         <div className="card shadow-sm h-100">
//                           <div className="card-body">
//                             <p className="mb-1">
//                               {/* <strong>Category ID:</strong> {cat.id} &nbsp;|&nbsp;  */}
                              
                              
//                               <strong>Subcategory ID:</strong> {sub.id}
//                             </p>
//                             <h6 className="card-title mb-1">
//                               <strong>Subcategory Name:</strong> {sub.subcategory_name}
//                             </h6>
//                             <p className="card-text mb-2">
//                               <strong>Description:</strong> {sub.description}
//                             </p>
//                             <div>
//                               <button
//                                 className="btn btn-sm btn-outline-primary me-2 align-self-end"
//                                 onClick={() => openModal("edit", null, sub)}
//                               >
//                                 Edit
//                               </button>
//                               {/* <button
//                                 className="btn btn-sm btn-outline-success"
//                                 onClick={() =>
//                                   openModal("add", { categoryId: cat.id, subcategoryId: sub.id })
//                                 }
//                               >
//                                 Add Child
//                               </button> */}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Modal */}
//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content shadow">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header bg-primary text-white">
//                   <h5 className="modal-title">
//                     {modalData.mode === "add" ? "Add New" : "Edit"} Subcategory
//                   </h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Subcategory Name</label>
//                     <input
//                       type="text"
//                       name="subcategory_name"
//                       className="form-control"
//                       defaultValue={modalData.data?.subcategory_name || ""}
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

// export default SubCategory;



// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubCategory() {
//   const { token } = useContext(AuthContext);
//   const [categories, setCategories] = useState([]);
//   const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
//   const [modalData, setModalData] = useState({ show: false, mode: "add" });
//   const [formData, setFormData] = useState({
//     category_id: "",
//     parent_subcategory_id: "",
//     subcategory_name: "",
//     description: "",
//   });

//   useEffect(() => {
//     if (token) fetchData();
//   }, [token]);

//   const fetchData = async () => {
//     try {
//       const catRes = await fetch("http://localhost:5001/auth/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const cats = await catRes.json();
//       setCategories(cats);

//     //   const subcatPromises = cats.map((cat) =>
//     //     fetch(`http://localhost:5001/auth/categories/${cat.id}/subcategories`, {
//     //       headers: { Authorization: `Bearer ${token}` },
//     //     }).then((res) => res.json())
//     //   );

//     //   const allSubs = await Promise.all(subcatPromises);
//     //   const subByCat = {};
//     //   cats.forEach((cat, i) => {
//     //     subByCat[cat.id] = allSubs[i];
//     //   });

//     //   setSubcategoriesByCategory(subByCat);
//     // }
//     const subRes = await fetch("http://localhost:5001/auth/subcategories", {
//   headers: { Authorization: `Bearer ${token}` },
// });
// const allSubcategories = await subRes.json();

// const subByCat = {};
// for (const sub of allSubcategories) {
//   const catId = sub.category_id;
//   if (!subByCat[catId]) subByCat[catId] = [];
//   subByCat[catId].push(sub);
// }
// setSubcategoriesByCategory(subByCat);
//     }
    
//     catch (err) {
//       console.error("Error fetching data:", err);
//       alert("Failed to fetch categories/subcategories.");
//     }
//   };

//   const openModal = () => {
//     setModalData({ show: true, mode: "add" });
//     setFormData({
//       category_id: "",
//       parent_subcategory_id: "",
//       subcategory_name: "",
//       description: "",
//     });
//   };

//   const closeModal = () => {
//     setModalData({ show: false, mode: "add" });
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       parent_subcategory_id: formData.parent_subcategory_id || null,
//     };

//     try {
//       const res = await fetch(
//         `http://localhost:5001/auth/categories/${formData.category_id}/subcategories`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to add subcategory");
//       closeModal();
//       fetchData();
//     } catch (err) {
//       console.error("Error saving subcategory:", err);
//       alert("Failed to save subcategory.");
//     }
//   };

//   return (
//     <div className="container-fluid border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         {/* <h2 className="fw-bold">Subcategory Manager</h2> */}
//            <div className="col-sm-6">
//                 <h3>SubCategory Management</h3>
//                 <div className="col-sm-6">
//                   <ol className="breadcrumb float-sm-right">
//                     <li className="breadcrumb-item">
//                       <a href="/">Home</a>
//                     </li>
//                     <li className="breadcrumb-item active">SubCategory Management</li>
//                   </ol>
//                 </div>
//               </div>
//         <button className="btn btn-success" onClick={openModal}>
//           + Add Subcategory
//         </button>
//       </div>

//       {/* Category Cards Grid */}
//       <div className="row">
//         {categories.map((cat) => (
//           <div key={cat.id} className="col-md-4 mb-4">
//             <div className="card shadow-sm border-0">
//               <div className="card-header bg-light">
//                 <strong>Category ID:</strong> {cat.id}
//                 <br />
//                 <strong>Category Name:</strong> {cat.category_name}
//               </div>
//               <div className="card-body">
//                 {(subcategoriesByCategory[cat.id] || []).length === 0 ? (
//                   <p className="text-muted">No subcategories.</p>
//                 ) : (
//                   (subcategoriesByCategory[cat.id] || []).map((sub) => (
//                     <div key={sub.id} className="mb-3 p-2 border rounded bg-light">
//                       <p className="mb-1">
//                         <strong>Subcategory ID:</strong> {sub.id}
//                       </p>
//                       <p className="mb-1">
//                         <strong>Subcategory Name:</strong> {sub.subcategory_name}
//                       </p>
//                       <p className="mb-1">
//                         <strong>Description:</strong> {sub.description}
//                       </p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Subcategory Modal */}
//       {modalData.show && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content shadow">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header bg-primary text-white">
//                   <h5 className="modal-title">Add Subcategory</h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Category</label>
//                     <select
//                       name="category_id"
//                       className="form-select"
//                       value={formData.category_id}
//                       onChange={handleChange}
//                       required
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map((cat) => (
//                         <option key={cat.id} value={cat.id}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Parent Subcategory (Optional)</label>
//                     <select
//                       name="parent_subcategory_id"
//                       className="form-select"
//                       value={formData.parent_subcategory_id}
//                       onChange={handleChange}
//                       disabled={!formData.category_id}
//                     >
//                       <option value="">None</option>
//                       {(subcategoriesByCategory[formData.category_id] || []).map((sub) => (
//                         <option key={sub.id} value={sub.id}>
//                           {sub.subcategory_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Subcategory Name</label>
//                     <input
//                       type="text"
//                       name="subcategory_name"
//                       className="form-control"
//                       value={formData.subcategory_name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Description</label>
//                     <textarea
//                       name="description"
//                       className="form-control"
//                       value={formData.description}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={closeModal}>
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     Add
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

// export default SubCategory;



import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Breadcrumb,
} from "react-bootstrap";

function SubCategory() {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
  const [modalData, setModalData] = useState({ show: false, mode: "add" });
  const [formData, setFormData] = useState({
    category_id: "",
    parent_subcategory_id: "",
    subcategory_name: "",
    description: "",
  });

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const catRes = await fetch("http://localhost:5001/auth/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cats = await catRes.json();
      setCategories(cats);

      const subRes = await fetch("http://localhost:5001/auth/subcategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allSubcategories = await subRes.json();

      const subByCat = {};
      for (const sub of allSubcategories) {
        const catId = sub.category_id;
        if (!subByCat[catId]) subByCat[catId] = [];
        subByCat[catId].push(sub);
      }
      setSubcategoriesByCategory(subByCat);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to fetch categories/subcategories.");
    }
  };

  const openModal = () => {
    setModalData({ show: true, mode: "add" });
    setFormData({
      category_id: "",
      parent_subcategory_id: "",
      subcategory_name: "",
      description: "",
    });
  };

  const closeModal = () => {
    setModalData({ show: false, mode: "add" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      parent_subcategory_id: formData.parent_subcategory_id || null,
    };

    try {
      const res = await fetch(
        `http://localhost:5001/auth/categories/${formData.category_id}/subcategories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to add subcategory");
      closeModal();
      fetchData();
    } catch (err) {
      console.error("Error saving subcategory:", err);
      alert("Failed to save subcategory.");
    }
  };

  return (
    <Container fluid className="border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div>
          <h3>SubCategory Management</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>SubCategory Management</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Button variant="success" onClick={openModal}>
          + Add Subcategory
        </Button>
      </div>

      {/* Category Cards Grid */}
      <Row>
        {categories.map((cat) => (
          <Col key={cat.id} md={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light">
                <strong>Category ID:</strong> {cat.id}
                <br />
                <strong>Category Name:</strong> {cat.category_name}
              </Card.Header>
              <Card.Body>
                {(subcategoriesByCategory[cat.id] || []).length === 0 ? (
                  <p className="text-muted">No subcategories.</p>
                ) : (
                  subcategoriesByCategory[cat.id].map((sub) => (
                    <div key={sub.id} className="mb-3 p-2 border rounded bg-light">
                      <p className="mb-1">
                        <strong>Subcategory ID:</strong> {sub.id}
                      </p>
                      <p className="mb-1">
                        <strong>Subcategory Name:</strong> {sub.subcategory_name}
                      </p>
                      <p className="mb-1">
                        <strong>Description:</strong> {sub.description}
                      </p>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Subcategory Modal */}
      <Modal
        show={modalData.show}
        onHide={closeModal}
        centered
        backdrop="static"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Add Subcategory</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parent Subcategory (Optional)</Form.Label>
              <Form.Select
                name="parent_subcategory_id"
                value={formData.parent_subcategory_id}
                onChange={handleChange}
                disabled={!formData.category_id}
              >
                <option value="">None</option>
                {(subcategoriesByCategory[formData.category_id] || []).map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subcategory_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subcategory Name</Form.Label>
              <Form.Control
                type="text"
                name="subcategory_name"
                value={formData.subcategory_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default SubCategory;
