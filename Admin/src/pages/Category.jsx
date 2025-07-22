
// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import toast, { Toaster } from "react-hot-toast"; 



// function Category() {
//   const { token } = useContext(AuthContext);
//   const [categories, setCategories] = useState([]);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [categoryName, setCategoryName] = useState('');
//   const [categoryDescription, setCategoryDescription] = useState('');
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('http://localhost:5001/auth/categories', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCategories(response.data);
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
//     fetchCategories();
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
//         `http://localhost:5001/auth/categories/${editingCategory.id}`,
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
//       toast.success("Your Category has been edited successfully.");
//     } else {
 
//       await axios.post(
//         'http://localhost:5001/auth/categories',
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
//     fetchCategories();
//     setError(null);
//   } catch (err) {
//     console.error(err);
//     setError(editingCategory ? 'Failed to update category' : 'Failed to add category');
//   }
// };


//   const handleEditCategory = (category) => {
   
//     setEditingCategory(category);
//     setCategoryName(category.category_name);
//     setCategoryDescription(category.description);
//     setShowModal(true);
//   };

//   const handleDeleteCategory = async (id) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this category?');
//     if (confirmDelete) {
//       try {
//         await axios.delete(`http://localhost:5001/auth/categories/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         toast.success("Your Category has been deleted successfully.")
//         fetchCategories();
//       } catch (err) {
//         console.error(err);
//         setError('Failed to delete category');
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
//           <h3>Category</h3>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active">Category Management</li>
//             </ol>
//           </div>
//         </div>
//         <div className="d-flex gap-3">
//           <button
//             className="btn btn-success d-flex align-items-center"
//             onClick={() => setShowModal(true)}
//           >
//             <i className="fas fa-plus me-2"></i> Add Category
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
//             {categories.map((category) => (
//               <tr key={category.id}>
//                 <td>{category.category_name}</td>
//                 <td>{category.description}</td>
//                 <td>
//                   <button
//                     className="btn btn-outline-primary btn-sm"
//                     onClick={() => handleEditCategory(category)}
//                     title="Edit"
//                   >
//                     <i className="fas fa-edit"></i>
//                   </button>
//                   <button
//                     className="btn btn-outline-danger btn-sm ms-2"
//                     onClick={() => handleDeleteCategory(category.id)}
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

// export default Category;
