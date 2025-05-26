
// import React from "react";
// import { Link } from "react-router-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Sidebar({ isOpen }) {
//   return (
//     <div
//       className={`sidebar-container ${isOpen ? "open" : ""}`}
//       style={{
//         height: "100vh",
//         background: "linear-gradient(to right, #ff7e5f, #ff7e5f)",
//         padding: "20px",
//         color: "white",
//         overflowY: "auto",
//         transition: "left 0.3s ease-in-out",
//       }}
//     >
//       <div className="p-2" style={{marginTop:"10PX"}}>
//         <ul className="nav flex-column">
//           <li className="nav-item mb-2">
//             <Link to="/" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-tachometer-alt me-2"></i>
//               <span>Dashboard</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/user_management" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-user me-2"></i>
//               <span>User Management</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/role_management" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-user-shield me-2"></i>
//               <span>Role Management</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/tables" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-table me-2"></i>
//               <span>Table List</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/typography" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-font me-2"></i>
//               <span>Typography</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/icons" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-icons me-2"></i>
//               <span>Staff</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/notifications" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-bell me-2"></i>
//               <span>Notifications</span>
//             </Link>
//           </li>
//           <li className="nav-item mb-2">
//             <Link to="/maps" className="nav-link text-white d-flex align-items-center">
//               <i className="fas fa-cog me-2"></i>
//               <span>Setting</span>
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// // export default Sidebar;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";


// function Sidebar({ isOpen, userRole }) {
//   const [menuItems, setMenuItems] = useState([]);
//   const [editingItem,setEditingItem] =useState(null)
//   const [newItem,setNewItem] = useState({title:"",path:"",icon:"",roles:"",parent_id:null,status:"active",order_by:0})
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);


//   useEffect(() => {
//   const fetchMenuItems = async () => {
//     try {
//       setIsLoading(true)
//       const response = await axios.get(`http://localhost:5001/menu?role=${userRole}`);
//       console.log("Menu items fetched:",response.data)
//       setMenuItems(response.data);
//       setIsLoading(false)
//     } catch (error) {
//       setError("Failed to load menu items");
//       setIsLoading(false)
//       console.error("Error fetching menu items:", error);
//     }
//   };
//   fetchMenuItems();
// }, [userRole]);



// const renderMenu = (items) => {
//   return items.map((item) => (
//     <li key={item.id} className="nav-item mb-2">
//       <div className={`d-flex justify-content-between align-items-center ${item.status === "inactive" ? "text-muted" : ""}`}>
//         <Link to={item.status === "active" ? item.path : "#"} className={`nav-link d-flex align-items-center ${item.status === "active" ? "text-white" : "text-secondary"}`}>
//           <i className={`${item.icon} me-2`}></i>
//           <span>{item.title}</span>
//         </Link>
//         <div>
//           <button className="btn btn-sm btn-light me-1" onClick={() => setEditingItem(item)}>Edit</button>
//           <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
//           <button className="btn btn-sm btn-warning" onClick={() => handleToggleStatus(item.id, item.status === "active" ? "inactive" : "active")}>
//             {item.status === "active" ? "Disable" : "Enable"}
//           </button>
//         </div>
//       </div>
//       {item.children && item.children.length > 0 && (
//         <ul className="nav flex-column ms-3">{renderMenu(item.children)}</ul>
//       )}
//     </li>
//   ));
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     if (editingItem) {
//       // Update existing item
//       await axios.put(`http://localhost:5001/menu/${editingItem.id}`, newItem);
//     } else {
//       // Add new item
//       await axios.post("http://localhost:5001/menu", newItem);
//     }

//     // Refresh the menu list
//     const response = await axios.get(`http://localhost:5001/menu?role=${userRole}`);
//     setMenuItems(response.data);

//     // Reset form and editing state
//     setNewItem({
//       title: "",
//       path: "",
//       icon: "",
//       roles: "",
//       parent_id: null,
//       status: "active",
//       order_by: 0
//     });
//     setEditingItem(null);
//   } catch (error) {
//     console.error("Error saving menu item:", error);
//   }
// };




//   // const renderMenu1 = (items) => {
//   //   return items.map((item) => (
//   //     <li key={item.id} className="nav-item mb-2">
//   //       <Link to={item.path} className="nav-link text-white d-flex align-items-center">
//   //         <i className={`${item.icon} me-2`}></i>
//   //         <span>{item.title}</span>
//   //       </Link>
//   //       {/* Render nested items if they exist */}
//   //       {item.children && item.children.length > 0 && (
//   //         <ul className="nav flex-column ms-3">{renderMenu(item.children)}</ul>
//   //       )}
//   //     </li>
//   //   ));
//   // };

//   return (
//     <div
//       className={`sidebar-container ${isOpen ? "open" : ""}`}
//       style={{
//         height: "100vh",
//         background: "linear-gradient(to right, #ff7e5f, #ff7e5f)",
//         padding: "20px",
//         color: "white",
//         overflowY: "auto",
//         transition: "left 0.3s ease-in-out",
//       }}
//     >
//       <div className="p-2" style={{ marginTop: "10px" }}>
//         {isLoading ? (
//           <p>Loading menu...</p>
//         ) : error ? (
//           <p>{error}</p>
//         ) : (
//           <ul className="nav flex-column">
//             {renderMenu(menuItems)}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Sidebar({ isOpen, userRole }) {
//   const [menuItems, setMenuItems] = useState([]);
//   const [editingItem, setEditingItem] = useState(null);
//   const [newItem, setNewItem] = useState({
//     title: "",
//     path: "",
//     icon: "",
//     roles: "",
//     parent_id: null,
//     status: "active",
//     order_by: 0,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchMenuItems();
//   }, [userRole]);

//   useEffect(() => {
//     if (editingItem) {
//       setNewItem({ ...editingItem });
//     }
//   }, [editingItem]);

//   const fetchMenuItems = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`http://localhost:5001/auth/menu?role=${userRole}`);
//       setMenuItems(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       setError("Failed to load menu items");
//       setIsLoading(false);
//       console.error("Error fetching menu items:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingItem) {
//         await axios.put(`http://localhost:5001/auth/menu/${editingItem.id}`, newItem);
//       } else {
//         await axios.post("http://localhost:5001/auth/menu", newItem);
//       }
//       await fetchMenuItems();
//       resetForm();
//     } catch (error) {
//       console.error("Error saving menu item:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this menu item?")) return;
//     try {
//       await axios.delete(`http://localhost:5001/auth/menu/${id}`);
//       await fetchMenuItems();
//     } catch (error) {
//       console.error("Error deleting menu item:", error);
//     }
//   };

//   const handleToggleStatus = async (id, newStatus) => {
//     try {
//       await axios.patch(`http://localhost:5001/auth/menu/${id}/status`, { status: newStatus });
//       await fetchMenuItems();
//     } catch (error) {
//       console.error("Error updating menu item status:", error);
//     }
//   };

//   const resetForm = () => {
//     setEditingItem(null);
//     setNewItem({
//       title: "",
//       path: "",
//       icon: "",
//       roles: "",
//       parent_id: null,
//       status: "active",
//       order_by: 0,
//     });
//   };

//   const renderMenu = (items) => {
//     return items.map((item) => (
//       <li key={item.id} className="nav-item mb-2">
//         <div className={`d-flex justify-content-between align-items-center ${item.status === "inactive" ? "text-muted" : ""}`}>
//           <Link
//             to={item.status === "active" ? item.path : "#"}
//             className={`nav-link d-flex align-items-center ${item.status === "active" ? "text-white" : "text-secondary"}`}
//           >
//             <i className={`${item.icon} me-2`}></i>
//             <span>{item.title}</span>
//           </Link>
//           <div>
//             <button className="btn btn-sm btn-light me-1" onClick={() => setEditingItem(item)}>Edit</button>
//             <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(item.id)}>Delete</button>
//             <button className="btn btn-sm btn-warning" onClick={() => handleToggleStatus(item.id, item.status === "active" ? "inactive" : "active")}>
//               {item.status === "active" ? "Disable" : "Enable"}
//             </button>
//           </div>
//         </div>
//         {item.children && item.children.length > 0 && (
//           <ul className="nav flex-column ms-3">{renderMenu(item.children)}</ul>
//         )}
//       </li>
//     ));
//   };

//   return (
//     <div
//       className={`sidebar-container ${isOpen ? "open" : ""}`}
//       style={{
//         height: "100vh",
//         background: "linear-gradient(to right, #ff7e5f, #ff7e5f)",
//         padding: "20px",
//         color: "white",
//         overflowY: "auto",
//         transition: "left 0.3s ease-in-out",
//       }}
//     >
//       <div className="p-2" style={{ marginTop: "10px" }}>
//         {isLoading ? (
//           <p>Loading menu...</p>
//         ) : error ? (
//           <p>{error}</p>
//         ) : (
//           <>
//             <form onSubmit={handleSubmit} className="bg-white text-dark p-3 mb-4 rounded">
//               <h5>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</h5>
//               <div className="mb-2">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Title"
//                   value={newItem.title}
//                   onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="mb-2">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Path"
//                   value={newItem.path}
//                   onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="mb-2">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Icon Class (e.g., fas fa-home)"
//                   value={newItem.icon}
//                   onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
//                 />
//               </div>
//               <div className="mb-2">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Roles (comma-separated)"
//                   value={newItem.roles}
//                   onChange={(e) => setNewItem({ ...newItem, roles: e.target.value })}
//                 />
//               </div>
//               <div className="mb-2">
//                 <select
//                   className="form-select"
//                   value={newItem.status}
//                   onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//               <div className="mb-2">
//                 <input
//                   type="number"
//                   className="form-control"
//                   placeholder="Order"
//                   value={newItem.order_by}
//                   onChange={(e) => setNewItem({ ...newItem, order_by: parseInt(e.target.value, 10) || 0 })}
//                 />
//               </div>
//               <div className="d-flex justify-content-between">
//                 <button type="submit" className="btn btn-primary">
//                   {editingItem ? "Update" : "Add"} Menu Item
//                 </button>
//                 {editingItem && (
//                   <button type="button" className="btn btn-secondary" onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </form>

//             <ul className="nav flex-column">
//               {renderMenu(menuItems)}
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Sidebar({ isOpen, userRole }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, [userRole]);

 const fetchMenuItems = async () => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token"); // or get token from context if you use it

    const response = await axios.get(
      `http://localhost:5001/auth/menu?role=${userRole}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMenuItems(response.data);
    setIsLoading(false);
  } catch (error) {
    setError("Failed to load menu items");
    setIsLoading(false);
  }
};


  const renderMenu = (items) =>
    items.map((item) => (
      <li key={item.id} className="nav-item mb-2">
        <Link
          to={item.status === "active" ? item.path : "#"}
          className={`nav-link d-flex align-items-center ${item.status === "active" ? "text-white" : "text-secondary"}`}
        >
          <i className={`${item.icon} me-2`}></i>
          <span>{item.title}</span>
        </Link>
        {item.children && item.children.length > 0 && (
          <ul className="nav flex-column ms-3">{renderMenu(item.children)}</ul>
        )}
      </li>
    ));

  return (
    <div
      className={`sidebar-container ${isOpen ? "open" : ""}`}
      style={{
        height: "100vh",
        background: "linear-gradient(to right, #ff7e5f, #ff7e5f)",
        padding: "20px",
        color: "white",
        overflowY: "auto",
        transition: "left 0.3s ease-in-out",
      }}
    >
      <div className="p-2 mt-2">
        {isLoading ? <p>Loading menu...</p> : error ? <p>{error}</p> : <ul className="nav flex-column">{renderMenu(menuItems)}</ul>}
      </div>
    </div>
  );
}

export default Sidebar;
